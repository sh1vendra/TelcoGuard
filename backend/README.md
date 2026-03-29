# TelcoGuard

Telecom number management and fraud detection REST API built with Node.js, Express, and MongoDB.

## Setup

```bash
npm install
cp .env.example .env
# fill in .env values
npm start
```

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRE` | JWT expiration (e.g. `30d`) |

## Seed Data

```bash
node seed.js
```

Populates the database with 2 users, 50 phone numbers, 10 porting requests, 3 fraud alerts, and 20 audit entries.

Seed credentials:
- Admin: `admin@telcoguard.com` / `admin1234`
- Operator: `operator@telcoguard.com` / `operator1234`

## API Overview

| Prefix | Description |
|---|---|
| `POST /api/auth/register` | Register a new user |
| `POST /api/auth/login` | Login, returns JWT |
| `GET /api/auth/me` | Get current user |
| `GET /api/phones` | List phone numbers |
| `POST /api/phones` | Create phone number (admin) |
| `PATCH /api/phones/:id/status` | Change status |
| `GET /api/porting` | List porting requests |
| `POST /api/porting` | Create porting request (triggers fraud detection) |
| `PATCH /api/porting/:id/approve` | Approve (admin) |
| `PATCH /api/porting/:id/reject` | Reject (admin) |
| `GET /api/fraud` | List fraud alerts |
| `PATCH /api/fraud/:id/resolve` | Resolve alert (admin) |
| `GET /api/audit` | List audit logs |
| `GET /api/health` | Health check |

## Swagger UI

Available at `http://localhost:5000/api-docs` when the server is running.

## Fraud Detection

When a porting request is created, the system automatically checks for:

1. **Rapid port** — same number ported within 30 days → HIGH severity
2. **Multiple requests** — 3+ pending from same carrier in 7 days → MEDIUM severity
3. **Known fraud area codes** — `900, 976, 242, 809, 284, 649` → MEDIUM severity

If any check triggers, the request is flagged and a `FraudAlert` is created.
