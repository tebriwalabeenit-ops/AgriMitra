"""
Database Seeding Script for KrishiLink
Populates MySQL with realistic demonstration data for all 4 roles.
"""

import os
import sys
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash

# Ensure root directory is on Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.db import get_mysql_connection, execute_script
from config import Config

def seed_database():
    print(f"Connecting to MySQL at {Config.MYSQL_HOST}:{Config.MYSQL_PORT}...")
    
    # 1. Read and execute schema.sql
    schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
    with open(schema_path, 'r', encoding='utf-8') as f:
        schema_sql = f.read()
        
    print("Executing schema.sql...")
    execute_script(schema_sql)
    print("Database schema created or verified.")

    conn = get_mysql_connection()
    try:
        with conn.cursor() as cursor:
            # Check if data already seeded
            cursor.execute("SELECT COUNT(*) AS cnt FROM users")
            if cursor.fetchone()['cnt'] > 0:
                print("Database already contains user records. Skipping seed.")
                return

            print("Seeding initial users and role profiles...")
            now = datetime.now()
            
            # 1. Farmer User (Ramesh Patel)
            farmer_pwd = generate_password_hash("farmer123")
            cursor.execute("""
                INSERT INTO users (phone, password_hash, role, full_name, email, state, district)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, ('9876543210', farmer_pwd, 'farmer', 'Ramesh Patel', 'ramesh@krishilink.in', 'Tamil Nadu', 'Krishnagiri'))
            farmer_user_id = cursor.lastrowid
            
            cursor.execute("""
                INSERT INTO farmers (user_id, kisan_id, farm_location, primary_crops)
                VALUES (%s, %s, %s, %s)
            """, (farmer_user_id, 'FM-98421', 'Krishnagiri, Tamil Nadu', 'Paddy, Tomatoes, Moringa'))
            farmer_id = cursor.lastrowid

            # Farmer produce
            cursor.execute("""
                INSERT INTO produce (farmer_id, crop_name, variety, quantity, unit, expected_price, location, status)
                VALUES 
                (%s, 'Sona Masoori Paddy (Grade A)', 'Grade A', 120.0, 'Quintals', 2650.0, 'Krishnagiri Warehouse', 'active'),
                (%s, 'Fresh Hybrid Tomatoes', 'Hybrid 1024', 50.0, 'Crates', 680.0, 'Farm Gate Pick-up', 'active'),
                (%s, 'Export Drumsticks (Moringa)', 'Fresh Harvest', 20.0, 'Quintals', 3400.0, 'Krishnagiri', 'active')
            """, (farmer_id, farmer_id, farmer_id))

            # Farmer delivery requirements
            cursor.execute("""
                INSERT INTO farmer_requirements 
                (req_code, farmer_id, crop_name, quantity, unit, pickup_location, destination_location, pickup_window, notes, compensation, trip_distance_km, status)
                VALUES 
                ('FM-24081', %s, 'Tomatoes', 354.0, 'kg', 'Jalandhar Farmer Collection Point', 'FreshKart FPO, Nakodar', '10:30 AM – 11:30 AM', 'Please handle the tomato crates carefully.', 520.0, 18.6, 'pending'),
                ('FM-24082', %s, 'Potatoes', 500.0, 'kg', 'Kartarpur Farm Cluster', 'Punjab Agro Wholesale, Phagwara', '12:00 PM – 1:00 PM', 'Dry storage required.', 680.0, 26.4, 'pending')
            """, (farmer_id, farmer_id))

            # 2. FPO User (Nashik Farmers Collective)
            fpo_pwd = generate_password_hash("fpo12345")
            cursor.execute("""
                INSERT INTO users (phone, password_hash, role, full_name, email, state, district)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, ('9812345678', fpo_pwd, 'fpo', 'Nashik Farmers Collective', 'nashik.fpo@krishilink.in', 'Maharashtra', 'Nashik'))
            fpo_user_id = cursor.lastrowid

            cursor.execute("""
                INSERT INTO fpos (user_id, fpo_code, fpo_name, reg_number, warehouse_location)
                VALUES (%s, %s, %s, %s, %s)
            """, (fpo_user_id, 'MH-NSK-401', 'Nashik Farmers Collective', 'FPO #MH-NSK-401', 'Nashik District, Maharashtra'))
            fpo_id = cursor.lastrowid

            # 3. Distributor User (Kisan Mandi Traders)
            dist_pwd = generate_password_hash("dist12345")
            cursor.execute("""
                INSERT INTO users (phone, password_hash, role, full_name, email, state, district)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, ('9823456789', dist_pwd, 'distributor', 'Kisan Mandi Traders Pvt Ltd', 'info@kisanmandi.com', 'Delhi', 'North Delhi'))
            dist_user_id = cursor.lastrowid

            cursor.execute("""
                INSERT INTO distributors (user_id, distributor_code, business_name, business_type, city, storage_capacity)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (dist_user_id, 'WS-DEL-218', 'Kisan Mandi Traders Pvt Ltd', 'Wholesaler', 'Delhi', '100 tonnes'))
            dist_id = cursor.lastrowid

            # Second distributor for testing multi-bids
            dist2_pwd = generate_password_hash("dist12345")
            cursor.execute("""
                INSERT INTO users (phone, password_hash, role, full_name, email, state, district)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, ('9823456790', dist2_pwd, 'distributor', 'AgroFresh Wholesale Distributors', 'contact@agrofresh.in', 'Maharashtra', 'Pune'))
            dist2_user_id = cursor.lastrowid

            cursor.execute("""
                INSERT INTO distributors (user_id, distributor_code, business_name, business_type, city, storage_capacity)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (dist2_user_id, 'WS-PUN-356', 'AgroFresh Wholesale Distributors', 'Distributor', 'Pune', '50 tonnes'))
            dist2_id = cursor.lastrowid

            # 4. Delivery Agent (Ramesh Kumar)
            deliv_pwd = generate_password_hash("delivery123")
            cursor.execute("""
                INSERT INTO users (phone, password_hash, role, full_name, email, state, district)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, ('9834567890', deliv_pwd, 'delivery_agent', 'Ramesh Kumar', 'ramesh.delivery@krishilink.in', 'Punjab', 'Jalandhar'))
            deliv_user_id = cursor.lastrowid

            cursor.execute("""
                INSERT INTO delivery_agents (user_id, agent_code, vehicle_type, vehicle_number, status)
                VALUES (%s, %s, %s, %s, %s)
            """, (deliv_user_id, 'AM-DA-1047', 'Tata Ace', 'PB-08-AX-4821', 'available'))
            deliv_id = cursor.lastrowid

            # 5. Buyer Demo User (Priyansh Sharma - Retail & Bulk Buyer)
            buyer_pwd = generate_password_hash("buyer123")
            cursor.execute("""
                INSERT INTO users (phone, password_hash, role, full_name, email, state, district)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, ('9811122233', buyer_pwd, 'distributor', 'Priyansh Sharma (Retail Chains Buyer)', 'priyansh.buyer@krishilink.in', 'Delhi', 'South Delhi'))
            buyer_user_id = cursor.lastrowid

            cursor.execute("""
                INSERT INTO distributors (user_id, distributor_code, business_name, business_type, city, storage_capacity)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (buyer_user_id, 'BY-DEL-880', 'Metro Fresh Retail & Bulk Buyers', 'Institutional Buyer', 'Delhi', '75 tonnes'))
            buyer_id = cursor.lastrowid

            # 5. Live Auctions
            # Auction 1: Premium Wheat (Active Live Bidding with existing bids)
            start_t1 = now - timedelta(minutes=30)
            end_t1 = now + timedelta(minutes=45)
            cursor.execute("""
                INSERT INTO auctions 
                (lot_code, fpo_id, product_name, category, description, quality_grade, quality_specs, quantity, unit, starting_price, min_increment, current_highest_bid, current_highest_bidder_id, start_time, end_time, status, image_url, hub_location)
                VALUES 
                ('TRD-WHT-901', %s, 'Premium Wheat', 'grains', 'High-grade MP Sharbati wheat aggregated from member farmers. Machine cleaned, uniform bold grain.', 'A', 'Moisture 9.8%, Foreign Matter < 0.2%', 5000.0, 'kg', 28.0, 0.50, 32.50, %s, %s, %s, 'active', 'assets/produce/wheat.jpg', 'Ludhiana Mandi Hub')
            """, (fpo_id, dist_id, start_t1, end_t1))
            auction1_id = cursor.lastrowid

            # Initial bids for Auction 1
            cursor.execute("""
                INSERT INTO bids (auction_id, distributor_id, bidder_tag, bid_amount, bid_time)
                VALUES 
                (%s, %s, 'Bidder #218', 28.50, %s),
                (%s, %s, 'Bidder #412', 29.00, %s),
                (%s, %s, 'Bidder #104', 30.00, %s),
                (%s, %s, 'Bidder #356', 31.50, %s),
                (%s, %s, 'Bidder #218', 32.50, %s)
            """, (
                auction1_id, dist_id, now - timedelta(minutes=25),
                auction1_id, dist2_id, now - timedelta(minutes=20),
                auction1_id, dist_id, now - timedelta(minutes=15),
                auction1_id, dist2_id, now - timedelta(minutes=10),
                auction1_id, dist_id, now - timedelta(minutes=5)
            ))

            # Auction 2: Fresh Potatoes (Active)
            cursor.execute("""
                INSERT INTO auctions 
                (lot_code, fpo_id, product_name, category, description, quality_grade, quantity, unit, starting_price, min_increment, current_highest_bid, current_highest_bidder_id, start_time, end_time, status, image_url, hub_location)
                VALUES 
                ('TRD-POT-404', %s, 'Fresh Potatoes', 'vegetables', 'Clean graded potatoes ready for cold storage or direct retail.', 'A', 3200.0, 'kg', 20.0, 0.50, 24.0, %s, %s, %s, 'active', 'assets/produce/potato.jpg', 'Jalandhar Cold Store')
            """, (fpo_id, dist2_id, now - timedelta(minutes=20), now + timedelta(minutes=40)))

            # Auction 3: Basmati Rice (Active)
            cursor.execute("""
                INSERT INTO auctions 
                (lot_code, fpo_id, product_name, category, description, quality_grade, quantity, unit, starting_price, min_increment, current_highest_bid, current_highest_bidder_id, start_time, end_time, status, image_url, hub_location)
                VALUES 
                ('TRD-RIC-552', %s, 'Basmati Rice', 'grains', '1121 Steam Basmati Rice with aromatic profile.', 'A', 4500.0, 'kg', 60.0, 0.50, 68.50, %s, %s, %s, 'active', 'assets/produce/rice.jpg', 'Karnal Mandi Hub')
            """, (fpo_id, dist_id, now - timedelta(minutes=15), now + timedelta(minutes=50)))

            # Auction 4: Fresh Onions (Upcoming)
            cursor.execute("""
                INSERT INTO auctions 
                (lot_code, fpo_id, product_name, category, description, quality_grade, quantity, unit, starting_price, min_increment, current_highest_bid, start_time, end_time, status, image_url, hub_location)
                VALUES 
                ('TRD-ONN-301', %s, 'Fresh Onions', 'vegetables', 'Garva red onions stored in ventilated crates.', 'A', 3000.0, 'kg', 22.0, 0.50, 22.0, %s, %s, 'upcoming', 'assets/produce/onion.jpg', 'Lasalgaon Mandi Yard')
            """, (fpo_id, now + timedelta(hours=2), now + timedelta(hours=5)))

            # Auction 5: Completed Wheat
            cursor.execute("""
                INSERT INTO auctions 
                (lot_code, fpo_id, product_name, category, description, quality_grade, quantity, unit, starting_price, min_increment, current_highest_bid, current_highest_bidder_id, start_time, end_time, status, winner_id, image_url, hub_location)
                VALUES 
                ('TRD-WHT-820', %s, 'Premium Wheat', 'grains', 'Concluded lot.', 'A', 5000.0, 'kg', 28.0, 0.50, 35.0, %s, %s, %s, 'ended', %s, 'assets/produce/wheat.jpg', 'Closed Session')
            """, (fpo_id, dist_id, now - timedelta(days=2), now - timedelta(days=1), dist_id))

            conn.commit()
            print("Successfully seeded users, profiles, produce, delivery requirements, auctions, and bids!")

    except Exception as e:
        conn.rollback()
        print(f"Error during seeding: {e}")
        raise
    finally:
        conn.close()

if __name__ == '__main__':
    seed_database()
