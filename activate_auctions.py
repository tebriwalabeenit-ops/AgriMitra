from database.db import get_db_connection
from datetime import datetime, timedelta

def activate_auctions():
    conn = get_db_connection()
    with conn.cursor() as cur:
        now = datetime.now()
        end_time = now + timedelta(minutes=45)
        cur.execute(
            """UPDATE auctions 
               SET status = 'active', 
                   start_time = %s, 
                   end_time = %s 
               WHERE lot_code IN ('TRD-WHT-901', 'TRD-POT-404', 'TRD-RIC-552')""",
            (now.strftime('%Y-%m-%d %H:%M:%S'), end_time.strftime('%Y-%m-%d %H:%M:%S'))
        )
        conn.commit()
    print("Successfully activated TRD-WHT-901, TRD-POT-404, TRD-RIC-552 with 45m remaining.")

if __name__ == "__main__":
    activate_auctions()
