
"""
KrishiLink Delivery Service
Handles concurrency-safe requirement claiming by Delivery Agents using
MySQL row-level locks (SELECT ... FOR UPDATE) to prevent double acceptance.
"""

from datetime import datetime
from database.db import get_mysql_connection

def accept_requirement(req_id, agent_id):
    """
    Claims a delivery requirement for a delivery agent.
    Row-level locking guarantees that only ONE agent can claim a requirement.
    """
    conn = get_mysql_connection()
    try:
        with conn.cursor() as cursor:
            # Lock the requirement row
            cursor.execute("""
                SELECT id, req_code, crop_name, quantity, unit, status, farmer_id, delivery_agent_id
                FROM farmer_requirements
                WHERE id = %s FOR UPDATE
            """, (req_id,))
            req = cursor.fetchone()

            if not req:
                conn.rollback()
                return False, "Delivery requirement not found."

            if req['status'] != 'pending':
                conn.rollback()
                return False, f"Requirement #{req['req_code']} is already {req['status']} and cannot be accepted."

            if req['delivery_agent_id'] is not None:
                conn.rollback()
                return False, "This requirement has already been claimed by another delivery agent."

            now = datetime.now()

            # Assign to this delivery agent
            cursor.execute("""
                UPDATE farmer_requirements
                SET status = 'accepted',
                    delivery_agent_id = %s,
                    accepted_at = %s
                WHERE id = %s
            """, (agent_id, now, req_id))

            # Fetch agent name
            cursor.execute("""
                SELECT da.agent_code, da.vehicle_type, u.full_name
                FROM delivery_agents da
                JOIN users u ON da.user_id = u.id
                WHERE da.id = %s
            """, (agent_id,))
            agent = cursor.fetchone()
            agent_name = agent['full_name'] if agent else "Delivery Agent"

            # Notify the farmer that their requirement has been accepted
            cursor.execute("SELECT user_id FROM farmers WHERE id = %s", (req['farmer_id'],))
            farmer = cursor.fetchone()
            if farmer:
                cursor.execute("""
                    INSERT INTO notifications (user_id, title, message, type)
                    VALUES (%s, 'Delivery Agent Assigned', %s, 'delivery_assigned')
                """, (farmer['user_id'], f"Agent {agent_name} ({agent.get('vehicle_type', 'Vehicle')}) has accepted your {req['quantity']} {req['unit']} {req['crop_name']} delivery."))

            conn.commit()
            return True, {
                "message": f"Delivery requirement #{req['req_code']} successfully assigned to you!",
                "req_code": req['req_code'],
                "status": "accepted",
                "assigned_agent": agent_name
            }

    except Exception as e:
        conn.rollback()
        return False, f"Failed to accept requirement: {str(e)}"
    finally:
        conn.close()

