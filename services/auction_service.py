"""
KrishiLink Auction Service
Handles live bidding with MySQL row-level locking (SELECT ... FOR UPDATE),
bid validation, transaction commit/rollback, and SSE event broadcasting.
"""

from datetime import datetime
from database.db import get_mysql_connection, query_db
from services.broadcaster import broadcaster

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

def place_bid(auction_id, distributor_id, bid_amount):
    """
    Executes a bid placement with database transaction and row-level locking.
    Prevents race conditions between simultaneous bidders.
    """
    conn = get_mysql_connection()
    try:
        with conn.cursor() as cursor:
            # 1. Lock the auction row so simultaneous bids cannot overwrite each other
            cursor.execute("""
                SELECT id, lot_code, product_name, starting_price, min_increment,
                       current_highest_bid, current_highest_bidder_id, start_time,
                       end_time, status, fpo_id
                FROM auctions
                WHERE id = %s FOR UPDATE
            """, (auction_id,))
            auction = cursor.fetchone()

            if not auction:
                conn.rollback()
                return False, "Auction session not found."

            # 2. Check auction status
            if auction['status'] != 'active':
                conn.rollback()
                return False, f"Auction is currently {auction['status']}. Bids can only be placed on active sessions."

            # 3. Check auction timeframe
            now = datetime.now()
            start_time = to_datetime(auction['start_time'])
            end_time = to_datetime(auction['end_time'])
            if now < start_time:
                conn.rollback()
                return False, "Auction has not started yet."

            if now > end_time:
                # Automatically mark as ended if time has elapsed
                cursor.execute("UPDATE auctions SET status = 'ended' WHERE id = %s", (auction_id,))
                conn.commit()
                return False, "Auction countdown has reached zero. Bidding is closed."

            # 4. Validate bid amount against starting price and minimum increment
            try:
                bid_val = round(float(bid_amount), 2)
            except (ValueError, TypeError):
                conn.rollback()
                return False, "Invalid bid amount format."

            current_highest = float(auction['current_highest_bid'])
            min_inc = float(auction['min_increment'])
            starting_price = float(auction['starting_price'])

            if auction['current_highest_bidder_id'] is None:
                # First bid of the auction
                if bid_val < starting_price:
                    conn.rollback()
                    return False, f"Initial bid must be at least the starting floor price of ₹{starting_price:.2f}/kg."
            else:
                # Subsequent bid
                min_required = round(current_highest + min_inc, 2)
                if bid_val < min_required:
                    conn.rollback()
                    return False, f"Your bid of ₹{bid_val:.2f} is too low. Minimum required bid is ₹{min_required:.2f}/kg (Current highest: ₹{current_highest:.2f} + Min increment: ₹{min_inc:.2f})."

            # 5. Determine anonymous bidder tag for display
            cursor.execute("SELECT id, distributor_code, business_name FROM distributors WHERE id = %s", (distributor_id,))
            dist = cursor.fetchone()
            if not dist:
                conn.rollback()
                return False, "Distributor profile not found."

            dist_code = dist.get('distributor_code', '')
            code_suffix = dist_code.split('-')[-1] if '-' in dist_code else str(distributor_id)
            bidder_tag = f"Bidder #{code_suffix}"

            # 6. Insert new bid into bids table
            cursor.execute("""
                INSERT INTO bids (auction_id, distributor_id, bidder_tag, bid_amount, bid_time)
                VALUES (%s, %s, %s, %s, %s)
            """, (auction_id, distributor_id, bidder_tag, bid_val, now))
            bid_id = cursor.lastrowid

            # 7. Update auction row with new highest bid & leading bidder
            cursor.execute("""
                UPDATE auctions
                SET current_highest_bid = %s,
                    current_highest_bidder_id = %s,
                    updated_at = %s
                WHERE id = %s
            """, (bid_val, distributor_id, now, auction_id))

            # 8. Outbid notification for previous leading bidder
            prev_bidder_id = auction['current_highest_bidder_id']
            if prev_bidder_id and prev_bidder_id != distributor_id:
                cursor.execute("SELECT user_id FROM distributors WHERE id = %s", (prev_bidder_id,))
                prev_user = cursor.fetchone()
                if prev_user:
                    cursor.execute("""
                        INSERT INTO notifications (user_id, title, message, type)
                        VALUES (%s, 'Outbid Alert', %s, 'outbid')
                    """, (prev_user['user_id'], f"You have been outbid on {auction['product_name']} (Lot #{auction['lot_code']}). New highest bid: ₹{bid_val:.2f}/kg."))

            # 9. Commit transaction in MySQL
            conn.commit()

            # 10. Fetch updated recent bids feed for real-time broadcast
            cursor.execute("""
                SELECT id, bidder_tag, bid_amount, DATE_FORMAT(bid_time, '%%h:%%i %%p') AS formatted_time
                FROM bids 
                WHERE auction_id = %s 
                ORDER BY bid_amount DESC, id DESC 
                LIMIT 8
            """, (auction_id,))
            recent_bids = cursor.fetchall()
            for b in recent_bids:
                b['bid_amount'] = float(b['bid_amount'])

            cursor.execute("SELECT COUNT(DISTINCT distributor_id) AS total_bidders, COUNT(*) AS total_bids FROM bids WHERE auction_id = %s", (auction_id,))
            stats = cursor.fetchone()

            # Calculate remaining seconds
            time_left = max(0, int((end_time - now).total_seconds()))

            event_payload = {
                "type": "new_bid",
                "auction_id": auction_id,
                "lot_code": auction['lot_code'],
                "highest_bid": bid_val,
                "highest_bidder_tag": bidder_tag,
                "highest_bidder_id": distributor_id,
                "time_remaining_seconds": time_left,
                "total_bidders": stats['total_bidders'] if stats else 1,
                "total_bids": stats['total_bids'] if stats else 1,
                "recent_bids": recent_bids,
                "timestamp": now.strftime('%I:%M %p')
            }

            # 11. Broadcast to all active clients viewing this auction
            broadcaster.broadcast_bid(auction_id, event_payload)

            return True, {
                "message": f"Bid of ₹{bid_val:.2f}/kg placed successfully!",
                "bid_id": bid_id,
                "current_highest_bid": bid_val,
                "bidder_tag": bidder_tag
            }

    except Exception as e:
        conn.rollback()
        return False, f"Database transaction error: {str(e)}"
    finally:
        conn.close()

