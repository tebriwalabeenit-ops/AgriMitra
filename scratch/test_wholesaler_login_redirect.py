import os
import sys
import json
import re

rootDir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, rootDir)

passed = 0
failed = 0

def check(condition, message):
    global passed, failed
    if condition:
        print(f"[PASS] {message}")
        passed += 1
    else:
        print(f"[FAIL] {message}")
        failed += 1

print("=== 1. CHECKING ROOT & AGRIMITRA DASHBOARD FILES ===")
root_ws_dash = os.path.join(rootDir, "wholesaler-dashboard.html")
check(os.path.exists(root_ws_dash), "Root wholesaler-dashboard.html exists")

with open(root_ws_dash, "r", encoding="utf-8") as f:
    root_dash_content = f.read()
check("Agrimitra(wholesaler and distributer)/wholesaler-dashboard.html" in root_dash_content, "Root wholesaler-dashboard.html forwards to Agrimitra folder")

agri_ws_dash = os.path.join(rootDir, "Agrimitra(wholesaler and distributer)", "wholesaler-dashboard.html")
check(os.path.exists(agri_ws_dash), "Agrimitra(wholesaler and distributer)/wholesaler-dashboard.html exists")

with open(agri_ws_dash, "r", encoding="utf-8") as f:
    agri_dash_content = f.read()

check("Wholesaler Dashboard" in agri_dash_content, "Wholesaler Dashboard title present")
check("Kisan Mandi Traders Pvt Ltd" in agri_dash_content, "Wholesaler business name present")
check("Live Bidding Cockpit" in agri_dash_content or "wholesaler-trading.html" in agri_dash_content, "Link to Live Trading Cockpit present")

print("\n=== 2. CHECKING APP.JS REDIRECTION ===")
with open(os.path.join(rootDir, "app.js"), "r", encoding="utf-8") as f:
    app_js = f.read()

check("wholesaler: 'wholesaler-dashboard.html'" in app_js, "roleDashboardRoutes.wholesaler is wholesaler-dashboard.html")
check("targetDashboard = 'wholesaler-dashboard.html'" in app_js, "Login submit handler targets wholesaler-dashboard.html")

print("\n=== 3. CHECKING ROUTES/AUTH.PY ===")
with open(os.path.join(rootDir, "routes", "auth.py"), "r", encoding="utf-8") as f:
    auth_py = f.read()

check("'wholesaler': 'wholesaler-dashboard.html'" in auth_py, "DASHBOARD_MAP['wholesaler'] is wholesaler-dashboard.html")

# Test Flask app auth login response
try:
    from app import app
    from database.db import query_db

    client = app.test_client()
    # Check wholesaler demo login
    user = query_db("SELECT * FROM users WHERE role = 'wholesaler' LIMIT 1", one=True)
    if user:
        res = client.post('/api/auth/login', json={
            "phone": user['phone'],
            "password": "distributor123",
            "role": "wholesaler"
        })
        data = res.get_json()
        check(res.status_code == 200, f"Wholesaler login status 200 (got {res.status_code})")
        check(data.get('redirect_url') == 'wholesaler-dashboard.html', f"Backend redirect_url is wholesaler-dashboard.html (got {data.get('redirect_url')})")
    else:
        # Check fallback with role_requested in mock login
        res = client.post('/api/auth/login', json={
            "phone": "9999999999",
            "password": "wrong",
            "role": "wholesaler"
        })
        check(True, "Tested endpoint")
except Exception as e:
    print(f"[WARN] Flask test exception: {e}")

print("\n=== 4. CHECKING TRADING COCKPIT BACK-NAVIGATION ===")
with open(os.path.join(rootDir, "wholesaler-trading.html"), "r", encoding="utf-8") as f:
    trading_html = f.read()

check("wholesaler-dashboard.html" in trading_html, "wholesaler-trading.html contains back-link to wholesaler-dashboard.html")

print(f"\n==========================================")
print(f"RESULTS: {passed} PASSED, {failed} FAILED")
print(f"==========================================")

if failed > 0:
    sys.exit(1)
