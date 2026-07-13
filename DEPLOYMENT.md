# TransitOps Deployment Guide

## Local Production Simulation

1. Build frontend:
   - `cd frontend`
   - `npm install`
   - `npm run build`
2. Run backend:
   - `cd ../backend`
   - `npm install`
   - `npm run start`
3. Ensure MongoDB is running and `MONGODB_URI` is configured in `backend/.env`.

## Environment Variables (Backend)

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `FRONTEND_URL`
- `DEFAULT_ADMIN_NAME`
- `DEFAULT_ADMIN_EMAIL`
- `DEFAULT_ADMIN_PASSWORD`

## Deploy Backend (Render/Railway/Fly.io)

1. Push code to GitHub.
2. Create new Node.js service.
3. Set root directory to `backend`.
4. Build command: `npm install`.
5. Start command: `npm run start`.
6. Add all backend environment variables.
7. Add hosted MongoDB connection string (`MongoDB Atlas`) to `MONGODB_URI`.

## Deploy Frontend (Vercel/Netlify)

1. Create new static site from the same repository.
2. Set root directory to `frontend`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Set `VITE_API_BASE_URL` to deployed backend URL + `/api`.

## Post-Deployment Smoke Checklist

1. Login with seeded admin account.
2. Create a vehicle and driver.
3. Create and dispatch a trip.
4. Create maintenance, fuel, and expense records.
5. Open dashboard charts and KPIs.
6. Download report CSV.