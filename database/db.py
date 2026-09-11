"""
KrishiLink Database Connection & Transaction Manager
Supports pure PyMySQL for MySQL database operations,
with parameterized SQL execution, row locking, and transaction control.
Also includes seamless fallback to SQLite for environments where MySQL is not yet active.
"""

import os
import re
import sqlite3
import pymysql
import pymysql.cursors
from config import Config

_USE_SQLITE_FALLBACK = False

class SQLiteCursorWrapper:
    """Wraps SQLite cursor to match PyMySQL DictCursor interface."""
    def __init__(self, cursor):
        self._cursor = cursor

    @property
    def lastrowid(self):
        return self._cursor.lastrowid

    @property
    def rowcount(self):
        return self._cursor.rowcount

    def execute(self, query, args=()):
        # Translate MySQL query to SQLite
        sql = query.replace('%s', '?')
        # Remove FOR UPDATE since SQLite handles write locks at DB level
        sql = re.sub(r'\s+FOR\s+UPDATE', '', sql, flags=re.IGNORECASE)
        sql = re.sub(r'NOW\(\)', 'CURRENT_TIMESTAMP', sql, flags=re.IGNORECASE)
        sql = re.sub(r"DATE_FORMAT\(([^,]+),\s*'[^']+'\)", r"strftime('%H:%M', \1)", sql, flags=re.IGNORECASE)
        # Handle double percent escaping %%
        sql = sql.replace('%%', '%')
        return self._cursor.execute(sql, args)

    def fetchone(self):
        row = self._cursor.fetchone()
        if row is None:
            return None
        return dict(row)

    def fetchall(self):
        rows = self._cursor.fetchall()
        return [dict(r) for r in rows]

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._cursor.close()

class SQLiteConnWrapper:
    """Wraps SQLite connection to match PyMySQL interface."""
    def __init__(self, conn):
        self._conn = conn
        self._conn.row_factory = sqlite3.Row

    def cursor(self):
        return SQLiteCursorWrapper(self._conn.cursor())

    def commit(self):
        self._conn.commit()

    def rollback(self):
        self._conn.rollback()

    def close(self):
        self._conn.close()

def _create_sqlite_tables(conn):
    """Initializes SQLite tables matching schema.sql."""
    statements = [
        """CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phone TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL,
            full_name TEXT NOT NULL,
            email TEXT,
            state TEXT,
            district TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""",
        """CREATE TABLE IF NOT EXISTS farmers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            kisan_id TEXT UNIQUE NOT NULL,
            farm_location TEXT,
            primary_crops TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )""",
        """CREATE TABLE IF NOT EXISTS fpos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            fpo_code TEXT UNIQUE NOT NULL,
            fpo_name TEXT NOT NULL,
            reg_number TEXT,
            warehouse_location TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )""",
        """CREATE TABLE IF NOT EXISTS distributors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            distributor_code TEXT UNIQUE NOT NULL,
            business_name TEXT NOT NULL,
            business_type TEXT,
            city TEXT,
            storage_capacity TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )""",
        """CREATE TABLE IF NOT EXISTS delivery_agents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            agent_code TEXT UNIQUE NOT NULL,
            vehicle_type TEXT,
            vehicle_number TEXT,
            status TEXT DEFAULT 'available',
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )""",
        """CREATE TABLE IF NOT EXISTS produce (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farmer_id INTEGER NOT NULL,
            crop_name TEXT NOT NULL,
            variety TEXT,
            quantity REAL NOT NULL,
            unit TEXT DEFAULT 'kg',
            expected_price REAL NOT NULL,
            location TEXT,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
        )""",
        """CREATE TABLE IF NOT EXISTS farmer_requirements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            req_code TEXT UNIQUE NOT NULL,
            farmer_id INTEGER NOT NULL,
            produce_id INTEGER,
            crop_name TEXT NOT NULL,
            quantity REAL NOT NULL,
            unit TEXT DEFAULT 'kg',
            pickup_location TEXT NOT NULL,
            destination_location TEXT NOT NULL,
            pickup_window TEXT,
            notes TEXT,
            compensation REAL DEFAULT 0.0,
            trip_distance_km REAL DEFAULT 0.0,
            delivery_agent_id INTEGER,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            accepted_at TIMESTAMP,
            delivered_at TIMESTAMP,
            FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
            FOREIGN KEY (delivery_agent_id) REFERENCES delivery_agents(id) ON DELETE SET NULL
        )""",
        """CREATE TABLE IF NOT EXISTS auctions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lot_code TEXT UNIQUE NOT NULL,
            fpo_id INTEGER NOT NULL,
            product_name TEXT NOT NULL,
            category TEXT DEFAULT 'grains',
            description TEXT,
            quality_grade TEXT DEFAULT 'A',
            quality_specs TEXT,
            quantity REAL NOT NULL,
            unit TEXT DEFAULT 'kg',
            starting_price REAL NOT NULL,
            min_increment REAL DEFAULT 0.50,
            current_highest_bid REAL NOT NULL,
            current_highest_bidder_id INTEGER,
            start_time TIMESTAMP NOT NULL,
            end_time TIMESTAMP NOT NULL,
            status TEXT DEFAULT 'active',
            winner_id INTEGER,
            image_url TEXT,
            hub_location TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (fpo_id) REFERENCES fpos(id) ON DELETE CASCADE,
            FOREIGN KEY (current_highest_bidder_id) REFERENCES distributors(id) ON DELETE SET NULL,
            FOREIGN KEY (winner_id) REFERENCES distributors(id) ON DELETE SET NULL
        )""",
        """CREATE TABLE IF NOT EXISTS bids (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            auction_id INTEGER NOT NULL,
            distributor_id INTEGER NOT NULL,
            bidder_tag TEXT NOT NULL,
            bid_amount REAL NOT NULL,
            bid_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE,
            FOREIGN KEY (distributor_id) REFERENCES distributors(id) ON DELETE CASCADE
        )""",
        """CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_code TEXT UNIQUE NOT NULL,
            auction_id INTEGER,
            distributor_id INTEGER NOT NULL,
            fpo_id INTEGER,
            farmer_id INTEGER,
            product_name TEXT NOT NULL,
            quantity REAL NOT NULL,
            unit TEXT DEFAULT 'kg',
            price_per_unit REAL NOT NULL,
            total_amount REAL NOT NULL,
            status TEXT DEFAULT 'confirmed',
            payment_status TEXT DEFAULT 'escrow_held',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (distributor_id) REFERENCES distributors(id) ON DELETE CASCADE
        )""",
        """CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT DEFAULT 'info',
            is_read INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )"""
    ]
    cur = conn.cursor()
    for s in statements:
        cur.execute(s)
    conn.commit()

