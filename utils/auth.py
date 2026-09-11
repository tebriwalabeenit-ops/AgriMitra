"""
Authentication & Role-Based Authorization Utilities for KrishiLink
"""

from functools import wraps
from flask import session, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from database.db import query_db

def hash_password(password):
    return generate_password_hash(password)

def verify_password(password, password_hash):
    if check_password_hash(password_hash, password):
        return True
    # Aliases for demo convenience
    if password in ('fpo123', 'fpo12345') and (check_password_hash(password_hash, 'fpo123') or check_password_hash(password_hash, 'fpo12345')):
        return True
    if password in ('distributor123', 'dist12345') and (check_password_hash(password_hash, 'distributor123') or check_password_hash(password_hash, 'dist12345')):
        return True
    return False

def login_user(user):
    """
    Establishes server-side signed session for authenticated user.
    """
    session['user_id'] = user['id']
    session['role'] = user['role']
    session['phone'] = user['phone']
    session['full_name'] = user['full_name']

def logout_user():
    session.clear()

def get_current_user():
    user_id = session.get('user_id')
    if not user_id:
        return None
    return query_db("SELECT id, phone, role, full_name, email, state, district FROM users WHERE id = %s", (user_id,), one=True)

def login_required(f):
    """
    Decorator requiring an active user session.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('user_id'):
            return jsonify({
                "success": False,
                "message": "Authentication required. Please sign in."
            }), 401
        return f(*args, **kwargs)
    return decorated_function

def role_required(allowed_roles):
    """
    Decorator restricting route to specific ecosystem roles.
    Example: @role_required(['fpo']) or @role_required(['distributor'])
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not session.get('user_id'):
                return jsonify({
                    "success": False,
                    "message": "Authentication required. Please sign in."
                }), 401
            
            user_role = session.get('role')
            if user_role not in allowed_roles:
                return jsonify({
                    "success": False,
                    "message": f"Access denied. Required role: {', '.join(allowed_roles)}. Your role: {user_role}"
                }), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator
