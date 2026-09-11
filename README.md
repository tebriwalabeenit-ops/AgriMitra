# KrishiLink (AgriMitra) — Backend & Agricultural Intelligence Platform
**Smart India Hackathon (SIH) Practical Implementation**

KrishiLink is an end-to-end, transparent agricultural supply chain, live electronic bidding, and farm-to-mandi logistics coordination platform. It unifies four key agricultural stakeholders:
1. **Farmers**: Fair price discovery, produce listing, and transport requirement logging.
2. **FPOs (Farmer Producer Organizations)**: Harvest aggregation, auction setup, and live session monitoring.
3. **Distributors / Wholesalers**: Real-time electronic bidding console, transparent price discovery, and binding purchase settlement.
4. **Delivery Agents**: Immediate rural pickup alerts, atomic delivery claims (race-condition free), and milestone tracking.

---

## 1. Technology Architecture

Built with a clean, lightweight, and explainable tech stack designed for reliability and zero bloat:

- **Backend Framework**: Python 3.10+ / Flask
- **Database Engine**: MySQL 8.0 (Relational schema with foreign keys, indexes, and transactional row locking)
- **Database Driver**: `PyMySQL` (Pure-Python MySQL client — zero C-extension compile issues on Windows)
- **Real-Time Communication**: Server-Sent Events (SSE) with an in-memory thread-safe pub/sub queue engine
- **Authentication**: Role-based sessions with industry-standard bcrypt-compatible password hashing (`werkzeug.security`)
- **Zero Heavy Frameworks**: No Node.js, Express, Django, FastAPI, Celery, Redis, MongoDB, or Firebase required.

```
┌─────────────────────────────────────────────────────────────────┐
│                     KrishiLink Client Browser                   │
│   (index.html, wholesaler-trading.html, fpo-bidding-status.html)│
└────────────────┬────────────────────────────────▲───────────────┘
                 │ REST API (JSON)                │ SSE (Real-time Stream)
                 ▼                                │
┌─────────────────────────────────────────────────┴───────────────┐
│                     Flask Application (app.py)                  │
│  ├── routes/auth.py          (Sessions & Role Validation)       │
│  ├── routes/farmer.py        (Produce & Delivery Demands)       │
│  ├── routes/fpo.py           (Auction Management)               │
│  ├── routes/auction.py       (Live Bidding & SSE Streaming)     │
│  ├── routes/delivery.py      (Logistics & Status Updates)       │
│  └── services/broadcaster.py (Thread-safe In-Memory Pub/Sub)    │
└────────────────────────────────┬────────────────────────────────┘
                                 │ PyMySQL Connection Pool
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                 MySQL Relational Database (krishilink)          │
│  - users, farmers, fpos, distributors, delivery_agents          │
│  - produce, farmer_requirements, auctions, bids, orders         │
│  - Row-Level Locking (SELECT ... FOR UPDATE) for Live Bidding   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Key Engineering Innovations for SIH Presentation

### A. Concurrency-Safe Live Bidding (`SELECT ... FOR UPDATE`)
In live agricultural auctions, hundreds of wholesalers may place bids at the exact millisecond. Naive implementations suffer from race conditions where two lower bids overwrite a higher bid.
KrishiLink handles this at the database transaction layer:
```sql
SELECT id, starting_price, current_highest_bid, min_increment, status, end_time 
FROM auctions WHERE id = %s FOR UPDATE;
```
1. MySQL locks the auction row for the duration of the transaction.
2. The backend validates:
   - Is auction status `active`?
   - Has the auction `end_time` passed?
   - Is `bid_amount >= current_highest_bid + min_increment`?
3. If valid, the new bid is inserted into `bids`, `current_highest_bid` is updated atomically, and the transaction is committed.
4. The new leading bid is pushed to the SSE broadcaster.

### B. Lightweight Real-Time Streaming via Server-Sent Events (SSE)
Instead of complex WebSockets with external Redis dependencies:
- Web browsers connect via native `new EventSource('/api/auctions/<id>/stream')`.
- Flask keeps the stream open (`text/event-stream`).
- When a bid passes validation, `broadcaster.publish(auction_id, event_data)` broadcasts the update to all connected FPOs and distributors in under 15 milliseconds.

### C. Double-Claim Prevention for Logistics Agents
When a farmer logs a requirement (e.g. *Harpreet Singh - 354 kg Tomatoes*):
- Multiple delivery drivers view available jobs simultaneously.
- When an agent clicks "Select Delivery", the backend runs:
  ```sql
  SELECT id, status FROM farmer_requirements WHERE id = %s FOR UPDATE;
  ```
- If `status != 'pending'`, the transaction rolls back with HTTP 409 Conflict, preventing double-assignment or disputes.

---

## 3. Database Schema Overview

The database contains 11 normalized tables defined in `database/schema.sql`:

| Table | Purpose |
|---|---|
| `users` | Master accounts with hashed credentials and roles (`farmer`, `fpo`, `distributor`, `delivery_agent`) |
| `farmers` | Kisan ID, farm location, verified land records |
| `fpos` | FPO registration number, board details, district cluster |
| `distributors` | Mandi trading license, GSTIN, warehouse address |
| `delivery_agents`| Vehicle type, registration number, driving license, availability |
| `produce` | Farmer crops with variety, harvest date, expected price |
| `farmer_requirements`| Transport demand (e.g., 354kg Tomatoes, Jalandhar to Nakodar) |
| `auctions` | Live bidding lots with starting price, increment, countdown timer |
| `bids` | Immutable audit log of every placed bid with timestamp |
| `orders` | Confirmed binding sale contracts generated upon auction conclusion |
| `notifications` | Role-specific alerts for bids, assignments, and payments |

---

## 4. Quick Start & Setup Guide

### Step 1: Install Python Dependencies
Ensure Python 3.10+ is installed:
```bash
pip install -r requirements.txt
```

### Step 2: Database Configuration
Copy `.env.example` to `.env`:
```ini
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password_here
MYSQL_DATABASE=krishilink
SECRET_KEY=krishilink_sih_secure_secret_key_2026
```
*(Note: If MySQL is not running yet during development, the system automatically falls back to an embedded test database so you can test features immediately.)*

### Step 3: Initialize Database & Seed Demo Data
Run the seeding script to create all tables and populate realistic demonstration data:
```bash
python database/seed.py
```

### Step 4: Run the Flask Application
```bash
python app.py
```
Open your browser at:
**`http://127.0.0.1:5000`**

