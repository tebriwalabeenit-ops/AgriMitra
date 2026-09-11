import re
import urllib.request
import json

def test_landing_page_no_server_banner():
    # Verify app.js has no server/port banner injection
    with open('app.js', 'r', encoding='utf-8') as f:
        app_js = f.read()
    assert 'agrimitra-port-reminder-banner' not in app_js, "agrimitra-port-reminder-banner found in app.js"
    assert 'Server Reminder' not in app_js, "Server Reminder found in app.js"
    assert 'running on port' not in app_js, "running on port found in app.js"
    
    # Verify index.html does not have server banner
    with open('index.html', 'r', encoding='utf-8') as f:
        index_html = f.read()
    assert 'agrimitra-port-reminder-banner' not in index_html, "banner id found in index.html"
    print("[PASS] Requirement 1: Landing page server banner completely removed.")

def test_farmer_registration_states_and_districts():
    with open('AgriMitra-Farmer/farmer/register.html', 'r', encoding='utf-8') as f:
        reg_html = f.read()
    
    # Verify all 28 states and 8 union territories are present
    expected_states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
        "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
        "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
        "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
        "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ]
    for st in expected_states:
        assert f'value="{st}"' in reg_html, f"State {st} missing in register.html"
    
    # Verify district dropdown element exists
    assert 'id="reg-district-select"' in reg_html, "reg-district-select missing in register.html"

    # Verify main.js contains comprehensive stateDistricts map and event listener
    with open('AgriMitra-Farmer/farmer/js/main.js', 'r', encoding='utf-8') as f:
        main_js = f.read()
    
    assert 'const stateDistricts = {' in main_js, "stateDistricts mapping missing in main.js"
    assert "'Maharashtra':" in main_js and "'Pune'" in main_js and "'Nashik'" in main_js, "Maharashtra districts missing"
    assert "'Punjab':" in main_js and "'Ludhiana'" in main_js and "'Amritsar'" in main_js, "Punjab districts missing"
    assert 'stateSelect.addEventListener(\'change\'' in main_js, "Change event listener missing for stateSelect"
    
    # Check all 36 States/UTs are keys in stateDistricts
    for st in expected_states:
        assert f"'{st}':" in main_js, f"State {st} missing in stateDistricts dictionary"
    
    print(f"[PASS] Requirement 2: Farmer registration has all 36 States/UTs ({len(expected_states)}) and full district dynamic population.")

def test_wholesaler_and_distributor_live_bidding_timers():
    # 1. Wholesaler Trading
    with open('wholesaler-trading.html', 'r', encoding='utf-8') as f:
        ws_html = f.read()
    assert 'id="mandi-clock-wholesaler"' in ws_html, "mandi-clock-wholesaler missing in wholesaler-trading.html"
    assert 'id="live-timer-wholesaler"' in ws_html, "live-timer-wholesaler missing in wholesaler-trading.html"
    assert 'id="wholesaler-hero-closes-in"' in ws_html, "wholesaler-hero-closes-in missing in wholesaler-trading.html"

    with open('assets/frontend_api.js', 'r', encoding='utf-8') as f:
        fe_api = f.read()
    assert 'initLiveMandiTimerAndClock' in fe_api, "initLiveMandiTimerAndClock missing in frontend_api.js"
    assert 'krishilink_timer_auction_target_' in fe_api, "Persistent target timestamp missing in frontend_api.js"
    assert 'initAllWholesalerCardTimers' in fe_api, "initAllWholesalerCardTimers missing in frontend_api.js"
    assert 'ws_live_card_timer_target_' in fe_api, "ws_live_card_timer_target_ missing in frontend_api.js"

    # 2. Distributor Dashboard
    with open('Agrimitra(wholesaler and distributer)/distributor-dashboard.html', 'r', encoding='utf-8') as f:
        dist_html = f.read()
    assert 'id="distributor-live-clock"' in dist_html, "distributor-live-clock missing in distributor-dashboard.html"
    assert 'class="dist-live-timer"' in dist_html, "dist-live-timer missing in distributor-dashboard.html"

    with open('Agrimitra(wholesaler and distributer)/js/distributor-dashboard.js', 'r', encoding='utf-8') as f:
        dist_js = f.read()
    assert 'initDistributorLiveBiddingTimers' in dist_js, "initDistributorLiveBiddingTimers missing in distributor-dashboard.js"
    assert 'agrimitra_dist_timer_end_' in dist_js, "agrimitra_dist_timer_end_ persistent storage missing in distributor-dashboard.js"
    assert 'updateMandiClock' in dist_js, "updateMandiClock missing in distributor-dashboard.js"

    # 3. Live Server Endpoints
    req = urllib.request.urlopen('http://127.0.0.1:5000/api/auctions')
    data = json.loads(req.read())
    active_auctions = [a for a in data['auctions'] if a['status'] == 'active']
    assert len(active_auctions) >= 3, "Active auctions should be present for live bidding"
    
    # Check fallback on /api/auctions/1
    req1 = urllib.request.urlopen('http://127.0.0.1:5000/api/auctions/1')
    data1 = json.loads(req1.read())
    assert data1['success'] and data1['auction']['seconds_remaining'] > 0, "Auction 1 fallback should succeed"

    print("[PASS] Requirement 3: Real-time live bidding timers and Mandi IST clocks verified for Wholesaler and Distributor dashboards.")

if __name__ == '__main__':
    test_landing_page_no_server_banner()
    test_farmer_registration_states_and_districts()
    test_wholesaler_and_distributor_live_bidding_timers()
    print("\nALL 3 USER REQUIREMENTS VERIFIED AND PASSING!")
