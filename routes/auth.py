"""
Authentication API Routes for KrishiLink
Supports Registration, Login, Logout, Session verification for all 4 roles.
"""

from flask import Blueprint, request, jsonify, session
from utils.auth import hash_password, verify_password, login_user, logout_user, get_current_user, login_required
from database.db import query_db, execute_db, get_mysql_connection

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or request.form
    
    phone = (data.get('phone') or '').strip()
    password = (data.get('password') or '').strip()
    full_name = (data.get('full_name') or '').strip()
    role = (data.get('role') or 'farmer').strip().lower()
    
    # Optional fields
    email = (data.get('email') or '').strip() or None
    state = (data.get('state') or '').strip() or None
    district = (data.get('district') or '').strip() or None
    
    preferred_language = (data.get('preferred_language') or 'en').strip().lower()
    if preferred_language not in ['en', 'hi', 'ta', 'ml', 'kn', 'mr', 'bn']:
        preferred_language = 'en'

    # Validations
    if not phone or len(phone) < 10:
        return jsonify({"success": False, "message": "A valid 10-digit phone number is required."}), 400
    
    # Normalize phone digits (last 10 digits)
    phone_clean = ''.join(filter(str.isdigit, phone))
    if len(phone_clean) >= 10:
        phone_clean = phone_clean[-10:]
    else:
        return jsonify({"success": False, "message": "Phone number must have at least 10 digits."}), 400

    if not password or len(password) < 6:
        return jsonify({"success": False, "message": "Password must be at least 6 characters."}), 400

    if not full_name:
        return jsonify({"success": False, "message": "Full name / business name is required."}), 400

    valid_roles = ['farmer', 'fpo', 'distributor', 'delivery_agent', 'buyer', 'delivery']
    if role == 'buyer':
        role = 'distributor'
    elif role == 'delivery':
        role = 'delivery_agent'

    if role not in ['farmer', 'fpo', 'distributor', 'delivery_agent']:
        return jsonify({"success": False, "message": f"Invalid role: {role}"}), 400

    # Check if phone already registered
    existing = query_db("SELECT id FROM users WHERE phone = %s", (phone_clean,), one=True)
    if existing:
        return jsonify({"success": False, "message": "An account with this phone number already exists. Please log in."}), 409

    pwd_hash = hash_password(password)
    
    conn = get_mysql_connection()
    try:
        with conn.cursor() as cursor:
            # 1. Insert user with preferred_language
            cursor.execute("""
                INSERT INTO users (phone, password_hash, role, full_name, email, state, district, preferred_language)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (phone_clean, pwd_hash, role, full_name, email, state, district, preferred_language))
            user_id = cursor.lastrowid

            # 2. Create role-specific profile
            if role == 'farmer':
                kisan_id = f"FM-{user_id + 98000}"
                cursor.execute("""
                    INSERT INTO farmers (user_id, kisan_id, farm_location)
                    VALUES (%s, %s, %s)
                """, (user_id, kisan_id, f"{district or ''}, {state or ''}".strip(', ')))

            elif role == 'fpo':
                fpo_code = f"FPO-{user_id + 400}"
                cursor.execute("""
                    INSERT INTO fpos (user_id, fpo_code, fpo_name, warehouse_location)
                    VALUES (%s, %s, %s, %s)
                """, (user_id, fpo_code, full_name, f"{district or ''}, {state or ''}".strip(', ')))

            elif role == 'distributor':
                dist_code = f"WS-{user_id + 200}"
                business_type = data.get('business_type', 'Wholesaler')
                storage_cap = data.get('storage_capacity', 'Standard')
                cursor.execute("""
                    INSERT INTO distributors (user_id, distributor_code, business_name, business_type, city, storage_capacity)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (user_id, dist_code, full_name, business_type, district or city if 'city' in locals() else district, storage_cap))

            elif role == 'delivery_agent':
                agent_code = f"AM-DA-{user_id + 1000}"
                vehicle_type = data.get('vehicle_type', 'Small goods vehicle')
                vehicle_number = data.get('vehicle_number', 'Registered')
                cursor.execute("""
                    INSERT INTO delivery_agents (user_id, agent_code, vehicle_type, vehicle_number)
                    VALUES (%s, %s, %s, %s)
                """, (user_id, agent_code, vehicle_type, vehicle_number))

            conn.commit()

        # Log in the new user
        user_record = {
            "id": user_id,
            "phone": phone_clean,
            "role": role,
            "full_name": full_name
        }
        login_user(user_record)

        return jsonify({
            "success": True,
            "message": "Account created successfully.",
            "user": {
                "id": user_id,
                "phone": phone_clean,
                "role": role,
                "full_name": full_name
            }
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": f"Registration failed: {str(e)}"}), 500
    finally:
        conn.close()

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or request.form
    
    phone = (data.get('phone') or '').strip()
    password = (data.get('password') or '').strip()
    role_requested = (data.get('role') or '').strip().lower()

    if not phone or not password:
        return jsonify({"success": False, "message": "Phone number and password are required."}), 400

    phone_clean = ''.join(filter(str.isdigit, phone))
    if len(phone_clean) >= 10:
        phone_clean = phone_clean[-10:]

    user = query_db("""
        SELECT id, phone, password_hash, role, full_name, email, state, district, preferred_language
        FROM users WHERE phone = %s
    """, (phone_clean,), one=True)

    if not user:
        return jsonify({"success": False, "message": "Account not found with this phone number."}), 401

    if not verify_password(password, user['password_hash']):
        return jsonify({"success": False, "message": "Incorrect password. Please check your credentials."}), 401

    # If role_requested is provided and not equal, normalize and check
    if role_requested:
        if role_requested == 'buyer':
            role_requested = 'distributor'
        elif role_requested == 'delivery':
            role_requested = 'delivery_agent'
        
        if user['role'] != role_requested:
            return jsonify({
                "success": False, 
                "message": f"This account is registered as a {user['role'].title()}, not as a {role_requested.title()}."
            }), 403

    # Sync preferred_language if provided in login request
    incoming_lang = (data.get('preferred_language') or '').strip().lower()
    if incoming_lang in ['en', 'hi', 'ta', 'ml', 'kn', 'mr', 'bn']:
        try:
            execute_db("UPDATE users SET preferred_language = %s WHERE id = %s", (incoming_lang, user['id']))
            user['preferred_language'] = incoming_lang
        except Exception:
            pass

    login_user(user)

    # Return profile specifics
    profile_info = {}
    if user['role'] == 'farmer':
        f = query_db("SELECT id, kisan_id, farm_location FROM farmers WHERE user_id = %s", (user['id'],), one=True)
        if f: profile_info = f
    elif user['role'] == 'fpo':
        f = query_db("SELECT id, fpo_code, fpo_name FROM fpos WHERE user_id = %s", (user['id'],), one=True)
        if f: profile_info = f
    elif user['role'] == 'distributor':
        d = query_db("SELECT id, distributor_code, business_name FROM distributors WHERE user_id = %s", (user['id'],), one=True)
        if d: profile_info = d
    elif user['role'] == 'delivery_agent':
        da = query_db("SELECT id, agent_code, vehicle_type FROM delivery_agents WHERE user_id = %s", (user['id'],), one=True)
        if da: profile_info = da

    return jsonify({
        "success": True,
        "message": "Login successful.",
        "user": {
            "id": user['id'],
            "phone": user['phone'],
            "role": user['role'],
            "full_name": user['full_name'],
            "preferred_language": user.get('preferred_language') or 'en',
            "profile": profile_info
        }
    })

@auth_bp.route('/language', methods=['POST'])
def update_language():
    """Update user preferred language setting"""
    data = request.get_json(silent=True) or request.form
    pref_lang = (data.get('preferred_language') or 'en').strip().lower()
    if pref_lang not in ['en', 'hi', 'ta', 'ml', 'kn', 'mr', 'bn']:
        return jsonify({"success": False, "message": "Unsupported language"}), 400
    
    user = get_current_user()
    if user and user.get('id'):
        try:
            execute_db("UPDATE users SET preferred_language = %s WHERE id = %s", (pref_lang, user['id']))
            user['preferred_language'] = pref_lang
        except Exception:
            pass
    return jsonify({"success": True, "preferred_language": pref_lang})

@auth_bp.route('/logout', methods=['POST', 'GET'])
def logout():
    logout_user()
    return jsonify({"success": True, "message": "Logged out successfully."})

@auth_bp.route('/me', methods=['GET'])
def me():
    user = get_current_user()
    if not user:
        return jsonify({"success": False, "authenticated": False, "user": None})

    profile_info = {}
    if user['role'] == 'farmer':
        profile_info = query_db("SELECT id, kisan_id, farm_location FROM farmers WHERE user_id = %s", (user['id'],), one=True)
    elif user['role'] == 'fpo':
        profile_info = query_db("SELECT id, fpo_code, fpo_name FROM fpos WHERE user_id = %s", (user['id'],), one=True)
    elif user['role'] == 'distributor':
        profile_info = query_db("SELECT id, distributor_code, business_name FROM distributors WHERE user_id = %s", (user['id'],), one=True)
    elif user['role'] == 'delivery_agent':
        profile_info = query_db("SELECT id, agent_code, vehicle_type FROM delivery_agents WHERE user_id = %s", (user['id'],), one=True)

    return jsonify({
        "success": True,
        "authenticated": True,
        "user": {
            "id": user['id'],
            "phone": user['phone'],
            "role": user['role'],
            "full_name": user['full_name'],
            "state": user.get('state'),
            "district": user.get('district'),
            "profile": profile_info or {}
        }
    })
