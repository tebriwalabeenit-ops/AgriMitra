"""
Farmer API Routes for KrishiLink
Produce Management, Mandi Rates, and Farmer Delivery Requirements
"""

from flask import Blueprint, request, jsonify, session
from utils.auth import login_required, role_required
from database.db import query_db, execute_db

farmer_bp = Blueprint('farmer', __name__, url_prefix='/api/farmer')

def _get_farmer_id():
    """Helper to get farmer profile id for logged-in user or fallback to demo farmer."""
    user_id = session.get('user_id')
    if user_id:
        f = query_db("SELECT id FROM farmers WHERE user_id = %s", (user_id,), one=True)
        if f:
            return f['id']
    # Fallback to default demo farmer (id 1) for seamless browsing
    first = query_db("SELECT id FROM farmers LIMIT 1", one=True)
    return first['id'] if first else 1

@farmer_bp.route('/dashboard', methods=['GET'])
def dashboard():
    farmer_id = _get_farmer_id()

    # Active produce count & total quantity
    crops = query_db("""
        SELECT id, crop_name, variety, quantity, unit, expected_price, location, status, created_at
        FROM produce 
        WHERE farmer_id = %s 
        ORDER BY id DESC
    """, (farmer_id,))

    active_crops = [c for c in crops if c['status'] == 'active']
    sold_crops = [c for c in crops if c['status'] == 'sold']

    # Delivery requirements created by farmer
    reqs = query_db("""
        SELECT fr.id, fr.req_code, fr.crop_name, fr.quantity, fr.unit, 
               fr.pickup_location, fr.destination_location, fr.pickup_window,
               fr.status, fr.compensation, fr.trip_distance_km, fr.created_at,
               u.full_name AS delivery_agent_name, da.vehicle_type
        FROM farmer_requirements fr
        LEFT JOIN delivery_agents da ON fr.delivery_agent_id = da.id
        LEFT JOIN users u ON da.user_id = u.id
        WHERE fr.farmer_id = %s
        ORDER BY fr.id DESC
    """, (farmer_id,))

    # Today's APMC Mandi Bhav (Benchmark rates)
    mandi_rates = [
        {"crop": "Paddy (Common)", "mandi": "Krishnagiri APMC", "rate": 2350, "unit": "Qtl", "trend": "+₹40 today", "up": True},
        {"crop": "Tomato (Hybrid)", "mandi": "Rayakottai Mandi", "rate": 26, "unit": "kg", "trend": "+₹2 today", "up": True},
        {"crop": "Onion (Nashik Red)", "mandi": "Dharmapuri APMC", "rate": 34, "unit": "kg", "trend": "-₹1 today", "up": False},
        {"crop": "Wheat (Sharbati)", "mandi": "Regional Mandi", "rate": 2980, "unit": "Qtl", "trend": "+₹15 today", "up": True},
        {"crop": "Cotton (Medium Staple)", "mandi": "Salem Cotton Market", "rate": 7200, "unit": "Qtl", "trend": "+₹60 today", "up": True}
    ]

    return jsonify({
        "success": True,
        "metrics": {
            "active_listings_count": len(active_crops),
            "sold_listings_count": len(sold_crops),
            "pending_requirements_count": sum(1 for r in reqs if r['status'] == 'pending'),
            "in_transit_requirements_count": sum(1 for r in reqs if r['status'] in ('accepted', 'in_transit')),
            "delivered_requirements_count": sum(1 for r in reqs if r['status'] == 'delivered'),
            "settled_payouts_total": 482500.00
        },
        "produce": crops,
        "requirements": reqs,
        "mandi_rates": mandi_rates
    })

@farmer_bp.route('/produce', methods=['GET'])
def get_produce():
    farmer_id = _get_farmer_id()
    crops = query_db("""
        SELECT id, crop_name, variety, quantity, unit, expected_price, location, status, created_at
        FROM produce 
        WHERE farmer_id = %s 
        ORDER BY id DESC
    """, (farmer_id,))
    for c in crops:
        c['quantity'] = float(c['quantity'])
        c['expected_price'] = float(c['expected_price'])
    return jsonify({"success": True, "produce": crops})

