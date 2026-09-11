import os
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'agrimitra-sih-2026-secret-key-production')
    
    # Base directory
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    
    # Primary Database: Permanent SQLite Database File
    # Stores all data permanently on disk in database/agrimitra.db
    SQLITE_DB_PATH = os.environ.get('SQLITE_DB_PATH', os.path.join(BASE_DIR, 'database', 'agrimitra.db'))
    
    # Force SQLite primary engine
    USE_SQLITE = True
    USE_SQLITE_TEST_DB = True
    
    # Optional MySQL Config (fallback/remote integration if explicitly configured)
    MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
    MYSQL_PORT = int(os.environ.get('MYSQL_PORT', 3306))
    MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', '')
    MYSQL_DATABASE = os.environ.get('MYSQL_DATABASE', 'agrimitra_db')
