"""
Live Auction & Bidding API Routes for KrishiLink
Powers the Distributor Trading Cockpit & FPO Live Monitoring Console,
including real-time Server-Sent Events (SSE) updates.
"""

import time
import json
from datetime import datetime
from flask import Blueprint, request, jsonify, Response, session
from database.db import query_db
from services.auction_service import place_bid, finalize_auction
from services.broadcaster import broadcaster

auction_bp = Blueprint('auction', __name__, url_prefix='/api/auctions')

def _get_distributor_id():
    user_id = session.get('user_id')
    if user_id:
        d = query_db("SELECT id FROM distributors WHERE user_id = %s", (user_id,), one=True)
        if d: return d['id']
    # Default to first distributor for testing/demo
    first = query_db("SELECT id FROM distributors LIMIT 1", one=True)
    return first['id'] if first else 1

def to_datetime(val):
    if isinstance(val, datetime):
        return val
    if isinstance(val, str):
        val_clean = val.split('.')[0]
        for fmt in ('%Y-%m-%d %H:%M:%S', '%Y-%m-%d %H:%M', '%Y-%m-%d'):
            try:
                return datetime.strptime(val_clean, fmt)
            except ValueError:
                pass
    return datetime.now()

@auction_bp.route('', methods=['GET'])
def list_auctions():
    status_filter = request.args.get('status')
    
    query = """
        SELECT a.id, a.lot_code, a.product_name, a.category, a.description,
               a.quality_grade, a.quality_specs, a.quantity, a.unit, a.starting_price,
               a.min_increment, a.current_highest_bid, a.current_highest_bidder_id,
               a.start_time, a.end_time, a.status, a.image_url, a.hub_location,
               f.fpo_name, f.fpo_code,
               (SELECT COUNT(*) FROM bids WHERE auction_id = a.id) AS total_bids,
               (SELECT COUNT(DISTINCT distributor_id) FROM bids WHERE auction_id = a.id) AS total_bidders
        FROM auctions a
        JOIN fpos f ON a.fpo_id = f.id
    """
    params = []
    if status_filter:
        query += " WHERE a.status = %s"
        params.append(status_filter)
    query += " ORDER BY (CASE WHEN a.status = 'active' THEN 1 ELSE 0 END) DESC, a.id ASC"

    auctions = query_db(query, tuple(params))
    now = datetime.now()

    for a in auctions:
        a['quantity'] = float(a['quantity'])
        a['starting_price'] = float(a['starting_price'])
        a['min_increment'] = float(a['min_increment'])
        a['current_highest_bid'] = float(a['current_highest_bid'])
        # Compute dynamic time remaining
        if a['status'] == 'active':
            end_dt = to_datetime(a['end_time'])
            diff = int((end_dt - now).total_seconds())
            a['seconds_remaining'] = max(0, diff)
            hours = max(0, diff) // 3600
            minutes = (max(0, diff) % 3600) // 60
            seconds = max(0, diff) % 60
            a['time_remaining_formatted'] = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
        else:
            a['seconds_remaining'] = 0
            a['time_remaining_formatted'] = "00:00:00"

    return jsonify({"success": True, "auctions": auctions})