@farmer_bp.route('/produce', methods=['POST'])
def add_produce():
    farmer_id = _get_farmer_id()
    data = request.get_json(silent=True) or request.form

    crop_name = (data.get('crop_name') or data.get('crop-select') or '').strip()
    variety = (data.get('variety') or data.get('crop-variety') or 'Standard').strip()
    quantity = data.get('quantity') or data.get('crop-qty')
    unit = (data.get('unit') or data.get('crop-unit') or 'kg').strip()
    expected_price = data.get('expected_price') or data.get('crop-price')
    location = (data.get('location') or data.get('crop-location') or 'Local APMC Warehouse').strip()

    if not crop_name:
        return jsonify({"success": False, "message": "Crop name is required."}), 400

    try:
        qty_val = float(quantity)
        price_val = float(expected_price)
        if qty_val <= 0 or price_val <= 0:
            return jsonify({"success": False, "message": "Quantity and price must be greater than zero."}), 400
    except (ValueError, TypeError):
        return jsonify({"success": False, "message": "Quantity and price must be valid positive numbers."}), 400

    produce_id = execute_db("""
        INSERT INTO produce (farmer_id, crop_name, variety, quantity, unit, expected_price, location, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, 'active')
    """, (farmer_id, crop_name, variety, qty_val, unit, price_val, location))

    return jsonify({
        "success": True,
        "message": f"{crop_name} listed successfully!",
        "produce": {
            "id": produce_id,
            "crop_name": crop_name,
            "variety": variety,
            "quantity": qty_val,
            "unit": unit,
            "expected_price": price_val,
            "location": location,
            "status": "active"
        }
    }), 201

@farmer_bp.route('/produce/<int:produce_id>/sold', methods=['POST'])
def mark_sold(produce_id):
    farmer_id = _get_farmer_id()
    produce = query_db("SELECT id, farmer_id, crop_name FROM produce WHERE id = %s", (produce_id,), one=True)
    if not produce:
        return jsonify({"success": False, "message": "Produce listing not found."}), 404

    execute_db("UPDATE produce SET status = 'sold' WHERE id = %s", (produce_id,))
    return jsonify({"success": True, "message": f"{produce['crop_name']} marked as sold!"})

@farmer_bp.route('/requirements', methods=['GET'])
def get_requirements():
    farmer_id = _get_farmer_id()
    reqs = query_db("""
        SELECT fr.id, fr.req_code, fr.crop_name, fr.quantity, fr.unit, 
               fr.pickup_location, fr.destination_location, fr.pickup_window,
               fr.notes, fr.status, fr.compensation, fr.trip_distance_km, fr.created_at,
               fr.accepted_at, fr.delivered_at,
               u.full_name AS delivery_agent_name, da.vehicle_type
        FROM farmer_requirements fr
        LEFT JOIN delivery_agents da ON fr.delivery_agent_id = da.id
        LEFT JOIN users u ON da.user_id = u.id
        WHERE fr.farmer_id = %s
        ORDER BY fr.id DESC
    """, (farmer_id,))

    for r in reqs:
        r['quantity'] = float(r['quantity'])
        r['compensation'] = float(r['compensation'])
        r['trip_distance_km'] = float(r['trip_distance_km'])

    return jsonify({"success": True, "requirements": reqs})

@farmer_bp.route('/requirements', methods=['POST'])
def create_requirement():
    farmer_id = _get_farmer_id()
    data = request.get_json(silent=True) or request.form

    crop_name = (data.get('crop_name') or '').strip()
    quantity = data.get('quantity')
    unit = (data.get('unit') or 'kg').strip()
    pickup_location = (data.get('pickup_location') or '').strip()
    destination_location = (data.get('destination_location') or '').strip()
    pickup_window = (data.get('pickup_window') or 'Morning Slot (09:00 - 12:00)').strip()
    notes = (data.get('notes') or '').strip()

    if not crop_name or not pickup_location or not destination_location:
        return jsonify({"success": False, "message": "Crop, pickup location, and destination are required."}), 400

    try:
        qty_val = float(quantity)
        if qty_val <= 0:
            return jsonify({"success": False, "message": "Quantity must be greater than zero."}), 400
    except (ValueError, TypeError):
        return jsonify({"success": False, "message": "Invalid quantity."}), 400

    # Auto estimate distance and compensation
    distance_km = round(15.0 + (qty_val % 20), 1)
    compensation = round(300.0 + (distance_km * 12.5) + (qty_val * 0.25), 2)

    # Generate unique code
    import random
    req_code = f"FM-{random.randint(24100, 24999)}"

    req_id = execute_db("""
        INSERT INTO farmer_requirements 
        (req_code, farmer_id, crop_name, quantity, unit, pickup_location, destination_location, pickup_window, notes, compensation, trip_distance_km, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'pending')
    """, (req_code, farmer_id, crop_name, qty_val, unit, pickup_location, destination_location, pickup_window, notes, compensation, distance_km))

    return jsonify({
        "success": True,
        "message": f"Delivery requirement #{req_code} posted successfully! It is now visible to all delivery agents.",
        "requirement": {
            "id": req_id,
            "req_code": req_code,
            "crop_name": crop_name,
            "quantity": qty_val,
            "unit": unit,
            "pickup_location": pickup_location,
            "destination_location": destination_location,
            "compensation": compensation,
            "status": "pending"
        }
    }), 201
