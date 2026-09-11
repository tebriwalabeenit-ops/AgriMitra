import os
from dotenv import load_dotenv

# Load environment variables from .env if present
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'krishilink-sih-2026-secret-key-development')
    
    # MySQL Database Configuration
    MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
    MYSQL_PORT = int(os.environ.get('MYSQL_PORT', 3306))
    MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', '')
    MYSQL_DATABASE = os.environ.get('MYSQL_DATABASE', 'krishilink_db')
    
    # Optional test DB override (for CI or running without live MySQL)
    USE_SQLITE_TEST_DB = os.environ.get('USE_SQLITE_TEST_DB', 'False').lower() in ('true', '1', 'yes')
    SQLITE_DB_PATH = os.environ.get('SQLITE_DB_PATH', 'krishilink_test.db')
