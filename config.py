import os
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'agrimitra-sih-2026-secret-key-production')

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    SQLITE_DB_PATH = os.environ.get('SQLITE_DB_PATH', os.path.join(BASE_DIR, 'database', 'agrimitra.db'))

    USE_SQLITE = True
    USE_SQLITE_TEST_DB = True

    MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
    MYSQL_PORT = int(os.environ.get('MYSQL_PORT', 3306))
    MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', '')
    MYSQL_DATABASE = os.environ.get('MYSQL_DATABASE', 'agrimitra_db')