def finalize_auction(auction_id):
    """
    Finalizes an auction session: determines the winning bid and creates an order.
    """
    conn = get_mysql_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT id, lot_code, product_name, quantity, unit, current_highest_bid,
                       current_highest_bidder_id, fpo_id, status, end_time
                FROM auctions
                WHERE id = %s FOR UPDATE
            """, (auction_id,))
            auction = cursor.fetchone()

            if not auction:
                conn.rollback()
                return False, "Auction not found."

            if auction['status'] == 'ended' and auction.get('winner_id'):
                conn.rollback()
                return True, "Auction is already concluded."

            winner_id = auction['current_highest_bidder_id']
            if not winner_id:
                # No bids placed, mark ended with no winner
                cursor.execute("UPDATE auctions SET status = 'ended' WHERE id = %s", (auction_id,))
                conn.commit()
                return True, "Auction ended with no bids placed."

            # Calculate total amount
            qty = float(auction['quantity'])
            rate = float(auction['current_highest_bid'])
            total_amt = round(qty * rate, 2)
            order_code = f"ORD-{auction['lot_code']}"

            # Update auction with winner
            cursor.execute("""
                UPDATE auctions
                SET status = 'ended',
                    winner_id = %s
                WHERE id = %s
            """, (winner_id, auction_id))

            # Create or update order record
            cursor.execute("SELECT id, order_code FROM orders WHERE auction_id = %s", (auction_id,))
            existing_order = cursor.fetchone()
            if existing_order:
                order_code = existing_order['order_code']
                cursor.execute("""
                    UPDATE orders
                    SET distributor_id = %s, price_per_unit = %s, total_amount = %s, status = 'confirmed'
                    WHERE id = %s
                """, (winner_id, rate, total_amt, existing_order['id']))
            else:
                order_code = f"ORD-{auction['lot_code']}"
                cursor.execute("""
                    INSERT INTO orders 
                    (order_code, auction_id, distributor_id, fpo_id, product_name, quantity, unit, price_per_unit, total_amount, status, payment_status)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'confirmed', 'escrow_held')
                """, (order_code, auction_id, winner_id, auction['fpo_id'], auction['product_name'], qty, auction['unit'], rate, total_amt))

            # Notify winning distributor
            cursor.execute("SELECT user_id, business_name FROM distributors WHERE id = %s", (winner_id,))
            winner = cursor.fetchone()
            if winner:
                cursor.execute("""
                    INSERT INTO notifications (user_id, title, message, type)
                    VALUES (%s, 'Auction Won!', %s, 'auction_won')
                """, (winner['user_id'], f"Congratulations! You won the auction for {auction['product_name']} (Lot #{auction['lot_code']}) at ₹{rate:.2f}/kg. Total: ₹{total_amt:,.2f}."))

            conn.commit()

            # Broadcast auction closed event
            broadcaster.broadcast_bid(auction_id, {
                "type": "auction_ended",
                "auction_id": auction_id,
                "winner_id": winner_id,
                "winning_rate": rate,
                "order_code": order_code
            })

            return True, {
                "message": "Auction successfully concluded.",
                "winner_id": winner_id,
                "winning_rate": rate,
                "order_code": order_code
            }

    except Exception as e:
        conn.rollback()
        return False, f"Failed to finalize auction: {str(e)}"
    finally:
        conn.close()