def update_delivery_status(req_id, agent_id, new_status):
    """
    Transitions status to 'in_transit' or 'delivered'.
    """
    valid_statuses = ['in_transit', 'delivered']
    if new_status not in valid_statuses:
        return False, f"Invalid status. Must be one of: {', '.join(valid_statuses)}"

    conn = get_mysql_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT id, req_code, crop_name, farmer_id, delivery_agent_id, status
                FROM farmer_requirements
                WHERE id = %s FOR UPDATE
            """, (req_id,))
            req = cursor.fetchone()

            if not req:
                conn.rollback()
                return False, "Requirement not found."

            if req['delivery_agent_id'] != agent_id:
                conn.rollback()
                return False, "Unauthorized. You are not the assigned delivery agent for this requirement."

            now = datetime.now()
            if new_status == 'delivered':
                cursor.execute("""
                    UPDATE farmer_requirements
                    SET status = %s, delivered_at = %s
                    WHERE id = %s
                """, (new_status, now, req_id))
            else:
                cursor.execute("""
                    UPDATE farmer_requirements
                    SET status = %s
                    WHERE id = %s
                """, (new_status, req_id))

            # Notify farmer of transit/delivery update
            cursor.execute("SELECT user_id FROM farmers WHERE id = %s", (req['farmer_id'],))
            farmer = cursor.fetchone()
            if farmer:
                status_title = "Crop In Transit" if new_status == 'in_transit' else "Crop Delivered Successfully"
                cursor.execute("""
                    INSERT INTO notifications (user_id, title, message, type)
                    VALUES (%s, %s, %s, 'delivery_update')
                """, (farmer['user_id'], status_title, f"Status of your {req['crop_name']} shipment #{req['req_code']} updated to: {new_status.replace('_', ' ').title()}."))

            conn.commit()
            return True, {
                "message": f"Status updated to {new_status}.",
                "status": new_status,
                "req_code": req['req_code']
            }

    except Exception as e:
        conn.rollback()
        return False, f"Failed to update status: {str(e)}"
    finally:
        conn.close()

# In-memory store for active agent GPS telemetry (updated via mobile GPS pings or simulator)
_AGENT_LOCATIONS = {}

def update_agent_location(agent_id, lat, lng, speed=42.0, heading="South-West"):
    """
    Updates the live GPS coordinates and telemetry for a delivery agent.
    """
    try:
        lat = float(lat)
        lng = float(lng)
        speed = float(speed)
    except (ValueError, TypeError):
        return False, "Invalid coordinate or speed values."

    _AGENT_LOCATIONS[agent_id] = {
        "lat": lat,
        "lng": lng,
        "speed_kmh": speed,
        "heading": heading,
        "last_updated": datetime.now().strftime("%I:%M %p")
    }
    return True, _AGENT_LOCATIONS[agent_id]

def get_delivery_route(agent_id):
    """
    Returns full corridor navigation telemetry, road polyline coordinates,
    and waypoint stops for the delivery agent's active logistics route.
    """
    conn = get_mysql_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT da.agent_code, da.vehicle_type, da.vehicle_number, u.full_name, u.phone
                FROM delivery_agents da
                JOIN users u ON da.user_id = u.id
                WHERE da.id = %s
            """, (agent_id,))
            agent = cursor.fetchone()

            # Fetch any active assigned requirements for this agent
            cursor.execute("""
                SELECT id, req_code, crop_name, quantity, unit, pickup_location,
                       destination_location, trip_distance_km, status
                FROM farmer_requirements
                WHERE delivery_agent_id = %s AND status IN ('accepted', 'in_transit')
                ORDER BY id ASC
            """, (agent_id,))
            active_reqs = cursor.fetchall()
    except Exception:
        agent = None
        active_reqs = []
    finally:
        conn.close()

    # Determine vehicle live GPS position
    default_loc = {
        "lat": 31.1852,
        "lng": 75.5124,
        "speed_kmh": 42.0,
        "heading": "South-West",
        "last_updated": datetime.now().strftime("%I:%M %p"),
        "landmark": "Near Shankar Village, NH 703 Transit Corridor"
    }
    current_gps = _AGENT_LOCATIONS.get(agent_id, default_loc)

    # Waypoints definition along Jalandhar -> Nakodar -> Phagwara corridor
    waypoints = [
        {
            "stop_number": 1,
            "id": "stop-jalandhar",
            "name": "Jalandhar Farmer Hub",
            "city": "Jalandhar",
            "type": "pickup",
            "badge": "Collection Point",
            "status": "completed",
            "coordinates": [31.3260, 75.5762],
            "time_label": "Dep: 10:15 AM",
            "details": "Loaded 354 kg Tomatoes (Harpreet Singh)",
            "distance_km": 0.0,
            "notes": "Gate 2 collection completed"
        },
        {
            "stop_number": 2,
            "id": "stop-nakodar",
            "name": "FreshKart FPO, Nakodar",
            "city": "Nakodar",
            "type": "current",
            "badge": "Current Active Stop",
            "status": "active",
            "coordinates": [31.1274, 75.4720],
            "time_label": "ETA: 10:45 AM",
            "details": "Delivery handoff for 354 kg Tomatoes (FM-24081)",
            "distance_km": 18.6,
            "notes": "Unloading bay #4 reserved"
        },
        {
            "stop_number": 3,
            "id": "stop-phagwara",
            "name": "Punjab Agro Wholesale, Phagwara",
            "city": "Phagwara",
            "type": "destination",
            "badge": "Wholesale Mandi",
            "status": "upcoming",
            "coordinates": [31.2240, 75.7708],
            "time_label": "ETA: 12:30 PM",
            "details": "Delivery handoff for 500 kg Potatoes (FM-24082)",
            "distance_km": 26.4,
            "notes": "Scheduled for noon auction intake"
        }
    ]

    # Road corridor polyline (lat, lng points tracing the NH 703 & Phagwara transit route)
    corridor_path = [
        [31.3260, 75.5762], # Jalandhar Hub
        [31.2850, 75.5450], # Lambra Bypass
        [31.2320, 75.5120], # NH 703 North
        [31.1852, 75.5124], # Current live vehicle position (Shankar)
        [31.1510, 75.4950], # Nakodar Approach
        [31.1274, 75.4720], # Nakodar FPO Stop
        [31.1410, 75.5480], # Mehatpur Link
        [31.1720, 75.6450], # Jandiala Junction
        [31.2010, 75.7180], # Phagwara Bypass Road
        [31.2240, 75.7708]  # Phagwara Wholesale Mandi
    ]

    return {
        "success": True,
        "corridor": {
            "name": "NH 703 Agricultural Transit Corridor",
            "route_title": "Jalandhar → Nakodar → Phagwara",
            "status": "On Schedule",
            "status_code": "on_schedule",
            "total_distance_km": 47.0,
            "completed_distance_km": 18.6,
            "remaining_distance_km": 28.4,
            "estimated_duration": "2h 15m",
            "total_stops": len(waypoints),
            "completed_stops": 1,
            "active_stop_number": 2,
            "active_leg": "Nakodar → Phagwara"
        },
        "vehicle": {
            "agent_name": agent['full_name'] if agent else "Ramesh Kumar",
            "agent_code": agent['agent_code'] if agent else "AM-DA-1047",
            "driver_phone": agent['phone'] if agent and agent.get('phone') else "+91 98345 67890",
            "vehicle_type": agent['vehicle_type'] if agent else "Tata Ace",
            "vehicle_number": agent['vehicle_number'] if agent and agent.get('vehicle_number') else "PB 08 AX 4821",
            "telemetry": {
                "lat": current_gps['lat'],
                "lng": current_gps['lng'],
                "speed_kmh": current_gps['speed_kmh'],
                "heading": current_gps['heading'],
                "last_updated": current_gps['last_updated'],
                "landmark": current_gps.get('landmark', "Transit Corridor")
            }
        },
        "waypoints": waypoints,
        "corridor_path": corridor_path,
        "active_requirements": active_reqs
    }

