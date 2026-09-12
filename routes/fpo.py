import os
import base64
import time
from datetime import datetime, timedelta
import random
from flask import Blueprint, request, jsonify, session
from utils.auth import login_required, role_required
from database.db import query_db, execute_db
from services.auction_service import finalize_auction

fpo_bp = Blueprint('fpo', __name__, url_prefix='/api/fpo')

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

def _get_fpo_id():
    user_id = session.get('user_id')
    if user_id:
        f = query_db("SELECT id FROM fpos WHERE user_id = %s", (user_id,), one=True)
        if f: return f['id']
    first = query_db("SELECT id FROM fpos LIMIT 1", one=True)
    return first['id'] if first else 1

@fpo_bp.route('/dashboard', methods=['GET'])
def dashboard():
    fpo_id = _get_fpo_id()
    fpo = query_db("SELECT * FROM fpos WHERE id = %s", (fpo_id,), one=True) or {
        "fpo_name": "Nashik Farmers Collective",
        "fpo_code": "MH-NSK-401"
    }

    auctions = query_db("""
        SELECT id, lot_code, product_name, category, quantity, unit, starting_price,
               current_highest_bid, status, start_time, end_time, image_url
        FROM auctions
        WHERE fpo_id = %s
        ORDER BY id DESC
    """, (fpo_id,))

    active_auctions = [a for a in auctions if a['status'] == 'active']
    upcoming_auctions = [a for a in auctions if a['status'] == 'upcoming']
    completed_auctions = [a for a in auctions if a['status'] == 'ended']

    return jsonify({
        "success": True,
        "organization": {
            "name": fpo['fpo_name'],
            "fpo_code": fpo['fpo_code'],
            "reg_number": fpo.get('reg_number', 'FPO #MH-NSK-401'),
            "farmers_count": 184,
            "total_tonnes": 18.6,
            "active_auctions": len(active_auctions),
            "upcoming_auctions": len(upcoming_auctions),
            "completed_auctions": len(completed_auctions)
        },
        "auctions": {
            "active": active_auctions,
            "upcoming": upcoming_auctions,
            "completed": completed_auctions
        }
    })

@fpo_bp.route('/auctions', methods=['GET'])
def get_auctions():
    fpo_id = _get_fpo_id()
    auctions = query_db("""
        SELECT a.id, a.lot_code, a.product_name, a.category, a.description,
               a.quality_grade, a.quality_specs, a.quantity, a.unit, a.starting_price,
               a.min_increment, a.current_highest_bid, a.current_highest_bidder_id,
               a.start_time, a.end_time, a.status, a.image_url, a.hub_location,
               d.business_name AS highest_bidder_business,
               (SELECT COUNT(*) FROM bids WHERE auction_id = a.id) AS total_bids,
               (SELECT COUNT(DISTINCT distributor_id) FROM bids WHERE auction_id = a.id) AS total_bidders
        FROM auctions a
        LEFT JOIN distributors d ON a.current_highest_bidder_id = d.id
        WHERE a.fpo_id = %s
        ORDER BY a.id DESC
    """, (fpo_id,))

    for a in auctions:
        a['quantity'] = float(a['quantity'])
        a['starting_price'] = float(a['starting_price'])
        a['min_increment'] = float(a['min_increment'])
        a['current_highest_bid'] = float(a['current_highest_bid'])
        now = datetime.now()
        start_dt = to_datetime(a['start_time'])
        end_dt = to_datetime(a['end_time'])

        if a['status'] != 'ended':
            if start_dt <= now < end_dt:
                a['status'] = 'active'
            elif now < start_dt:
                a['status'] = 'upcoming'
            else:
                a['status'] = 'ended'

        a['seconds_remaining'] = max(0, int((end_dt - now).total_seconds())) if a['status'] == 'active' else 0
        a['start_date_formatted'] = start_dt.strftime('%d %B')
        a['start_time_formatted'] = start_dt.strftime('%I:%M %p')
        diff_hours = max(1, round((end_dt - start_dt).total_seconds() / 3600))
        a['duration_formatted'] = f"{diff_hours} Hour" if diff_hours == 1 else f"{diff_hours} Hours"

    return jsonify({
        "success": True,
        "auctions": auctions
    })