@auction_bp.route('/<int:auction_id>', methods=['GET'])
def get_auction(auction_id):
    auction = query_db("""
        SELECT a.id, a.lot_code, a.product_name, a.category, a.description,
               a.quality_grade, a.quality_specs, a.quantity, a.unit, a.starting_price,
               a.min_increment, a.current_highest_bid, a.current_highest_bidder_id,
               a.start_time, a.end_time, a.status, a.image_url, a.hub_location,
               f.fpo_name, f.fpo_code, f.warehouse_location,
               d.business_name AS leading_bidder_name, d.distributor_code
        FROM auctions a
        JOIN fpos f ON a.fpo_id = f.id
        LEFT JOIN distributors d ON a.current_highest_bidder_id = d.id
        WHERE a.id = %s
    """, (auction_id,), one=True)

    if not auction:
        return jsonify({"success": False, "message": "Auction not found."}), 404

    now = datetime.now()
    end_dt = to_datetime(auction['end_time'])
    diff = int((end_dt - now).total_seconds())
    auction['seconds_remaining'] = max(0, diff) if auction['status'] == 'active' else 0
    hours = max(0, diff) // 3600
    minutes = (max(0, diff) % 3600) // 60
    seconds = max(0, diff) % 60
    auction['time_remaining_formatted'] = f"{hours:02d}:{minutes:02d}:{seconds:02d}"

    auction['quantity'] = float(auction['quantity'])
    auction['starting_price'] = float(auction['starting_price'])
    auction['min_increment'] = float(auction['min_increment'])
    auction['current_highest_bid'] = float(auction['current_highest_bid'])
    auction['minimum_next_bid'] = round(auction['current_highest_bid'] + auction['min_increment'], 2)

    # Determine leading bidder tag
    if auction.get('distributor_code'):
        code_suffix = auction['distributor_code'].split('-')[-1]
        auction['leading_bidder_tag'] = f"Bidder #{code_suffix}"
    else:
        auction['leading_bidder_tag'] = "None"

    # Recent bids for feed
    bids = query_db("""
        SELECT id, bidder_tag, bid_amount, DATE_FORMAT(bid_time, '%%h:%%i %%p') AS formatted_time
        FROM bids
        WHERE auction_id = %s
        ORDER BY bid_amount DESC, id DESC
        LIMIT 10
    """, (auction_id,))
    for b in bids:
        b['bid_amount'] = float(b['bid_amount'])
    auction['recent_bids'] = bids

    return jsonify({"success": True, "auction": auction})

@auction_bp.route('/<int:auction_id>/bids', methods=['GET'])
def get_bids(auction_id):
    bids = query_db("""
        SELECT id, bidder_tag, bid_amount, DATE_FORMAT(bid_time, '%%h:%%i %%p') AS formatted_time, bid_time
        FROM bids
        WHERE auction_id = %s
        ORDER BY bid_amount DESC, id DESC
    """, (auction_id,))
    for b in bids:
        b['bid_amount'] = float(b['bid_amount'])
    return jsonify({"success": True, "bids": bids})

@auction_bp.route('/<int:auction_id>/bids', methods=['POST'])
def place_new_bid(auction_id):
    data = request.get_json(silent=True) or request.form
    bid_amount = data.get('bid_amount') or data.get('bid')

    if not bid_amount:
        return jsonify({"success": False, "message": "Bid amount is required."}), 400

    distributor_id = _get_distributor_id()

    success, result = place_bid(auction_id, distributor_id, bid_amount)
    if success:
        return jsonify({"success": True, "data": result}), 200
    else:
        return jsonify({"success": False, "message": result}), 400

@auction_bp.route('/<int:auction_id>/stream', methods=['GET'])
def stream_auction(auction_id):
    """
    Server-Sent Events (SSE) endpoint.
    Client opens: new EventSource('/api/auctions/1/stream')
    Receives instant JSON events whenever a valid bid is committed.
    """
    def event_stream():
        q = broadcaster.subscribe(auction_id)
        
        # Send initial connection event with latest state
        initial_auction = query_db("""
            SELECT current_highest_bid, current_highest_bidder_id, end_time, status 
            FROM auctions WHERE id = %s
        """, (auction_id,), one=True)

        if initial_auction:
            now = datetime.now()
            end_dt = to_datetime(initial_auction['end_time'])
            time_left = max(0, int((end_dt - now).total_seconds()))
            init_payload = {
                "type": "init",
                "auction_id": auction_id,
                "highest_bid": float(initial_auction['current_highest_bid']),
                "time_remaining_seconds": time_left,
                "status": initial_auction['status']
            }
            yield f"data: {json.dumps(init_payload)}\n\n"

        try:
            while True:
                try:
                    # Wait up to 15 seconds for a new bid event
                    message = q.get(timeout=15.0)
                    yield f"data: {message}\n\n"
                except:
                    # Heartbeat comment to keep HTTP connection alive
                    yield ": ping\n\n"
        finally:
            broadcaster.unsubscribe(auction_id, q)

    return Response(event_stream(), mimetype="text/event-stream", headers={
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no"
    })
