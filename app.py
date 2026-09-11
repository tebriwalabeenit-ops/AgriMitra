"""
KrishiLink (AgriMitra) — Flask Backend Server
Smart Indian Hackathon (SIH) 2026
Connects existing frontend UI to Python Flask backend and MySQL relational database.
"""

import os
import sys
from flask import Flask, send_from_directory, jsonify, request
from config import Config

# Initialize Flask application
app = Flask(__name__, static_folder='.', static_url_path='')
app.config.from_object(Config)

# Register API Blueprints
from routes.auth import auth_bp
from routes.farmer import farmer_bp
from routes.fpo import fpo_bp
from routes.auction import auction_bp
from routes.delivery import delivery_bp
from routes.notifications import notif_bp

app.register_blueprint(auth_bp)
app.register_blueprint(farmer_bp)
app.register_blueprint(fpo_bp)
app.register_blueprint(auction_bp)
app.register_blueprint(delivery_bp)
app.register_blueprint(notif_bp)

# ==============================================================================
# CORS SUPPORT FOR BROWSER & STATIC CLIENT ACCESS
# ==============================================================================

@app.after_request
def add_cors_headers(response):
    origin = request.headers.get('Origin')
    if origin:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
    else:
        response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept'
    return response

@app.route('/api/<path:subpath>', methods=['OPTIONS'])
def options_preflight(subpath):
    response = jsonify({"success": True})
    origin = request.headers.get('Origin')
    if origin:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
    else:
        response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept'
    return response, 200

# ==============================================================================
# STATIC & FRONTEND PAGE ROUTING
# Serves existing HTML pages, CSS, JS, and media assets without altering UI
# ==============================================================================

@app.route('/')
def index():
    return send_from_directory(app.root_path, 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    file_path = os.path.join(app.root_path, filename)
    if os.path.isfile(file_path):
        return send_from_directory(app.root_path, filename)
    # Check if html extension is omitted
    if os.path.isfile(file_path + '.html'):
        return send_from_directory(app.root_path, filename + '.html')
    return send_from_directory(app.root_path, 'index.html')

# ==============================================================================
# HEALTH CHECK & STATUS
# ==============================================================================

@app.route('/api/health', methods=['GET'])
def health():
    db_status = "connected"
    try:
        from database.db import query_db
        query_db("SELECT 1", one=True)
    except Exception as e:
        db_status = f"unavailable ({str(e)})"

    return jsonify({
        "status": "online",
        "platform": "KrishiLink (AgriMitra)",
        "database": db_status
    })

# ==============================================================================
# GLOBAL ERROR HANDLING
# ==============================================================================

@app.errorhandler(404)
def not_found(e):
    if request.path.startswith('/api/'):
        return jsonify({"success": False, "message": "API endpoint not found"}), 404
    return send_from_directory(app.root_path, 'index.html')

@app.errorhandler(500)
def server_error(e):
    if request.path.startswith('/api/'):
        return jsonify({"success": False, "message": "An internal server error occurred."}), 500
    return "<h3>500 Internal Server Error</h3>", 500

# ==============================================================================
# APPLICATION ENTRYPOINT
# ==============================================================================

def init_app():
    """Attempt initial database connection check."""
    try:
        from database.seed import seed_database
        print("Checking MySQL database connection and seed state...")
        seed_database()
        print("MySQL database ready.")
    except Exception as e:
        print(f"\n[Notice] MySQL server is not connected or requires credentials: {e}")
        print("To configure MySQL, edit .env with your credentials and run: python database/seed.py\n")

if __name__ == '__main__':
    init_app()
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting KrishiLink Flask Server at http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True, threaded=True)