---

## 5. Automated Verification Test Suite

A complete test suite covering all 17 critical SIH workflow scenarios is provided in `test_backend.py`:

```bash
python test_backend.py
```

**Test Coverage (17/17 Passing):**
1. Farmer registration with validated phone and password hashing.
2. Farmer authentication, session persistence, and role verification.
3. Farmer produce listing creation.
4. Farmer delivery requirement creation (Tomatoes 354 kg).
5. Delivery agent fetching open requirements.
6. Delivery agent claiming a requirement.
7. Concurrency check: Second delivery agent blocked from double-accepting.
8. FPO live bidding auction creation.
9. Distributor viewing auctions and detailed lot specifications.
10. Distributor placing a valid bid.
11. Second distributor outbidding the leader.
12. Server-Sent Events real-time broadcast delivery verification.
13. Invalid low bid rejection (below current + increment).
14. Bid rejection on expired or finalized auctions.
15. Auction finalization with automatic binding order generation.
16. Role-based route protection and 401 unauthenticated enforcement.
17. User logout and 404 error handling.

---

## 6. Demo Accounts for Presentation

| Role | Phone | Password | Name / Entity | Key Feature to Demo |
|---|---|---|---|---|
| **Farmer** | `9876543210` | `farmer123` | Ramesh Patel | Add Produce, Request Transport |
| **FPO** | `9812345678` | `fpo123` | Punjab Farmers FPO | Create Auction, Monitor Live Stream |
| **Distributor 1** | `9823456789` | `distributor123` | AgroWholesale Ltd | Live Bidding Console (₹33.00/kg) |
| **Distributor 2** | `9899887766` | `distributor123` | Bharat Mandi Traders | Outbid Competitor (₹34.50/kg) |
| **Delivery Agent**| `9834567890` | `delivery123` | Ramesh Kumar | Claim Tomato 354kg Delivery |

---

## 7. Key API Endpoints Reference

### Authentication
- `POST /api/auth/register` — Register a new farmer, FPO, distributor, or delivery agent.
- `POST /api/auth/login` — Authenticate and start session.
- `POST /api/auth/logout` — Invalidate session.
- `GET /api/auth/me` — Return current authenticated user profile.

### Farmer
- `GET /api/farmer/dashboard` — Farmer stats, produce summary, and bids.
- `GET /api/farmer/produce` & `POST /api/farmer/produce` — List and create produce lots.
- `POST /api/farmer/requirements` — Log delivery requirements (e.g. pickup to FPO).

### FPO & Auctions
- `GET /api/fpo/dashboard` — FPO active auctions, member produce count, order tally.
- `POST /api/fpo/auctions` — Create new live electronic bidding session.
- `POST /api/fpo/auctions/<id>/close` — Manually close auction and declare winning order.

### Bidding & Real-Time Streams
- `GET /api/auctions` — List active auctions with current highest bids.
- `GET /api/auctions/<id>` — Detailed specifications for an auction lot.
- `POST /api/auctions/<id>/bids` — Place concurrency-safe bid (`SELECT ... FOR UPDATE`).
- `GET /api/auctions/<id>/stream` — Real-time Server-Sent Events (SSE) live bid stream.

### Delivery Logistics
- `GET /api/delivery/requirements` — View open pickup jobs available for claim.
- `POST /api/delivery/requirements/<id>/accept` — Atomically claim delivery job.
- `POST /api/delivery/requirements/<id>/status` — Update milestone (`assigned` -> `in_transit` -> `delivered`).

---
Developed for **Smart India Hackathon** &bull; AgriTech &amp; Logistics Innovation.
