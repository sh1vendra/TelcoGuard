# Deployment Guide

## Prerequisites

- MongoDB Atlas cluster
- [Render](https://render.com) account (backend)
- [Vercel](https://vercel.com) account (frontend)
- Docker (for local image testing)

---

## 1. MongoDB Atlas

1. Create a cluster and a database user with read/write access.
2. Under **Network Access**, allow connections from `0.0.0.0/0` (Render uses dynamic IPs).
3. Copy the connection string — it looks like:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/telcoguard?retryWrites=true&w=majority
   ```

---

## 2. Backend on Render (Docker runtime)

### Environment variables to set in Render dashboard

| Key               | Value                                      |
|-------------------|--------------------------------------------|
| `MONGODB_URI`     | Your Atlas connection string               |
| `JWT_SECRET`      | A long random string                       |
| `JWT_EXPIRE`      | `7d`                                       |
| `ALLOWED_ORIGINS` | Your Vercel frontend URL, e.g. `https://telcoguard.vercel.app` |

### Deploy steps

1. Push the repo to GitHub (already done).
2. In Render, click **New → Web Service** and connect the repo.
3. Set **Root Directory** to `backend`.
4. Set **Runtime** to **Docker**.
5. Render auto-detects `backend/Dockerfile`.
6. Set the environment variables above.
7. Set the **Health Check Path** to `/api/health`.
8. Deploy. Render will build the Docker image and start the service.

The service URL will look like `https://telcoguard-api.onrender.com`.

---

## 3. Frontend on Vercel (Vite preset)

### Environment variables to set in Vercel dashboard

| Key            | Value                                             |
|----------------|---------------------------------------------------|
| `VITE_API_URL` | Your Render backend URL + `/api`, e.g. `https://telcoguard-api.onrender.com/api` |

### Deploy steps

1. In Vercel, click **Add New → Project** and import the repo.
2. Set **Root Directory** to `frontend`.
3. Vercel auto-detects Vite — leave Framework Preset as **Vite**.
4. Add the `VITE_API_URL` environment variable.
5. Deploy. `frontend/vercel.json` handles SPA routing rewrites automatically.

---

## Local Docker test (optional)

```bash
cd backend
docker build -t telcoguard-api .
docker run -p 8000:8000 \
  -e MONGODB_URI="<your-uri>" \
  -e JWT_SECRET="dev_secret" \
  -e JWT_EXPIRE="7d" \
  -e ALLOWED_ORIGINS="http://localhost:5173" \
  telcoguard-api
```
