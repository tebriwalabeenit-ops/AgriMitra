from flask import Blueprint, jsonify, session
from utils.auth import login_required
from database.db import query_db, execute_db

notif_bp = Blueprint('notifications', __name__, url_prefix='/api/notifications')

@notif_bp.route('', methods=['GET'])
def get_notifications():
    user_id = session.get('user_id')
    if not user_id:

        return jsonify({"success": True, "notifications": [], "unread_count": 0})

    notifs = query_db("""
        SELECT id, title, message, type, is_read, DATE_FORMAT(created_at, '%%d %%b %%h:%%i %%p') AS formatted_time
        FROM notifications
        WHERE user_id = %s
        ORDER BY is_read ASC, id DESC
        LIMIT 20
    """, (user_id,))

    unread_count = sum(1 for n in notifs if not n['is_read'])
    return jsonify({
        "success": True,
        "notifications": notifs,
        "unread_count": unread_count
    })

@notif_bp.route('/<int:notif_id>/read', methods=['PUT', 'POST'])
def mark_read(notif_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"success": False, "message": "Authentication required."}), 401

    execute_db("UPDATE notifications SET is_read = TRUE WHERE id = %s AND user_id = %s", (notif_id, user_id))
    return jsonify({"success": True, "message": "Notification marked as read."})
