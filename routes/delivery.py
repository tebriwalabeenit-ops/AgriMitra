"""
Delivery Agent API Routes for KrishiLink
Powers the Delivery Agent Logistics Portal (Dispatch Desk, Route, Deliveries)
"""

from flask import Blueprint, request, jsonify, session
from utils.auth import login_required, role_required
from database.db import query_db
from services.delivery_service import accept_requirement, update_delivery_status, get_delivery_route, update_agent_location

delivery_bp = Blueprint('delivery', __name__, url_prefix='/api/delivery')

def _get_agent_id():
    user_id = session.get('user_id')
    if user_id:
        da = query_db("SELECT id FROM delivery_agents WHERE user_id = %s", (user_id,), one=True)
        if da: return da['id']
    first = query_db("SELECT id FROM delivery_agents LIMIT 1", one=True)
    return first['id'] if first else 1

@delivery_bp.route('/dashboard', methods=['GET'])
def dashboard():
    agent_id = _get_agent_id()

    # Open requirements
    open_reqs = query_db("SELECT COUNT(*) AS cnt FROM farmer_requirements WHERE status = 'pending'", one=True)
    
    # Agent's deliveries
    my_deliveries = query_db("""
        SELECT COUNT(*) AS total,
               SUM(CASE WHEN status IN ('accepted', 'in_transit') THEN 1 ELSE 0 END) AS active_cnt,
               SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered_cnt,
               SUM(CASE WHEN status = 'delivered' THEN compensation ELSE 0 END) AS earned_amt,
               SUM(CASE WHEN status IN ('accepted', 'in_transit') THEN compensation ELSE 0 END) AS pending_earnings,
               SUM(trip_distance_km) AS total_km
        FROM farmer_requirements
        WHERE delivery_agent_id = %s
    """, (agent_id,), one=True)

    agent = query_db("""
        SELECT da.agent_code, da.vehicle_type, da.vehicle_number, u.full_name, u.phone
        FROM delivery_agents da
        JOIN users u ON da.user_id = u.id
        WHERE da.id = %s
    """, (agent_id,), one=True) or {
        "full_name": "Ramesh Kumar",
        "agent_code": "AM-DA-1047",
        "vehicle_type": "Tata Ace"
    }

    return jsonify({
        "success": True,
        "agent": agent,
        "metrics": {
            "available_requests": open_reqs['cnt'] if open_reqs else 0,
            "my_deliveries": my_deliveries['active_cnt'] or 0 if my_deliveries else 0,
            "completed": my_deliveries['delivered_cnt'] or 0 if my_deliveries else 0,
            "total_distance_km": float(my_deliveries['total_km'] or 47.0) if my_deliveries else 47.0,
            "estimated_earnings": float(my_deliveries['pending_earnings'] or 1850.0) if my_deliveries else 1850.0,
            "settled_earnings": float(my_deliveries['earned_amt'] or 0.0) if my_deliveries else 0.0
        }
    })

@delivery_bp.route('/requirements', methods=['GET'])
def list_requirements():
    """
    Returns available farmer requirements awaiting delivery agent pickup.
    """
    reqs = query_db("""
        SELECT fr.id, fr.req_code, fr.crop_name, fr.quantity, fr.unit,
               fr.pickup_location, fr.destination_location, fr.pickup_window,
               fr.notes, fr.compensation, fr.trip_distance_km, fr.status, fr.created_at,
               u.full_name AS farmer_name, u.district AS farmer_cluster
        FROM farmer_requirements fr
        JOIN farmers f ON fr.farmer_id = f.id
        JOIN users u ON f.user_id = u.id
        WHERE fr.status = 'pending'
        ORDER BY fr.id ASC
    """)
    for r in reqs:
        r['quantity'] = float(r['quantity'])
        r['compensation'] = float(r['compensation'])
        r['trip_distance_km'] = float(r['trip_distance_km'])

    return jsonify({"success": True, "requirements": reqs})

@delivery_bp.route('/requirements/<int:req_id>/accept', methods=['POST'])
def claim_requirement(req_id):
    agent_id = _get_agent_id()
    success, result = accept_requirement(req_id, agent_id)
    if success:
        return jsonify({"success": True, "data": result}), 200
    else:
        return jsonify({"success": False, "message": result}), 409

@delivery_bp.route('/requirements/<int:req_id>/status', methods=['PUT', 'POST'])
def change_status(req_id):
    agent_id = _get_agent_id()
    data = request.get_json(silent=True) or request.form
    new_status = data.get('status')
    if not new_status:
        return jsonify({"success": False, "message": "Status is required."}), 400

    success, result = update_delivery_status(req_id, agent_id, new_status)
    if success:
        return jsonify({"success": True, "data": result}), 200
    else:
        return jsonify({"success": False, "message": result}), 400

@delivery_bp.route('/my-deliveries', methods=['GET'])
def my_deliveries():
    agent_id = _get_agent_id()
    deliveries = query_db("""
        SELECT fr.id, fr.req_code, fr.crop_name, fr.quantity, fr.unit,
               fr.pickup_location, fr.destination_location, fr.pickup_window,
               fr.notes, fr.compensation, fr.trip_distance_km, fr.status,
               fr.created_at, fr.accepted_at, fr.delivered_at,
               u.full_name AS farmer_name, u.phone AS farmer_phone
        FROM farmer_requirements fr
        JOIN farmers f ON fr.farmer_id = f.id
        JOIN users u ON f.user_id = u.id
        WHERE fr.delivery_agent_id = %s
        ORDER BY fr.status = 'accepted' DESC, fr.status = 'in_transit' DESC, fr.id DESC
    """, (agent_id,))
    for d in deliveries:
        d['quantity'] = float(d['quantity'])
        d['compensation'] = float(d['compensation'])
        d['trip_distance_km'] = float(d['trip_distance_km'])

    return jsonify({"success": True, "deliveries": deliveries})

@delivery_bp.route('/route', methods=['GET'])
def get_route():
    """
    Returns full corridor navigation telemetry, waypoint stops, and path coordinates
    for the delivery agent's active logistics route.
    """
    agent_id = _get_agent_id()
    route_data = get_delivery_route(agent_id)
    return jsonify(route_data)

@delivery_bp.route('/location', methods=['POST'])
def post_location():
    """
    Receives real-time GPS coordinates and telemetry from the delivery agent device.
    """
    agent_id = _get_agent_id()
    data = request.get_json(silent=True) or request.form
    lat = data.get('lat')
    lng = data.get('lng')
    speed = data.get('speed', 42.0)
    heading = data.get('heading', 'South-West')

    if lat is None or lng is None:
        return jsonify({"success": False, "message": "lat and lng are required."}), 400

    success, result = update_agent_location(agent_id, lat, lng, speed, heading)
    if success:
        return jsonify({"success": True, "data": result}), 200
    return jsonify({"success": False, "message": result}), 400
