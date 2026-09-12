import os
import sys
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.db import get_db_connection
from config import Config

def seed_database(force=False):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:

            cursor.execute("SELECT COUNT(*) AS cnt FROM users")
            row = cursor.fetchone()
            if row and row['cnt'] > 0 and not force:
                print(f"Database already contains {row['cnt']} user records. Preserving permanent data.")
                return

            print("Seeding verified demo accounts and initial marketplace data...")
            now = datetime.now()

            farmer_pwd = generate_password_hash("farmer123")
            cursor.execute("""
                INSERT INTO users (phone, password_hash, role, full_name, email, state, district, preferred_language)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, ('9876543210', farmer_pwd, 'farmer', 'Ramesh Patel', 'ramesh@agrimitra.in', 'Tamil Nadu', 'Krishnagiri', 'en'))
            farmer_user_id = cursor.lastrowid

            cursor.execute("""
                INSERT INTO farmers (user_id, kisan_id, farm_location, primary_crops)
                VALUES (%s, %s, %s, %s)
            """, (farmer_user_id, 'FM-98421', 'Krishnagiri, Tamil Nadu', 'Paddy, Tomatoes, Moringa'))
            farmer_id = cursor.lastrowid

            cursor.execute("""
                INSERT INTO produce (farmer_id, crop_name, variety, quantity, unit, expected_price, location, status)
                VALUES
                (%s, 'Sona Masoori Paddy (Grade A)', 'Grade A', 120.0, 'Quintals', 2650.0, 'Krishnagiri Warehouse', 'active'),
                (%s, 'Fresh Hybrid Tomatoes', 'Hybrid 1024', 50.0, 'Crates', 680.0, 'Farm Gate Pick-up', 'active'),
                (%s, 'Export Drumsticks (Moringa)', 'Fresh Harvest', 20.0, 'Quintals', 3400.0, 'Krishnagiri', 'active'),
                (%s, 'Desi Farm Potatoes', 'Kufri Jyoti', 80.0, 'Quintals', 1800.0, 'Farm Cold Storage', 'active')
            """, (farmer_id, farmer_id, farmer_id, farmer_id))

            cursor.execute("""
                INSERT INTO farmer_requirements
                (req_code, farmer_id, crop_name, quantity, unit, pickup_location, destination_location, pickup_window, notes, compensation, trip_distance_km, status)
                VALUES
                ('FM-24081', %s, 'Tomatoes', 354.0, 'kg', 'Jalandhar Farmer Collection Point', 'FreshKart FPO, Nakodar', '10:30 AM – 11:30 AM', 'Please handle the tomato crates carefully.', 520.0, 18.6, 'pending'),
                ('FM-24082', %s, 'Potatoes', 500.0, 'kg', 'Kartarpur Farm Cluster', 'Punjab Agro Wholesale, Phagwara', '12:00 PM – 1:00 PM', 'Dry storage required.', 680.0, 26.4, 'pending')
            """, (farmer_id, farmer_id))

            fpo_pwd = generate_password_hash("fpo123")
            cursor.execute("""
                INSERT INTO users (phone, password_hash, role, full_name, email, state, district, preferred_language)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, ('9812345678', fpo_pwd, 'fpo', 'Punjab FPO Federation', 'fpo@agrimitra.in', 'Punjab', 'Ludhiana', 'en'))
            fpo_user_id = cursor.lastrowid

            cursor.execute("""
                INSERT INTO fpos (user_id, fpo_code, fpo_name, reg_number, warehouse_location)
                VALUES (%s, %s, %s, %s, %s)
            """, (fpo_user_id, 'PB-LDH-401', 'Punjab FPO Federation', 'FPO #PB-LDH-401', 'Ludhiana District Central Hub, Punjab'))
            fpo_id = cursor.lastrowid

            buyer_pwd = generate_password_hash("buyer123")
            cursor.execute("""
                INSERT INTO users (phone, password_hash, role, full_name, email, state, district, preferred_language)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, ('9811122233', buyer_pwd, 'buyer', 'Priyansh Sharma', 'buyer@agrimitra.in', 'Haryana', 'Gurugram', 'en'))
            buyer_user_id = cursor.lastrowid

            cursor.execute("""
                INSERT INTO buyers (user_id, buyer_code, delivery_address, pincode)
                VALUES (%s, %s, %s, %s)
            """, (buyer_user_id, 'BYR-GGN-108', 'Tower B, Sector 48, Gurugram', '122001'))
            buyer_id = cursor.lastrowid

            wholesaler_pwd = generate_password_hash("distributor123")
            cursor.execute("""
                INSERT INTO users (phone, password_hash, role, full_name, email, state, district, preferred_language)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, ('9823456789', wholesaler_pwd, 'wholesaler', 'Kisan Mandi Traders Pvt Ltd', 'wholesaler@agrimitra.in', 'Delhi', 'North Delhi', 'en'))
            wholesaler_user_id = cursor.lastrowid

            cursor.execute("""
                INSERT INTO wholesalers (user_id, wholesaler_code, business_name, license_no, city)
                VALUES (%s, %s, %s, %s, %s)
            """, (wholesaler_user_id, 'WS-DEL-218', 'Kisan Mandi Traders Pvt Ltd', 'MANDI-DL-9821', 'Delhi'))
            wholesaler_id = cursor.lastrowid

            distributor_pwd = generate_password_hash("distributor123")
            cursor.execute("""
                INSERT INTO users (phone, password_hash, role, full_name, email, state, district, preferred_language)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, ('9845678901', distributor_pwd, 'distributor', 'AgroFresh Regional Distributors', 'distributor@agrimitra.in', 'Maharashtra', 'Pune', 'en'))
            distributor_user_id = cursor.lastrowid

            cursor.execute("""
                INSERT INTO distributors (user_id, distributor_code, business_name, business_type, city, storage_capacity)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (distributor_user_id, 'DST-PUN-356', 'AgroFresh Regional Distributors', 'Regional Wholesaler', 'Pune', '100 Tonnes'))
            distributor_id = cursor.lastrowid

            delivery_pwd = generate_password_hash("delivery123")
            cursor.execute("""
                INSERT INTO users (phone, password_hash, role, full_name, email, state, district, preferred_language)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, ('9834567890', delivery_pwd, 'delivery_agent', 'Ramesh Kumar', 'delivery@agrimitra.in', 'Punjab', 'Jalandhar', 'en'))
            delivery_user_id = cursor.lastrowid

            cursor.execute("""
                INSERT INTO delivery_agents (user_id, agent_code, vehicle_type, vehicle_number, status)
                VALUES (%s, %s, %s, %s, %s)
            """, (delivery_user_id, 'AM-DA-1047', 'Tata Ace (1.5 Ton)', 'PB-08-AX-4821', 'available'))
            delivery_id = cursor.lastrowid

            start_t1 = now - timedelta(minutes=30)
            end_t1 = now + timedelta(minutes=45)
            cursor.execute("""
                INSERT INTO auctions
                (lot_code, fpo_id, product_name, category, description, quality_grade, quality_specs, quantity, unit, starting_price, min_increment, current_highest_bid, current_highest_bidder_id, start_time, end_time, status, image_url, hub_location)
                VALUES
                ('TRD-WHT-901', %s, 'Premium Sharbati Wheat', 'grains', 'High-grade MP Sharbati wheat aggregated from member farmers. Machine cleaned, uniform bold grain.', 'A', 'Moisture 9.8%, Foreign Matter < 0.2%', 5000.0, 'kg', 28.0, 0.50, 32.50, %s, %s, %s, 'active', 'assets/produce/wheat.jpg', 'Ludhiana Mandi Hub')
            """, (fpo_id, wholesaler_id, start_t1, end_t1))
            auction1_id = cursor.lastrowid

            cursor.execute("""
                INSERT INTO bids (auction_id, distributor_id, bidder_tag, bid_amount, bid_time)
                VALUES
                (%s, %s, 'Bidder #218', 28.50, %s),
                (%s, %s, 'Bidder #412', 29.50, %s),
                (%s, %s, 'Bidder #104', 30.50, %s),
                (%s, %s, 'Bidder #356', 31.50, %s),
                (%s, %s, 'Bidder #218', 32.50, %s)
            """, (
                auction1_id, wholesaler_id, now - timedelta(minutes=25),
                auction1_id, distributor_id, now - timedelta(minutes=20),
                auction1_id, wholesaler_id, now - timedelta(minutes=15),
                auction1_id, distributor_id, now - timedelta(minutes=10),
                auction1_id, wholesaler_id, now - timedelta(minutes=5)
            ))

            cursor.execute("""
                INSERT INTO auctions
                (lot_code, fpo_id, product_name, category, description, quality_grade, quantity, unit, starting_price, min_increment, current_highest_bid, current_highest_bidder_id, start_time, end_time, status, image_url, hub_location)
                VALUES
                ('TRD-POT-404', %s, 'Fresh Farm Potatoes', 'vegetables', 'Clean graded potatoes ready for immediate dispatch or cold storage.', 'A', 3200.0, 'kg', 20.0, 0.50, 24.0, %s, %s, %s, 'active', 'assets/produce/potato.jpg', 'Jalandhar Cold Store')
            """, (fpo_id, distributor_id, now - timedelta(minutes=20), now + timedelta(minutes=40)))

            cursor.execute("""
                INSERT INTO auctions
                (lot_code, fpo_id, product_name, category, description, quality_grade, quantity, unit, starting_price, min_increment, current_highest_bid, current_highest_bidder_id, start_time, end_time, status, image_url, hub_location)
                VALUES
                ('TRD-RIC-552', %s, '1121 Steam Basmati Rice', 'grains', 'Aromatic long-grain steamed Basmati Rice.', 'A', 4500.0, 'kg', 60.0, 0.50, 68.50, %s, %s, %s, 'active', 'assets/produce/rice.jpg', 'Karnal Mandi Hub')
            """, (fpo_id, wholesaler_id, now - timedelta(minutes=15), now + timedelta(minutes=50)))

            cursor.execute("""
                INSERT INTO auctions
                (lot_code, fpo_id, product_name, category, description, quality_grade, quantity, unit, starting_price, min_increment, current_highest_bid, start_time, end_time, status, image_url, hub_location)
                VALUES
                ('TRD-ONN-301', %s, 'Nashik Red Onions', 'vegetables', 'Garva red onions stored in ventilated crates.', 'A', 3000.0, 'kg', 22.0, 0.50, 22.0, %s, %s, 'upcoming', 'assets/produce/onion.jpg', 'Lasalgaon Mandi Yard')
            """, (fpo_id, now + timedelta(hours=2), now + timedelta(hours=5)))

            cursor.execute("""
                INSERT INTO auctions
                (lot_code, fpo_id, product_name, category, description, quality_grade, quantity, unit, starting_price, min_increment, current_highest_bid, current_highest_bidder_id, start_time, end_time, status, image_url, hub_location)
                VALUES
                ('TRD-APL-105', %s, 'Kashmiri Royal Apples', 'fruits', 'Grade A delicious crisp apples.', 'A', 2500.0, 'kg', 85.0, 1.0, 95.0, %s, %s, %s, 'ended', 'assets/produce/apple.jpg', 'Srinagar Mandi')
            """, (fpo_id, wholesaler_id, now - timedelta(days=2), now - timedelta(days=1)))

            cursor.execute("""
                INSERT INTO orders (order_code, buyer_id, distributor_id, product_name, quantity, unit, price_per_unit, total_amount, status, payment_status, delivery_address, items_json)
                VALUES
                ('ORD-BYR-1001', %s, NULL, 'Organic Farm Potatoes & Desi Tomatoes', 15.0, 'kg', 35.0, 525.0, 'in_transit', 'paid_escrow', 'Tower B, Sector 48, Gurugram', '[{"name":"Organic Farm Potatoes","qty":10,"price":30},{"name":"Desi Farm Tomatoes","qty":5,"price":45}]'),
                ('ORD-BYR-1002', %s, NULL, 'Ratnagiri Alphonso Mangoes', 6.0, 'kg', 120.0, 720.0, 'delivered', 'settled', 'Tower B, Sector 48, Gurugram', '[{"name":"Ratnagiri Alphonso Mangoes","qty":6,"price":120}]'),
                ('ORD-WS-501', NULL, %s, 'Premium Wheat (Lot #TRD-WHT-820)', 5000.0, 'kg', 32.50, 162500.0, 'confirmed', 'escrow_held', 'North Delhi Mandi Godown #4', '[{"name":"Premium Wheat","qty":5000,"price":32.50}]')
            """, (buyer_id, buyer_id, wholesaler_id))

            cursor.execute("""
                INSERT INTO notifications (user_id, title, message, type, is_read)
                VALUES
                (%s, 'Produce Order Confirmed', 'Your produce lot for Sona Masoori Paddy has been matched with buyer Priyansh Sharma.', 'success', 0),
                (%s, 'Auction Activity Alert', 'Lot #TRD-WHT-901 has received 5 bids. Current highest: ₹32.50/kg.', 'info', 0),
                (%s, 'Fresh Harvest In Transit', 'Your order #ORD-BYR-1001 is on its way with delivery agent Ramesh Kumar.', 'info', 0),
                (%s, 'New Consignment Available', 'New delivery requirement #FM-24081 (Tomatoes 354kg) available for pickup in Jalandhar.', 'alert', 0)
            """, (farmer_user_id, fpo_user_id, buyer_user_id, delivery_user_id))

            conn.commit()
            print("Successfully seeded all 6 roles, produce, live auctions, bids, orders, and notifications in SQLite!")

    except Exception as e:
        conn.rollback()
        print(f"Error during seeding: {e}")
        raise
    finally:
        conn.close()

if __name__ == '__main__':
    seed_database(force=True)