@fpo_bp.route('/auctions', methods=['POST'])
def create_auction():
    fpo_id = _get_fpo_id()
    data = request.get_json(silent=True) or request.form

    product_name = (
        data.get('product_name') or
        data.get('title') or
        data.get('name') or
        data.get('bidding-product-name') or
        data.get('product-name') or
        ''
    ).strip()

    category = (
        data.get('category') or
        data.get('crop_category') or
        data.get('bidding-category') or
        data.get('product-category') or
        'grains'
    ).strip()

    description = (
        data.get('description') or
        data.get('bidding-description') or
        data.get('product-description') or
        ''
    ).strip()

    quality_grade = (
        data.get('quality_grade') or
        data.get('quality-grade') or
        'A'
    ).strip()

    quality_specs = (
        data.get('quality_specs') or
        data.get('quality-specs') or
        'Mandi Verified QC'
    ).strip()

    quantity = data.get('quantity') or data.get('quantity-input')
    unit = (data.get('unit') or data.get('quantity-unit-select') or 'kg').strip()
    starting_price = data.get('starting_price') or data.get('start-price-input') or data.get('price')
    min_increment = data.get('min_increment') or data.get('bid-increment-input') or 0.50

    bidding_date = data.get('schedule_date') or data.get('schedule-date')
    start_time_str = data.get('schedule_start') or data.get('schedule-start') or '10:00'
    end_time_str = data.get('schedule_end') or data.get('schedule-end') or '11:00'

    if not product_name:
        return jsonify({"success": False, "message": "Product name is required."}), 400

    try:
        qty_val = float(quantity) if quantity is not None else 5000.0
        start_price_val = float(starting_price) if starting_price is not None else 28.0
        min_inc_val = float(min_increment) if min_increment is not None else 0.50
        if qty_val <= 0 or start_price_val <= 0 or min_inc_val <= 0:
            return jsonify({"success": False, "message": "Quantity, starting price, and increment must be positive."}), 400
    except (ValueError, TypeError):
        return jsonify({"success": False, "message": "Invalid numeric values provided."}), 400

    now = datetime.now()
    if bidding_date:
        try:
            start_dt = datetime.strptime(f"{bidding_date} {start_time_str}", "%Y-%m-%d %H:%M")
            end_dt = datetime.strptime(f"{bidding_date} {end_time_str}", "%Y-%m-%d %H:%M")
        except ValueError:
            start_dt = now
            end_dt = now + timedelta(hours=1)
    else:
        start_dt = now
        end_dt = now + timedelta(hours=1)

    if start_dt > now:
        status = 'upcoming'
        if end_dt <= start_dt:
            end_dt = start_dt + timedelta(hours=1)
    else:

        if end_dt <= now:
            start_dt = now
            end_dt = now + timedelta(hours=1)
        status = 'active' if start_dt <= now < end_dt else ('upcoming' if now < start_dt else 'ended')

    prefix = product_name[:3].upper() if len(product_name) >= 3 else "AGR"
    lot_code = None
    for _ in range(30):
        candidate = f"TRD-{prefix}-{random.randint(100, 999)}"
        existing = query_db("SELECT id FROM auctions WHERE lot_code = %s", (candidate,), one=True)
        if not existing:
            lot_code = candidate
            break
    if not lot_code:
        lot_code = f"TRD-{prefix}-{int(time.time()) % 100000}"

    custom_img = data.get('image_url') or data.get('image') or data.get('produce_image')
    image_data = data.get('image_data')

    img = None
    if image_data and isinstance(image_data, str) and image_data.startswith('data:image/'):
        try:
            header, encoded = image_data.split(';base64,', 1)
            ext = header.split('/')[-1].split('+')[0].lower()
            if ext not in ('jpeg', 'jpg', 'png', 'webp', 'gif'):
                ext = 'jpg'
            uploads_dir = os.path.join(os.getcwd(), 'assets', 'uploads')
            os.makedirs(uploads_dir, exist_ok=True)
            clean_lot = lot_code.replace('-', '_')
            filename = f"produce_{clean_lot}_{int(time.time())}.{ext}"
            file_path = os.path.join(uploads_dir, filename)
            with open(file_path, 'wb') as fh:
                fh.write(base64.b64decode(encoded))
            img = f"assets/uploads/{filename}"
        except Exception as e:
            print(f"[KrishiLink] Note decoding uploaded image: {e}")
            if custom_img:
                img = custom_img
    elif custom_img and isinstance(custom_img, str) and len(custom_img.strip()) > 0:
        img = custom_img.strip()

    if not img:
        p_lower = product_name.lower()
        if 'wheat' in p_lower:
            img = 'assets/produce/wheat.jpg'
        elif 'potato' in p_lower:
            img = 'assets/produce/potato.jpg'
        elif 'onion' in p_lower:
            img = 'assets/produce/onion.jpg'
        elif 'rice' in p_lower or 'paddy' in p_lower:
            img = 'assets/produce/rice.jpg'
        elif 'chana' in p_lower or 'chickpea' in p_lower:
            img = 'assets/produce/chana.jpg'
        elif 'tomato' in p_lower:
            img = 'assets/produce/tomato.jpg'
        elif 'mustard' in p_lower:
            img = 'assets/produce/mustard.jpg'
        elif 'apple' in p_lower:
            img = 'assets/produce/apple.jpg'
        elif 'cauliflower' in p_lower:
            img = 'assets/produce/cauliflower.jpg'
        else:
            img = 'assets/produce/wheat.jpg'

    auction_id = execute_db("""
        INSERT INTO auctions
        (lot_code, fpo_id, product_name, category, description, quality_grade, quality_specs,
         quantity, unit, starting_price, min_increment, current_highest_bid, start_time, end_time,
         status, image_url, hub_location)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'Central Mandi Hub')
    """, (lot_code, fpo_id, product_name, category, description, quality_grade, quality_specs,
          qty_val, unit, start_price_val, min_inc_val, start_price_val, start_dt, end_dt, status, img))

    diff_hours = max(1, round((end_dt - start_dt).total_seconds() / 3600))
    duration_str = f"{diff_hours} Hour" if diff_hours == 1 else f"{diff_hours} Hours"

    return jsonify({
        "success": True,
        "message": f"Live Bidding session for {product_name} (Lot #{lot_code}) created successfully!",
        "lot_code": lot_code,
        "auction_id": auction_id,
        "status": status,
        "auction": {
            "id": auction_id,
            "lot_code": lot_code,
            "product_name": product_name,
            "status": status,
            "starting_price": start_price_val,
            "quantity": qty_val,
            "unit": unit,
            "min_increment": min_inc_val,
            "start_time": str(start_dt),
            "end_time": str(end_dt),
            "start_date_formatted": start_dt.strftime('%d %B'),
            "start_time_formatted": start_dt.strftime('%I:%M %p'),
            "duration_formatted": duration_str,
            "image_url": img,
            "hub_location": "Central Mandi Hub"
        }
    }), 201

