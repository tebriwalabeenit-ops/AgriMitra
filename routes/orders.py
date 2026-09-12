import json
import time
from flask import Blueprint, request, jsonify, session
from utils.auth import get_current_user, login_required
from database.db import query_db, execute_db

orders_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

@orders_bp.route('', methods=['GET'])
def get_orders():
    """Retrieve orders for the logged-in user or recent orders."""
    user = get_current_user()

    if user:
        if user['role'] == 'buyer':
            orders = query_db("""
                SELECT id, order_code, product_name, quantity, unit, price_per_unit, total_amount,
                       status, payment_status, delivery_address, items_json, created_at
                FROM orders
                WHERE buyer_id = %s OR buyer_id IS NULL
                ORDER BY created_at DESC
            """, (user['id'],))
        elif user['role'] in ('wholesaler', 'distributor'):
            orders = query_db("""
                SELECT id, order_code, product_name, quantity, unit, price_per_unit, total_amount,
                       status, payment_status, delivery_address, items_json, created_at
                FROM orders
                WHERE distributor_id = %s OR distributor_id IS NULL
                ORDER BY created_at DESC
            """, (user['id'],))
        else:
            orders = query_db("""
                SELECT id, order_code, product_name, quantity, unit, price_per_unit, total_amount,
                       status, payment_status, delivery_address, items_json, created_at
                FROM orders
                ORDER BY created_at DESC LIMIT 50
            """)
    else:
        orders = query_db("""
            SELECT id, order_code, product_name, quantity, unit, price_per_unit, total_amount,
                   status, payment_status, delivery_address, items_json, created_at
            FROM orders
            ORDER BY created_at DESC LIMIT 50
        """)

    parsed_orders = []
    for o in orders:
        ord_dict = dict(o)
        try:
            ord_dict['items'] = json.loads(ord_dict.get('items_json') or '[]')
        except Exception:
            ord_dict['items'] = []
        parsed_orders.append(ord_dict)

    return jsonify({"success": True, "orders": parsed_orders})

@orders_bp.route('', methods=['POST'])
def create_order():
    """Creates a new order from cart checkout or direct buy."""
    data = request.get_json(silent=True) or request.form
    user = get_current_user()

    items = data.get('items') or []
    if isinstance(items, str):
        try:
            items = json.loads(items)
        except Exception:
            items = []

    product_name = data.get('product_name')
    if not product_name:
        if items and len(items) > 0:
            product_name = ", ".join([it.get('name', 'Produce') for it in items[:2]])
            if len(items) > 2:
                product_name += f" +{len(items) - 2} more"
        else:
            product_name = "Fresh Farm Produce"

    quantity = float(data.get('quantity') or sum([float(it.get('qty', 1)) for it in items]) or 1.0)
    total_amount = float(data.get('total_amount') or 0.0)
    if total_amount <= 0:
        total_amount = sum([float(it.get('price', 0)) * float(it.get('qty', 1)) for it in items])
    if total_amount <= 0:
        total_amount = 520.0

    unit = data.get('unit', 'kg')
    price_per_unit = float(data.get('price_per_unit') or (total_amount / max(quantity, 1.0)))
    delivery_address = data.get('delivery_address') or (user.get('district') if user else 'Delivery Address, Sector 48, Gurugram')

    order_code = f"ORD-{int(time.time()) % 1000000:06d}"
    buyer_id = user.get('id') if user and user.get('role') == 'buyer' else None
    distributor_id = user.get('id') if user and user.get('role') in ('wholesaler', 'distributor') else None

    order_id = execute_db("""
        INSERT INTO orders (order_code, buyer_id, distributor_id, product_name, quantity, unit, price_per_unit, total_amount, status, payment_status, delivery_address, items_json)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        order_code, buyer_id, distributor_id, product_name, quantity, unit, price_per_unit, total_amount,
        'confirmed', 'paid_escrow', delivery_address, json.dumps(items)
    ))

    if user and user.get('id'):
        try:
            execute_db("""
                INSERT INTO notifications (user_id, title, message, type)
                VALUES (%s, %s, %s, %s)
            """, (user['id'], 'Order Placed Successfully', f"Order #{order_code} for {product_name} (₹{total_amount:.2f}) confirmed.", 'success'))
        except Exception:
            pass

    return jsonify({
        "success": True,
        "message": f"Order #{order_code} placed successfully!",
        "order": {
            "id": order_id,
            "order_code": order_code,
            "product_name": product_name,
            "quantity": quantity,
            "unit": unit,
            "total_amount": total_amount,
            "status": "confirmed",
            "payment_status": "paid_escrow",
            "delivery_address": delivery_address
        }
    }), 201
