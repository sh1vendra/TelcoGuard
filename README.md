# TelcoGuard

TelcoGuard is a full-stack telecom number management and fraud detection platform. It gives telecom operators a central dashboard to provision phone numbers, manage porting requests, and automatically detect fraudulent porting activity in real time.

## Architecture

```
Frontend (React + Vite)  ──HTTP──>  Backend (Express REST API)  ──>  MongoDB Atlas
   localhost:5173                        localhost:8000                  Cloud
```

The backend exposes a REST API under `/api`. The frontend communicates directly with the backend (CORS-enabled) or via the Vite dev proxy. JWT tokens are stored in `localStorage` and attached to every request via an Axios interceptor.

## Tech Stack

**Backend**
- Node.js / Express
- MongoDB + Mongoose
- JSON Web Tokens (jsonwebtoken)
- Joi validation
- Swagger UI (`/api-docs`)

**Frontend**
- React 18 + Vite
- Tailwind CSS v4
- Recharts
- Axios
- React Router v6
- react-hot-toast

## Local Setup

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB)

### 1. Clone

```bash
git clone <repo-url>
cd TelcoGuard
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=your_secret_here
JWT_EXPIRE=7d
PORT=8000
```

### 3. Frontend

```bash
cd frontend
npm install
```

Optionally create `frontend/.env` (not required for local dev):

```env
VITE_API_URL=http://localhost:8000/api
```

### 4. Seed the database

```bash
cd backend
node seed.js
```

### 5. Run

In two separate terminals:

```bash
# terminal 1
cd backend && npm start

# terminal 2
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Default Credentials

| Role     | Email                       | Password      |
|----------|-----------------------------|---------------|
| Admin    | admin@telcoguard.com        | admin1234     |
| Operator | operator@telcoguard.com     | operator1234  |

## API Documentation

Swagger UI is available at [http://localhost:8000/api-docs](http://localhost:8000/api-docs) when the backend is running.

## Screenshots

_Screenshots will be added here._