@fpo_bp.route('/auctions/<int:auction_id>/close', methods=['POST'])
def close_auction(auction_id):
    fpo_id = _get_fpo_id()

    auction = query_db("SELECT id, fpo_id, status FROM auctions WHERE id = %s", (auction_id,), one=True)
    if not auction:
        return jsonify({"success": False, "message": "Auction not found."}), 404

    success, result = finalize_auction(auction_id)
    if success:
        return jsonify({"success": True, "data": result})
    return jsonify({"success": False, "message": result}), 400

@fpo_bp.route('/upload-image', methods=['POST'])
def upload_image():
    """Upload produce image from computer or mobile camera/gallery."""
    if 'file' in request.files:
        file = request.files['file']
        if file.filename != '':
            ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else 'jpg'
            if ext not in ('jpg', 'jpeg', 'png', 'webp', 'gif'):
                ext = 'jpg'
            uploads_dir = os.path.join(os.getcwd(), 'assets', 'uploads')
            os.makedirs(uploads_dir, exist_ok=True)
            filename = f"upload_{int(time.time())}_{random.randint(1000, 9999)}.{ext}"
            file_path = os.path.join(uploads_dir, filename)
            file.save(file_path)
            rel_url = f"assets/uploads/{filename}"
            return jsonify({
                "success": True,
                "image_url": rel_url,
                "filename": filename
            })

    data = request.get_json(silent=True) or {}
    image_data = data.get('image_data')
    if image_data and isinstance(image_data, str) and image_data.startswith('data:image/'):
        try:
            header, encoded = image_data.split(';base64,', 1)
            ext = header.split('/')[-1].split('+')[0].lower()
            if ext not in ('jpeg', 'jpg', 'png', 'webp', 'gif'):
                ext = 'jpg'
            uploads_dir = os.path.join(os.getcwd(), 'assets', 'uploads')
            os.makedirs(uploads_dir, exist_ok=True)
            filename = f"upload_{int(time.time())}_{random.randint(1000, 9999)}.{ext}"
            file_path = os.path.join(uploads_dir, filename)
            with open(file_path, 'wb') as fh:
                fh.write(base64.b64decode(encoded))
            rel_url = f"assets/uploads/{filename}"
            return jsonify({
                "success": True,
                "image_url": rel_url,
                "filename": filename
            })
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 400

    return jsonify({"success": False, "message": "No file or image data provided"}), 400
