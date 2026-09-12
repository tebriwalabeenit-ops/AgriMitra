from flask import Blueprint, request, jsonify, session
from utils.auth import hash_password, verify_password, login_user, logout_user, get_current_user, login_required
from database.db import query_db, execute_db, get_db_connection

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

DASHBOARD_MAP = {
    'farmer': 'AgriMitra-Farmer/farmer/dashboard.html',
    'fpo': 'fpo-dashboard.html',
    'buyer': 'buyer-dashboard.html',
    'wholesaler': 'wholesaler-dashboard.html',
    'distributor': 'Agrimitra(wholesaler and distributer)/distributor-dashboard.html',
    'delivery_agent': 'delivery-dashboard.html'
}

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or request.form

    phone = (data.get('phone') or '').strip()
    password = (data.get('password') or '').strip()
    full_name = (data.get('full_name') or '').strip()
    role = (data.get('role') or 'farmer').strip().lower()

    email = (data.get('email') or '').strip() or None
    state = (data.get('state') or '').strip() or None
    district = (data.get('district') or '').strip() or None

    preferred_language = (data.get('preferred_language') or 'en').strip().lower()
    if preferred_language not in ['en', 'hi', 'ta', 'ml', 'kn', 'mr', 'bn']:
        preferred_language = 'en'

    if not phone or len(phone) < 10:
        return jsonify({"success": False, "message": "A valid 10-digit phone number is required."}), 400

    phone_clean = ''.join(filter(str.isdigit, phone))
    if len(phone_clean) >= 10:
        phone_clean = phone_clean[-10:]
    else:
        return jsonify({"success": False, "message": "Phone number must have at least 10 digits."}), 400

    if not password or len(password) < 6:
        return jsonify({"success": False, "message": "Password must be at least 6 characters."}), 400

    if not full_name:
        return jsonify({"success": False, "message": "Full name / business name is required."}), 400

    if role == 'delivery':
        role = 'delivery_agent'

    valid_roles = ['farmer', 'fpo', 'buyer', 'wholesaler', 'distributor', 'delivery_agent']
    if role not in valid_roles:
        return jsonify({"success": False, "message": f"Invalid role: {role}"}), 400

    existing = query_db("SELECT id FROM users WHERE phone = %s", (phone_clean,), one=True)
    if existing:
        return jsonify({"success": False, "message": "An account with this phone number already exists. Please log in."}), 409

    pwd_hash = hash_password(password)

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:

            cursor.execute("""
                INSERT INTO users (phone, password_hash, role, full_name, email, state, district, preferred_language)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (phone_clean, pwd_hash, role, full_name, email, state, district, preferred_language))
            user_id = cursor.lastrowid

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

            elif role == 'buyer':
                buyer_code = f"BYR-{user_id + 100}"
                address = data.get('address') or f"{district or ''}, {state or ''}".strip(', ')
                pincode = data.get('pincode', '122001')
                cursor.execute("""
                    INSERT INTO buyers (user_id, buyer_code, delivery_address, pincode)
                    VALUES (%s, %s, %s, %s)
                """, (user_id, buyer_code, address, pincode))

            elif role == 'wholesaler':
                wholesaler_code = f"WS-{user_id + 200}"
                license_no = data.get('license_no', 'MANDI-GEN-01')
                cursor.execute("""
                    INSERT INTO wholesalers (user_id, wholesaler_code, business_name, license_no, city)
                    VALUES (%s, %s, %s, %s, %s)
                """, (user_id, wholesaler_code, full_name, license_no, district or state or 'Delhi'))

            elif role == 'distributor':
                dist_code = f"DST-{user_id + 300}"
                business_type = data.get('business_type', 'Regional Wholesaler')
                storage_cap = data.get('storage_capacity', '100 Tonnes')
                cursor.execute("""
                    INSERT INTO distributors (user_id, distributor_code, business_name, business_type, city, storage_capacity)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (user_id, dist_code, full_name, business_type, district or state or 'Pune', storage_cap))

            elif role == 'delivery_agent':
                agent_code = f"AM-DA-{user_id + 1000}"
                vehicle_type = data.get('vehicle_type', 'Tata Ace (1.5 Ton)')
                vehicle_number = data.get('vehicle_number', 'Registered Vehicle')
                cursor.execute("""
                    INSERT INTO delivery_agents (user_id, agent_code, vehicle_type, vehicle_number)
                    VALUES (%s, %s, %s, %s)
                """, (user_id, agent_code, vehicle_type, vehicle_number))

            conn.commit()

        user_record = {
            "id": user_id,
            "phone": phone_clean,
            "role": role,
            "full_name": full_name,
            "preferred_language": preferred_language
        }
        login_user(user_record)

        return jsonify({
            "success": True,
            "message": "Account created successfully.",
            "redirect_url": DASHBOARD_MAP.get(role, 'index.html'),
            "user": {
                "id": user_id,
                "phone": phone_clean,
                "role": role,
                "full_name": full_name,
                "preferred_language": preferred_language
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

    if role_requested:
        if role_requested == 'delivery':
            role_requested = 'delivery_agent'

        compatible = (
            user['role'] == role_requested or
            (role_requested in ('wholesaler', 'distributor') and user['role'] in ('wholesaler', 'distributor')) or
            (role_requested == 'buyer' and user['role'] in ('buyer', 'distributor'))
        )
        if not compatible:
            return jsonify({
                "success": False,
                "message": f"This account is registered as a {user['role'].title()}, not as a {role_requested.title()}."
            }), 403

    incoming_lang = (data.get('preferred_language') or '').strip().lower()
    if incoming_lang in ['en', 'hi', 'ta', 'ml', 'kn', 'mr', 'bn']:
        try:
            execute_db("UPDATE users SET preferred_language = %s WHERE id = %s", (incoming_lang, user['id']))
            user['preferred_language'] = incoming_lang
        except Exception:
            pass

    login_user(user)

    profile_info = {}
    if user['role'] == 'farmer':
        f = query_db("SELECT id, kisan_id, farm_location FROM farmers WHERE user_id = %s", (user['id'],), one=True)
        if f: profile_info = f
    elif user['role'] == 'fpo':
        f = query_db("SELECT id, fpo_code, fpo_name FROM fpos WHERE user_id = %s", (user['id'],), one=True)
        if f: profile_info = f
    elif user['role'] == 'buyer':
        b = query_db("SELECT id, buyer_code, delivery_address, pincode FROM buyers WHERE user_id = %s", (user['id'],), one=True)
        if b: profile_info = b
    elif user['role'] == 'wholesaler':
        w = query_db("SELECT id, wholesaler_code, business_name, license_no FROM wholesalers WHERE user_id = %s", (user['id'],), one=True)
        if w: profile_info = w
    elif user['role'] == 'distributor':
        d = query_db("SELECT id, distributor_code, business_name, business_type FROM distributors WHERE user_id = %s", (user['id'],), one=True)
        if d: profile_info = d
    elif user['role'] == 'delivery_agent':
        da = query_db("SELECT id, agent_code, vehicle_type, vehicle_number FROM delivery_agents WHERE user_id = %s", (user['id'],), one=True)
        if da: profile_info = da

    redirect_target = DASHBOARD_MAP.get(user['role'], 'index.html')
    if role_requested and role_requested in DASHBOARD_MAP:
        redirect_target = DASHBOARD_MAP[role_requested]

    return jsonify({
        "success": True,
        "message": "Login successful.",
        "redirect_url": redirect_target,
        "user": {
            "id": user['id'],
            "phone": user['phone'],
            "role": user['role'],
            "full_name": user['full_name'],
            "state": user.get('state'),
            "district": user.get('district'),
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
    return jsonify({"success": True, "message": "Logged out successfully.", "redirect_url": "index.html"})

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
    elif user['role'] == 'buyer':
        profile_info = query_db("SELECT id, buyer_code, delivery_address, pincode FROM buyers WHERE user_id = %s", (user['id'],), one=True)
    elif user['role'] == 'wholesaler':
        profile_info = query_db("SELECT id, wholesaler_code, business_name FROM wholesalers WHERE user_id = %s", (user['id'],), one=True)
    elif user['role'] == 'distributor':
        profile_info = query_db("SELECT id, distributor_code, business_name FROM distributors WHERE user_id = %s", (user['id'],), one=True)
    elif user['role'] == 'delivery_agent':
        profile_info = query_db("SELECT id, agent_code, vehicle_type, vehicle_number FROM delivery_agents WHERE user_id = %s", (user['id'],), one=True)

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
            "preferred_language": user.get('preferred_language') or 'en',
            "profile": profile_info or {}
        }
    })