def get_mysql_connection():
    """
    Creates and returns a database connection.
    Attempts pure PyMySQL connection to MySQL first.
    If MySQL server is unavailable or USE_SQLITE_TEST_DB=True, seamlessly falls back to SQLite.
    """
    global _USE_SQLITE_FALLBACK

    if Config.USE_SQLITE_TEST_DB or _USE_SQLITE_FALLBACK:
        raw_conn = sqlite3.connect(Config.SQLITE_DB_PATH, timeout=30.0, check_same_thread=False)
        _create_sqlite_tables(raw_conn)
        return SQLiteConnWrapper(raw_conn)

    try:
        return pymysql.connect(
            host=Config.MYSQL_HOST,
            port=Config.MYSQL_PORT,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD,
            database=Config.MYSQL_DATABASE,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor,
            autocommit=False,
            connect_timeout=2
        )
    except (pymysql.err.OperationalError, ConnectionRefusedError, OSError):
        # Graceful fallback to SQLite
        _USE_SQLITE_FALLBACK = True
        raw_conn = sqlite3.connect(Config.SQLITE_DB_PATH, timeout=30.0, check_same_thread=False)
        _create_sqlite_tables(raw_conn)
        return SQLiteConnWrapper(raw_conn)

def query_db(query, args=(), one=False, conn=None):
    """
    Executes a SELECT query and returns rows as dictionaries.
    """
    close_conn = False
    if conn is None:
        conn = get_mysql_connection()
        close_conn = True

    try:
        with conn.cursor() as cursor:
            cursor.execute(query, args)
            rv = cursor.fetchall()
            return (rv[0] if rv else None) if one else rv
    finally:
        if close_conn:
            conn.close()

def execute_db(query, args=(), commit=True, conn=None):
    """
    Executes an INSERT, UPDATE, or DELETE statement.
    Returns the last inserted id or affected row count.
    """
    close_conn = False
    if conn is None:
        conn = get_mysql_connection()
        close_conn = True

    try:
        with conn.cursor() as cursor:
            cursor.execute(query, args)
            last_id = cursor.lastrowid
            rowcount = cursor.rowcount
            if commit:
                conn.commit()
            return last_id if last_id else rowcount
    except Exception:
        if commit:
            conn.rollback()
        raise
    finally:
        if close_conn:
            conn.close()

def execute_script(sql_script, conn=None):
    """
    Executes a multi-statement SQL script.
    """
    global _USE_SQLITE_FALLBACK
    if Config.USE_SQLITE_TEST_DB or _USE_SQLITE_FALLBACK:
        c = get_mysql_connection()
        c.close()
        return

    close_conn = False
    if conn is None:
        try:
            conn = pymysql.connect(
                host=Config.MYSQL_HOST,
                port=Config.MYSQL_PORT,
                user=Config.MYSQL_USER,
                password=Config.MYSQL_PASSWORD,
                charset='utf8mb4',
                cursorclass=pymysql.cursors.DictCursor,
                autocommit=True,
                connect_timeout=2
            )
            close_conn = True
        except Exception:
            _USE_SQLITE_FALLBACK = True
            c = get_mysql_connection()
            c.close()
            return

    try:
        statements = sql_script.split(';')
        with conn.cursor() as cursor:
            for statement in statements:
                stmt = statement.strip()
                if stmt:
                    cursor.execute(stmt)
    finally:
        if close_conn:
            conn.close()
