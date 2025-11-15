# Local Deployment Guide

## Prerequisites
- Node.js ≥ 18 and npm ≥ 9
- Docker Desktop (for Compose workflow)
- Supabase project credentials (URL + service role key)
- SendGrid API key (optional until email delivery is enabled)

## Option A: Node + Nest CLI
1. Install dependencies  
   ```bash
   npm ci
   cd backend && npm ci
   ```
2. Copy environment templates  
   ```bash
   cp env.local.example .env.local
   cp backend/env.example backend/.env
   ```
3. Run services  
   - Frontend: `npm run dev` (port 5173)  
   - API Gateway: `npm run start:dev --workspace=services/api-gateway`  
   - Auth Service: `npm run start:dev --workspace=services/auth-service`  
   - User Service: `npm run start:dev --workspace=services/user-service`

## Option B: Docker Compose
1. Ensure `.env` values exist under `backend/.env` (same as Option A)  
2. From `backend/` run:
   ```bash
   docker compose up --build
   ```
3. Frontend stays outside the `backend` compose file. To run the SPA inside Docker set:
   ```bash
   docker build -t smilefactory-frontend:dev .
   docker run -p 5173:80 smilefactory-frontend:dev
   ```

## Helpful Commands
- Lint all workspaces: `cd backend && npm run lint`
- Run backend tests: `cd backend && npm run test`
- Clean containers: `docker compose down -v`

## Troubleshooting
- Verify `backend/.env` contains valid Supabase keys
- Ensure Docker Desktop has at least 4 GB RAM allocated
- Check Redis service via `docker exec -it backend-redis redis-cli ping`

