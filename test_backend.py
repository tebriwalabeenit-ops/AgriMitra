import unittest
import json
import time
import os
from datetime import datetime, timedelta
from app import app
from database.db import query_db, execute_db
from services.broadcaster import broadcaster

class KrishiLinkBackendTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        import os
        from database.seed import seed_database
        if os.path.exists("krishilink_test.db"):
            try:
                os.remove("krishilink_test.db")
            except Exception:
                pass
        seed_database()

        future_time = (datetime.now() + timedelta(hours=24)).strftime('%Y-%m-%d %H:%M:%S')
        execute_db("UPDATE auctions SET status = 'active', end_time = %s WHERE id = 1", (future_time,))

    def setUp(self):
        self.client = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()

    def tearDown(self):
        self.app_context.pop()

    def test_01_farmer_registration(self):
        test_phone = f"98765{int(time.time() * 100) % 100000:05d}"
        payload = {
            "phone": test_phone,
            "password": "strongPassword123",
            "full_name": "Suresh Kumar",
            "role": "farmer",
            "state": "Punjab",
            "district": "Ludhiana"
        }
        res = self.client.post('/api/auth/register', json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(data['user']['role'], 'farmer')

        user = query_db("SELECT id, phone, role FROM users WHERE phone = %s", (test_phone,), one=True)
        self.assertIsNotNone(user)
        self.assertEqual(user['role'], 'farmer')
        print("[PASS] Test 1: Farmer registration verified.")

    def test_02_farmer_login(self):
        payload = {
            "phone": "9876543210",
            "password": "farmer123",
            "role": "farmer"
        }
        res = self.client.post('/api/auth/login', json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(data['user']['role'], 'farmer')

        me_res = self.client.get('/api/auth/me')
        self.assertEqual(me_res.status_code, 200)
        me_data = me_res.get_json()
        self.assertTrue(me_data['authenticated'])
        self.assertEqual(me_data['user']['phone'], '9876543210')
        print("[PASS] Test 2: Farmer login and session persistence verified.")

    def test_03_farmer_creates_produce(self):
        self.client.post('/api/auth/login', json={"phone": "9876543210", "password": "farmer123"})

        payload = {
            "crop_name": "Mustard Seeds (Sarson)",
            "variety": "Pusa Bold",
            "quantity": 80.0,
            "unit": "Quintals",
            "expected_price": 5400.0,
            "location": "Ludhiana Grain Market"
        }
        res = self.client.post('/api/farmer/produce', json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(data['produce']['crop_name'], "Mustard Seeds (Sarson)")

        list_res = self.client.get('/api/farmer/produce')
        self.assertEqual(list_res.status_code, 200)
        crops = list_res.get_json()['produce']
        self.assertTrue(any(c['crop_name'] == "Mustard Seeds (Sarson)" for c in crops))
        print("[PASS] Test 3: Farmer produce creation verified.")

    def test_04_farmer_creates_delivery_requirement(self):
        self.client.post('/api/auth/login', json={"phone": "9876543210", "password": "farmer123"})

        payload = {
            "crop_name": "Tomatoes",
            "quantity": 354.0,
            "unit": "kg",
            "pickup_location": "Jalandhar Farm Gate #4",
            "destination_location": "FreshKart FPO Nakodar",
            "pickup_window": "10:30 AM - 11:30 AM",
            "notes": "Handle ripe tomato crates with care."
        }
        res = self.client.post('/api/farmer/requirements', json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(data['requirement']['status'], 'pending')
        self.assertEqual(data['requirement']['quantity'], 354.0)
        print("[PASS] Test 4: Farmer delivery requirement (Tomato 354kg) created.")

    def test_05_delivery_agent_sees_requirements(self):
        self.client.post('/api/auth/login', json={"phone": "9834567890", "password": "delivery123"})

        res = self.client.get('/api/delivery/requirements')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertTrue(len(data['requirements']) >= 1)
        print(f"[PASS] Test 5: Delivery agent retrieved {len(data['requirements'])} open requirements.")

    def test_06_delivery_agent_accepts_requirement(self):
        self.client.post('/api/auth/login', json={"phone": "9834567890", "password": "delivery123"})

        reqs = self.client.get('/api/delivery/requirements').get_json()['requirements']
        target_req = reqs[0]
        req_id = target_req['id']

        res = self.client.post(f'/api/delivery/requirements/{req_id}/accept')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(data['data']['status'], 'accepted')

        req = query_db("SELECT status, delivery_agent_id FROM farmer_requirements WHERE id = %s", (req_id,), one=True)
        self.assertEqual(req['status'], 'accepted')
        self.assertIsNotNone(req['delivery_agent_id'])
        print(f"[PASS] Test 6: Delivery requirement #{target_req['req_code']} successfully accepted.")

    def test_07_prevent_double_acceptance(self):
        self.client.post('/api/auth/login', json={"phone": "9834567890", "password": "delivery123"})

        accepted_req = query_db("SELECT id FROM farmer_requirements WHERE status = 'accepted' LIMIT 1", one=True)
        self.assertIsNotNone(accepted_req)

        res = self.client.post(f'/api/delivery/requirements/{accepted_req["id"]}/accept')
        self.assertEqual(res.status_code, 409)
        data = res.get_json()
        self.assertFalse(data['success'])
        self.assertIn("already", data['message'].lower())
        print("[PASS] Test 7: Race condition prevented - double acceptance rejected.")

    def test_08_fpo_creates_auction(self):
        self.client.post('/api/auth/login', json={"phone": "9812345678", "password": "fpo12345"})

        payload = {
            "product_name": "Organic Soybean",
            "category": "pulses",
            "description": "Certified non-GMO bold yellow soybean lot.",
            "quality_grade": "A",
            "quantity": 4000.0,
            "unit": "kg",
            "starting_price": 42.0,
            "min_increment": 0.50
        }
        res = self.client.post('/api/fpo/auctions', json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(data['auction']['product_name'], "Organic Soybean")
        self.assertIn('lot_code', data)
        self.assertIn('auction_id', data)
        print(f"[PASS] Test 8: FPO created auction (Lot #{data['auction']['lot_code']}).")

    def test_08b_fpo_creates_auction_with_frontend_payload(self):

        payload = {
            "title": "Fresh Sharbati Wheat",
            "crop_category": "grains",
            "description": "Export grade Sharbati wheat lot.",
            "quality_grade": "A",
            "quality_specs": "Machine sorted, <0.1% foreign matter",
            "quantity": 6000.0,
            "unit": "kg",
            "starting_price": 31.0,
            "min_increment": 0.50
        }
        res = self.client.post('/api/fpo/auctions', json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(data['auction']['product_name'], "Fresh Sharbati Wheat")
        self.assertEqual(data['auction']['status'], 'active')
        self.assertIn('lot_code', data)
        print(f"[PASS] Test 8b: FPO created auction with frontend keys (Lot #{data['lot_code']}).")

    def test_08c_fpo_create_auction_with_image_upload(self):
        self.client.post('/api/auth/login', json={"phone": "9812345678", "password": "fpo12345"})
        import base64
        tiny_png = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
        b64_image = 'data:image/png;base64,' + base64.b64encode(tiny_png).decode('ascii')

        payload = {
            "product_name": "Organic Golden Wheat",
            "category": "grains",
            "description": "Premium wheat with uploaded photograph",
            "quality_grade": "A",
            "quality_specs": "Mandi Lab Certified",
            "quantity": 4000.0,
            "unit": "kg",
            "starting_price": 32.0,
            "min_increment": 0.50,
            "image_data": b64_image
        }
        res = self.client.post('/api/fpo/auctions', json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertTrue(data['success'])
        img_url = data['auction']['image_url']
        self.assertTrue(img_url.startswith('assets/uploads/produce_'))
        self.assertTrue(os.path.exists(img_url))
        print(f"[PASS] Test 8c: FPO created auction with uploaded device image saved to {img_url}.")

    def test_09_distributor_views_auction(self):
        res = self.client.get('/api/auctions')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertTrue(len(data['auctions']) >= 1)

        auction_id = data['auctions'][0]['id']
        detail_res = self.client.get(f'/api/auctions/{auction_id}')
        self.assertEqual(detail_res.status_code, 200)
        self.assertIn('starting_price', detail_res.get_json()['auction'])
        print(f"[PASS] Test 9: Distributor can browse and view auction #{auction_id}.")

    def test_10_distributor_places_bid(self):
        self.client.post('/api/auth/login', json={"phone": "9823456789", "password": "dist12345"})

        auction = query_db("SELECT id, current_highest_bid, min_increment FROM auctions WHERE id = 1", one=True)
        current_highest = float(auction['current_highest_bid'])
        min_inc = float(auction['min_increment'])
        new_bid = round(current_highest + min_inc, 2)

        res = self.client.post('/api/auctions/1/bids', json={"bid_amount": new_bid})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(data['data']['current_highest_bid'], new_bid)

        updated_auction = query_db("SELECT current_highest_bid FROM auctions WHERE id = 1", one=True)
        self.assertEqual(float(updated_auction['current_highest_bid']), new_bid)
        print(f"[PASS] Test 10: Distributor 1 placed valid bid of Rs {new_bid:.2f}/kg.")

    def test_11_second_distributor_places_higher_bid(self):
        self.client.post('/api/auth/login', json={"phone": "9823456790", "password": "dist12345"})

        auction = query_db("SELECT id, current_highest_bid, min_increment FROM auctions WHERE id = 1", one=True)
        current_highest = float(auction['current_highest_bid'])
        min_inc = float(auction['min_increment'])
        higher_bid = round(current_highest + min_inc + 1.0, 2)

        res = self.client.post('/api/auctions/1/bids', json={"bid_amount": higher_bid})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(data['data']['current_highest_bid'], higher_bid)
        print(f"[PASS] Test 11: Distributor 2 outbid with Rs {higher_bid:.2f}/kg.")

    def test_12_real_time_broadcast_delivery(self):
        q = broadcaster.subscribe(1)
        self.assertIsNotNone(q)

        try:
            self.client.post('/api/auth/login', json={"phone": "9823456789", "password": "dist12345"})
            auction = query_db("SELECT current_highest_bid, min_increment FROM auctions WHERE id = 1", one=True)
            bid_val = round(float(auction['current_highest_bid']) + float(auction['min_increment']), 2)

            res = self.client.post('/api/auctions/1/bids', json={"bid_amount": bid_val})
            self.assertEqual(res.status_code, 200)

            msg = q.get(timeout=2.0)
            event = json.loads(msg)
            self.assertEqual(event['type'], 'new_bid')
            self.assertEqual(event['highest_bid'], bid_val)
            print("[PASS] Test 12: Real-time broadcast pushed instantly to connected client.")
        finally:
            broadcaster.unsubscribe(1, q)

    def test_13_invalid_lower_bid_rejected(self):
        self.client.post('/api/auth/login', json={"phone": "9823456789", "password": "dist12345"})

        auction = query_db("SELECT current_highest_bid FROM auctions WHERE id = 1", one=True)
        current_highest = float(auction['current_highest_bid'])
        invalid_low_bid = current_highest - 5.0

        res = self.client.post('/api/auctions/1/bids', json={"bid_amount": invalid_low_bid})
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertFalse(data['success'])
        self.assertIn("too low", data['message'].lower())
        print(f"[PASS] Test 13: Invalid lower bid of Rs {invalid_low_bid:.2f} rejected by backend.")

    def test_14_bid_after_expiry_rejected(self):
        self.client.post('/api/auth/login', json={"phone": "9823456789", "password": "dist12345"})

        ended = query_db("SELECT id FROM auctions WHERE status = 'ended' LIMIT 1", one=True)
        if not ended:
            execute_db("INSERT INTO auctions (lot_code, fpo_id, product_name, category, quantity, unit, starting_price, min_increment, current_highest_bid, start_time, end_time, status) VALUES ('TRD-EXP-999', 1, 'Expired Wheat', 'grains', 100, 'kg', 20, 1, 25, datetime('now', '-2 days'), datetime('now', '-1 day'), 'ended')")
            ended = query_db("SELECT id FROM auctions WHERE status = 'ended' LIMIT 1", one=True)

        auction_id = ended['id']
        res = self.client.post(f'/api/auctions/{auction_id}/bids', json={"bid_amount": 100.0})
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertFalse(data['success'])
        self.assertTrue("ended" in data['message'].lower() or "closed" in data['message'].lower())
        print("[PASS] Test 14: Bid on expired/ended auction rejected.")

    def test_15_auction_finalization(self):
        from services.auction_service import finalize_auction
        success, res = finalize_auction(1)
        self.assertTrue(success)
        self.assertIn('winner_id', res)
        self.assertIsNotNone(res['winner_id'])

        order = query_db("SELECT * FROM orders WHERE auction_id = 1", one=True)
        self.assertIsNotNone(order)
        self.assertEqual(order['status'], 'confirmed')
        print(f"[PASS] Test 15: Auction finalized with Order #{order['order_code']}.")

    def test_16_role_based_protection(self):
        self.client.get('/api/auth/logout')
        res = self.client.get('/api/auth/me')
        self.assertFalse(res.get_json()['authenticated'])
        print("[PASS] Test 16: Protected endpoints require authentication.")

    def test_17_logout_and_errors(self):
        self.client.post('/api/auth/login', json={"phone": "9876543210", "password": "farmer123"})
        res = self.client.post('/api/auth/logout')
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.get_json()['success'])

        not_found_res = self.client.get('/api/invalid-endpoint-test')
        self.assertEqual(not_found_res.status_code, 404)
        self.assertFalse(not_found_res.get_json()['success'])
        print("[PASS] Test 17: Logout and 404 error handler verified.")

    def test_18_delivery_route_and_telemetry(self):
        self.client.post('/api/auth/login', json={"phone": "9834567890", "password": "delivery123"})

        res = self.client.get('/api/delivery/route')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertIn('corridor', data)
        self.assertIn('waypoints', data)
        self.assertIn('corridor_path', data)
        self.assertGreaterEqual(len(data['waypoints']), 3)
        self.assertGreaterEqual(len(data['corridor_path']), 5)
        self.assertEqual(data['waypoints'][0]['city'], 'Jalandhar')
        self.assertEqual(data['waypoints'][1]['city'], 'Nakodar')
        self.assertEqual(data['waypoints'][2]['city'], 'Phagwara')

        loc_res = self.client.post('/api/delivery/location', json={
            "lat": 31.1550,
            "lng": 75.4850,
            "speed": 45.5,
            "heading": "South"
        })
        self.assertEqual(loc_res.status_code, 200)
        loc_data = loc_res.get_json()
        self.assertTrue(loc_data['success'])
        self.assertEqual(loc_data['data']['lat'], 31.1550)
        self.assertEqual(loc_data['data']['lng'], 75.4850)

        verify_res = self.client.get('/api/delivery/route')
        v_data = verify_res.get_json()
        self.assertEqual(v_data['vehicle']['telemetry']['lat'], 31.1550)
        self.assertEqual(v_data['vehicle']['telemetry']['lng'], 75.4850)
        print("[PASS] Test 18: Delivery route corridor and live GPS telemetry verified.")

if __name__ == '__main__':
    unittest.main(verbosity=2)
