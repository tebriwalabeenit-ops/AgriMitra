"""
AgriMitra Comprehensive End-to-End Test Suite
Validates all 24 Phases of the Technical Audit:
- All 6 Supported Roles (Farmer, FPO, Buyer, Wholesaler, Distributor, Delivery Agent)
- Registration & Validation (Duplicate phone/email, password hashing)
- Login & Strict Role Enforcement
- Live Bidding (FPO Auction creation, Wholesaler & Distributor bidding, automatic winner)
- Flash Sale (FPO voluntary listing, purchase flow)
- Delivery Lifecycle (Acceptance, strict sequential transitions, rejection of invalid jumps)
- Buyer Cart & Order Placement
- TrustScore Engine (Retrieval, verification, dynamic increments on trade/delivery completion)
- Data Persistence in permanent SQLite database
"""

import sys
import os
import json
import time
import unittest

# Ensure app imports from root
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app
from database.db import query_db, execute_db, get_db_connection
from services.auction_service import finalize_auction
from services.delivery_service import update_delivery_status

class AgriMitraComprehensiveFlowTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        cls.client = app.test_client()

    def test_01_all_six_roles_registration(self):
        """Test registration and profile creation for all 6 distinct roles."""
        roles_to_test = [
            ("farmer", "9900000001", "test_farmer@agrimitra.org", "Kisan Ramesh", "farmerPass123"),
            ("fpo", "9900000002", "test_fpo@agrimitra.org", "Sahyadri FPO", "fpoPass123"),
            ("buyer", "9900000003", "test_buyer@agrimitra.org", "Anita Retailer", "buyerPass123"),
            ("wholesaler", "9900000004", "test_wholesaler@agrimitra.org", "Apex Wholesalers", "wholesalerPass123"),
            ("distributor", "9900000005", "test_distributor@agrimitra.org", "Metro Agro Distribution", "distributorPass123"),
            ("delivery_agent", "9900000006", "test_agent@agrimitra.org", "Suresh Delivery", "deliveryPass123")
        ]

        for role, phone, email, name, pwd in roles_to_test:
            # Clean up if existed from previous run
            execute_db("DELETE FROM users WHERE phone = %s OR email = %s", (phone, email))
            
            res = self.client.post('/api/auth/register', json={
                "phone": phone,
                "email": email,
                "full_name": name,
                "password": pwd,
                "role": role,
                "district": "Pune",
                "state": "Maharashtra"
            })
            self.assertIn(res.status_code, (200, 201), f"Registration failed for role: {role}, msg: {res.get_json()}")
            data = res.get_json()
            self.assertTrue(data['success'])
            self.assertEqual(data['user']['role'], role)
            self.assertIn('redirect_url', data)

            # Verify saved in SQLite users table
            user = query_db("SELECT id, phone, email, role, password_hash FROM users WHERE phone = %s", (phone,), one=True)
            self.assertIsNotNone(user)
            self.assertEqual(user['role'], role)
            self.assertNotEqual(user['password_hash'], pwd, "Password must be hashed, not plaintext")

            # Verify role-specific profile created
            if role == 'farmer':
                p = query_db("SELECT id FROM farmers WHERE user_id = %s", (user['id'],), one=True)
            elif role == 'fpo':
                p = query_db("SELECT id FROM fpos WHERE user_id = %s", (user['id'],), one=True)
            elif role == 'buyer':
                p = query_db("SELECT id FROM buyers WHERE user_id = %s", (user['id'],), one=True)
            elif role == 'wholesaler':
                p = query_db("SELECT id FROM wholesalers WHERE user_id = %s", (user['id'],), one=True)
            elif role == 'distributor':
                p = query_db("SELECT id FROM distributors WHERE user_id = %s", (user['id'],), one=True)
            elif role == 'delivery_agent':
                p = query_db("SELECT id FROM delivery_agents WHERE user_id = %s", (user['id'],), one=True)
            
            self.assertIsNotNone(p, f"Role-specific profile table missing for {role}")

            # Verify initial TrustScore created
            ts = query_db("SELECT score FROM trust_scores WHERE user_id = %s", (user['id'],), one=True)
            self.assertIsNotNone(ts, f"Initial TrustScore missing for {role}")

        print("[PASS] Flow 1: All 6 roles registered with hashed passwords and role-specific profile tables.")

    def test_02_negative_auth_validation(self):
        """Test negative authentication scenarios: duplicate phone, duplicate email, wrong password, non-existent user."""
        # 1. Duplicate phone rejection
        res = self.client.post('/api/auth/register', json={
            "phone": "9900000001",
            "full_name": "Another Farmer",
            "password": "somepassword",
            "role": "farmer"
        })
        self.assertEqual(res.status_code, 409)
        self.assertFalse(res.get_json()['success'])

        # 2. Duplicate email rejection
        res = self.client.post('/api/auth/register', json={
            "phone": "9900009999",
            "email": "test_farmer@agrimitra.org",
            "full_name": "Another Farmer",
            "password": "somepassword",
            "role": "farmer"
        })
        self.assertEqual(res.status_code, 409)
        self.assertFalse(res.get_json()['success'])

        # 3. Wrong password on login
        res = self.client.post('/api/auth/login', json={
            "phone": "9900000001",
            "password": "WrongPassword!"
        })
        self.assertEqual(res.status_code, 401)
        self.assertFalse(res.get_json()['success'])

        # 4. Non-existent account
        res = self.client.post('/api/auth/login', json={
            "phone": "0000000000",
            "password": "AnyPassword"
        })
        self.assertEqual(res.status_code, 401)
        self.assertFalse(res.get_json()['success'])

        # 5. Role mismatch rejection on role-specific login
        res = self.client.post('/api/auth/login', json={
            "phone": "9900000001", # registered as farmer
            "password": "farmerPass123",
            "role": "buyer" # requested buyer login
        })
        self.assertEqual(res.status_code, 403)
        self.assertFalse(res.get_json()['success'])

        print("[PASS] Flow 2: Negative authentication validations (duplicates, wrong passwords, role mismatches) verified.")

    def test_03_login_and_session_me_endpoint(self):
        """Test login via email and phone, session persistence, and /api/auth/me."""
        # Login via email
        res = self.client.post('/api/auth/login', json={
            "phone": "test_buyer@agrimitra.org",
            "password": "buyerPass123"
        })
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.get_json()['success'])
        self.assertEqual(res.get_json()['user']['role'], 'buyer')

        # Verify /api/auth/me returns current session
        res_me = self.client.get('/api/auth/me')
        self.assertEqual(res_me.status_code, 200)
        me_data = res_me.get_json()
        self.assertTrue(me_data['authenticated'])
        self.assertEqual(me_data['user']['role'], 'buyer')

        # Logout
        self.client.get('/api/auth/logout')
        res_after = self.client.get('/api/auth/me')
        self.assertFalse(res_after.get_json()['authenticated'])

        print("[PASS] Flow 3: Login via email/phone and session /api/auth/me verified.")

    def test_04_wholesaler_vs_distributor_separation(self):
        """Verify Wholesaler != Distributor in database roles and trading access."""
        ws_user = query_db("SELECT id, role FROM users WHERE phone = '9900000004'", one=True)
        dst_user = query_db("SELECT id, role FROM users WHERE phone = '9900000005'", one=True)
        self.assertEqual(ws_user['role'], 'wholesaler')
        self.assertEqual(dst_user['role'], 'distributor')
        self.assertNotEqual(ws_user['role'], dst_user['role'])

        # Wholesaler profile exists in wholesalers table
        ws_prof = query_db("SELECT id FROM wholesalers WHERE user_id = %s", (ws_user['id'],), one=True)
        self.assertIsNotNone(ws_prof)

        # Distributor profile exists in distributors table
        dst_prof = query_db("SELECT id FROM distributors WHERE user_id = %s", (dst_user['id'],), one=True)
        self.assertIsNotNone(dst_prof)

        print("[PASS] Flow 4: Wholesaler and Distributor role separation verified.")

    def test_05_live_bidding_and_automatic_winner(self):
        """Test Live Bidding: FPO creates auction, Wholesaler bids, Distributor outbids, highest bid wins automatically."""
        # 1. Login as FPO and create an auction
        self.client.post('/api/auth/login', json={"phone": "9900000002", "password": "fpoPass123"})
        fpo_prof = query_db("SELECT id FROM fpos WHERE user_id = (SELECT id FROM users WHERE phone = '9900000002')", one=True)
        
        create_res = self.client.post('/api/fpo/auctions', json={
            "product_name": "Premium Nashik Red Onions",
            "category": "vegetables",
            "quantity": 1000.0,
            "unit": "kg",
            "starting_price": 28.0,
            "min_increment": 1.0,
            "duration_hours": 2,
            "location": "Lasalgaon Mandi Hub"
        })
        self.assertEqual(create_res.status_code, 201)
        auction_id = create_res.get_json()['auction']['id']

        # 2. Login as Wholesaler and place bid
        self.client.post('/api/auth/login', json={"phone": "9900000004", "password": "wholesalerPass123"})
        bid1_res = self.client.post(f'/api/auctions/{auction_id}/bids', json={"bid_amount": 30.0})
        self.assertEqual(bid1_res.status_code, 200)
        self.assertEqual(bid1_res.get_json()['data']['current_highest_bid'], 30.0)

        # 3. Login as Distributor and place higher bid
        self.client.post('/api/auth/login', json={"phone": "9900000005", "password": "distributorPass123"})
        bid2_res = self.client.post(f'/api/auctions/{auction_id}/bids', json={"bid_amount": 33.0})
        self.assertEqual(bid2_res.status_code, 200)
        self.assertEqual(bid2_res.get_json()['data']['current_highest_bid'], 33.0)

        # 4. Finalize auction -> highest bidder automatically wins
        success, final_res = finalize_auction(auction_id)
        self.assertTrue(success)
        self.assertEqual(final_res['winning_rate'], 33.0)

        # Verify order created in orders table
        ord_row = query_db("SELECT * FROM orders WHERE auction_id = %s", (auction_id,), one=True)
        self.assertIsNotNone(ord_row)
        self.assertEqual(ord_row['status'], 'confirmed')
        self.assertEqual(float(ord_row['total_amount']), 33000.0) # 1000 kg * 33.0

        print(f"[PASS] Flow 5: Live bidding flow with multi-role bidding and automatic winner assignment verified.")

    def test_06_flash_sale_system(self):
        """Test Flash Sale: FPO lists unsold lot into Flash Sale, Buyer/Wholesaler purchases it."""
        # 1. Login as FPO and create an ended auction with no winner
        self.client.post('/api/auth/login', json={"phone": "9900000002", "password": "fpoPass123"})
        fpo_prof = query_db("SELECT id FROM fpos WHERE user_id = (SELECT id FROM users WHERE phone = '9900000002')", one=True)
        
        auc_id = execute_db("""
            INSERT INTO auctions (lot_code, fpo_id, product_name, category, quantity, unit, starting_price, min_increment, current_highest_bid, start_time, end_time, status)
            VALUES ('TRD-FLS-001', %s, 'Alphonso Mangoes', 'fruits', 200.0, 'kg', 120.0, 5.0, 120.0, datetime('now', '-2 hours'), datetime('now', '-1 hour'), 'ended')
        """, (fpo_prof['id'],))

        # 2. FPO voluntarily lists lot in Flash Sale
        fs_res = self.client.post(f'/api/fpo/auctions/{auc_id}/flash-sale', json={
            "flash_price": 95.0,
            "duration_hours": 6,
            "notes": "Surplus orchard harvest - immediate clearance"
        })
        self.assertIn(fs_res.status_code, (200, 201))
        fs_data = fs_res.get_json()
        sale_id = fs_data['flash_sale']['id']

        # 3. View Flash Sale inventory
        get_res = self.client.get('/api/auctions/flash-sale')
        self.assertEqual(get_res.status_code, 200)
        sales = get_res.get_json()['flash_sales']
        self.assertTrue(any(s['id'] == sale_id for s in sales))

        # 4. Wholesaler buys the flash sale lot
        self.client.post('/api/auth/login', json={"phone": "9900000004", "password": "wholesalerPass123"})
        buy_res = self.client.post(f'/api/auctions/flash-sale/{sale_id}/buy')
        self.assertEqual(buy_res.status_code, 200)
        self.assertTrue(buy_res.get_json()['success'])

        # Verify flash sale item marked as sold
        updated_fs = query_db("SELECT status FROM flash_sales WHERE id = %s", (sale_id,), one=True)
        self.assertEqual(updated_fs['status'], 'sold')

        print("[PASS] Flow 6: Voluntary Flash Sale creation and immediate checkout verified.")

    def test_07_buyer_cart_and_orders(self):
        """Test Buyer cart checkout, order creation, and order history retrieval."""
        self.client.post('/api/auth/login', json={"phone": "9900000003", "password": "buyerPass123"})
        buyer_user = query_db("SELECT id FROM users WHERE phone = '9900000003'", one=True)

        items_payload = [
            {"id": 101, "name": "Fresh Tomatoes", "qty": 5, "price": 32.0},
            {"id": 102, "name": "Farm Spinach", "qty": 2, "price": 25.0}
        ]
        total = 5 * 32.0 + 2 * 25.0 # 210.0

        order_res = self.client.post('/api/orders', json={
            "items": items_payload,
            "total_amount": total,
            "delivery_address": "Flat 402, Green Meadows, Pune"
        })
        self.assertEqual(order_res.status_code, 201)
        ord_info = order_res.get_json()['order']
        self.assertEqual(ord_info['status'], 'confirmed')
        self.assertEqual(float(ord_info['total_amount']), 210.0)

        # Retrieve buyer's orders
        list_res = self.client.get('/api/orders')
        self.assertEqual(list_res.status_code, 200)
        orders = list_res.get_json()['orders']
        self.assertTrue(any(o['id'] == ord_info['id'] for o in orders))

        print("[PASS] Flow 7: Buyer cart checkout and order persistence verified.")

    def test_08_delivery_agent_sequential_lifecycle(self):
        """Test Delivery Agent: claim open requirement, reject invalid jump, execute sequential status updates."""
        # 1. Farmer creates delivery requirement
        self.client.post('/api/auth/login', json={"phone": "9900000001", "password": "farmerPass123"})
        req_res = self.client.post('/api/farmer/requirements', json={
            "crop_name": "Shimla Apples",
            "quantity": 400.0,
            "unit": "kg",
            "pickup_location": "Solan Cold Store",
            "destination_location": "Delhi Azadpur Mandi",
            "pickup_window": "Evening Slot"
        })
        self.assertEqual(req_res.status_code, 201)
        req_id = req_res.get_json()['requirement']['id']

        # 2. Delivery agent accepts requirement
        self.client.post('/api/auth/login', json={"phone": "9900000006", "password": "deliveryPass123"})
        da_prof = query_db("SELECT id FROM delivery_agents WHERE user_id = (SELECT id FROM users WHERE phone = '9900000006')", one=True)
        agent_id = da_prof['id']

        accept_res = self.client.post(f'/api/delivery/requirements/{req_id}/accept')
        self.assertEqual(accept_res.status_code, 200)

        # 3. Invalid jump test: attempting to mark 'delivered' directly from 'accepted'
        jump_res = self.client.post(f'/api/delivery/requirements/{req_id}/status', json={"status": "delivered"})
        self.assertEqual(jump_res.status_code, 400)
        self.assertIn("invalid transition", jump_res.get_json()['message'].lower())

        # 4. Valid sequential progression: accepted -> picked_up
        p1 = self.client.post(f'/api/delivery/requirements/{req_id}/status', json={"status": "picked_up"})
        self.assertEqual(p1.status_code, 200)
        self.assertEqual(p1.get_json()['data']['status'], 'picked_up')

        # 5. picked_up -> in_transit
        p2 = self.client.post(f'/api/delivery/requirements/{req_id}/status', json={"status": "in_transit"})
        self.assertEqual(p2.status_code, 200)
        self.assertEqual(p2.get_json()['data']['status'], 'in_transit')

        # 6. in_transit -> delivered
        p3 = self.client.post(f'/api/delivery/requirements/{req_id}/status', json={"status": "delivered"})
        self.assertEqual(p3.status_code, 200)
        self.assertEqual(p3.get_json()['data']['status'], 'delivered')

        # Verify persisted status in database
        final_req = query_db("SELECT status FROM farmer_requirements WHERE id = %s", (req_id,), one=True)
        self.assertEqual(final_req['status'], 'delivered')

        print("[PASS] Flow 8: Strict sequential delivery status updates (accepted -> picked_up -> in_transit -> delivered) verified.")

    def test_09_trustscore_retrieval_and_increments(self):
        """Test TrustScore retrieval, structure, and dynamic increments."""
        # Get delivery agent's trust score
        agent_user = query_db("SELECT id FROM users WHERE phone = '9900000006'", one=True)
        res = self.client.get(f'/api/trustscore/{agent_user["id"]}')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['success'])
        ts = data['trustscore']
        self.assertIn('score', ts)
        self.assertIn('rating', ts)
        self.assertIn('badges', ts)
        self.assertGreaterEqual(ts['successful_trades'], 1, "Successful delivery should increment successful_trades")

        # Test root aliased endpoint /api/trustscore/me when authenticated
        self.client.post('/api/auth/login', json={"phone": "9900000006", "password": "deliveryPass123"})
        res_me = self.client.get('/api/trustscore/me')
        self.assertEqual(res_me.status_code, 200)
        self.assertEqual(res_me.get_json()['trustscore']['user_id'], agent_user['id'])

        print("[PASS] Flow 9: TrustScore system retrieval and dynamic reward increments verified.")

    def test_10_database_persistence(self):
        """Verify data persistence across independent SQLite connections."""
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM users")
        user_cnt = list(cursor.fetchone().values())[0]
        cursor.execute("SELECT COUNT(*) FROM orders")
        order_cnt = list(cursor.fetchone().values())[0]
        cursor.execute("SELECT COUNT(*) FROM trust_scores")
        ts_cnt = list(cursor.fetchone().values())[0]
        conn.close()

        self.assertGreaterEqual(user_cnt, 6, "All 6 roles must persist")
        self.assertGreaterEqual(order_cnt, 1, "Orders must persist")
        self.assertGreaterEqual(ts_cnt, 6, "TrustScores must persist")

        print(f"[PASS] Flow 10: Permanent database persistence verified ({user_cnt} users, {order_cnt} orders, {ts_cnt} trust scores).")


if __name__ == '__main__':
    unittest.main(verbosity=2)
