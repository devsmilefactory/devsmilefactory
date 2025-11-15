# Backend Installation Steps

Follow these steps to install and run the SmileFactory backend.

---

## ✅ Step 1: Install Dependencies

Open your terminal in the `backend` directory and run:

```bash
cd backend

# Install root dependencies
npm install

# Install all workspace dependencies (this will install dependencies for all services)
npm install --workspaces
```

This will install dependencies for:
- Root workspace
- API Gateway service
- Auth service
- User service
- Shared common module

**Expected output:** You should see npm installing packages for each workspace.

---

## ✅ Step 2: Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Open `.env` in your text editor and fill in your Supabase credentials:

```env
# Supabase Configuration (REQUIRED - Get from https://supabase.com)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

# JWT Configuration (REQUIRED - Generate secure random strings)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
```

### How to Generate JWT Secrets

Run this command to generate secure JWT secrets:

```bash
# For Windows PowerShell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Run it twice to get two different secrets
```

Copy the output and paste it into your `.env` file for `JWT_SECRET` and `JWT_REFRESH_SECRET`.

### How to Get Supabase Credentials

1. Go to https://supabase.com
2. Sign in to your account
3. Select your project (or create a new one)
4. Go to **Project Settings** → **API**
5. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon/public key** → `SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_KEY`

---

## ✅ Step 3: Start Redis (Required)

Redis is required for caching and session management. You have two options:

### Option A: Using Docker (Recommended)

```bash
# Start only Redis
docker-compose up redis -d

# Verify Redis is running
docker ps
```

### Option B: Install Redis Locally

**Windows:**
- Download Redis from: https://github.com/microsoftarchive/redis/releases
- Or use WSL2 and install Redis in Linux

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

---

## ✅ Step 4: Test Individual Services

Before running everything with Docker, let's test each service individually:

### Test API Gateway

```bash
# Open a new terminal in backend directory
cd backend
npm run dev:gateway
```

**Expected output:**
```
🚀 API Gateway running on: http://localhost:3000
📚 API Documentation: http://localhost:3000/api/docs
```

**Test it:**
```bash
# In another terminal
curl http://localhost:3000/api/v1/health
```

**Expected response:**
```json
{
  "status": "ok",
  "service": "api-gateway",
  "timestamp": "2025-10-21T...",
  "uptime": 1.234
}
```

Press `Ctrl+C` to stop the service.

### Test Auth Service

```bash
npm run dev:auth
```

**Expected output:**
```
🔐 Auth Service running on: http://localhost:3001
📚 API Documentation: http://localhost:3001/api/docs
```

**Test it:**
```bash
curl http://localhost:3001/api/v1/health
```

Press `Ctrl+C` to stop the service.

### Test User Service

```bash
npm run dev:user
```

**Expected output:**
```
👤 User Service running on: http://localhost:3002
📚 API Documentation: http://localhost:3002/api/docs
```

**Test it:**
```bash
curl http://localhost:3002/api/v1/health
```

Press `Ctrl+C` to stop the service.

---

## ✅ Step 5: Run All Services with Docker Compose (Optional)

If you want to run all services together with Docker:

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

---

## ✅ Step 6: Access API Documentation

Once services are running, you can access the Swagger API documentation:

- **API Gateway:** http://localhost:3000/api/docs
- **Auth Service:** http://localhost:3001/api/docs
- **User Service:** http://localhost:3002/api/docs

---

## ✅ Step 7: Verify Everything is Working

Run these commands to verify all services are healthy:

```bash
# API Gateway
curl http://localhost:3000/api/v1/health

# Auth Service
curl http://localhost:3001/api/v1/health

# User Service
curl http://localhost:3002/api/v1/health
```

All should return a JSON response with `"status": "ok"`.

---

## 🎯 Next Steps

Now that the backend is running, the next steps are:

1. **Create Database Migrations** - Set up the 18 database tables in Supabase
2. **Implement Auth Service** - Build the OTP authentication flow
3. **Implement User Service** - Build the profile management system
4. **Connect Frontend** - Integrate the React frontend with the backend APIs

---

## 🆘 Troubleshooting

### Issue: "Cannot find module '@nestjs/common'"

**Solution:**
```bash
cd backend
npm install --workspaces
```

### Issue: "Port 3000 is already in use"

**Solution:**
```bash
# Find and kill the process using the port
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Or change the port in .env file
API_GATEWAY_PORT=3100
```

### Issue: "Redis connection failed"

**Solution:**
```bash
# Make sure Redis is running
docker-compose up redis -d

# Or check if Redis is running locally
redis-cli ping
# Should return: PONG
```

### Issue: "Supabase connection failed"

**Solution:**
- Check your `SUPABASE_URL` in `.env` is correct
- Verify your API keys are correct
- Make sure your Supabase project is active
- Check your internet connection

---

## 📋 Installation Checklist

- [ ] Installed Node.js 18+
- [ ] Installed Docker Desktop
- [ ] Installed NestJS CLI globally
- [ ] Installed Supabase CLI globally
- [ ] Created Supabase project
- [ ] Ran `npm install` in backend directory
- [ ] Ran `npm install --workspaces`
- [ ] Copied `.env.example` to `.env`
- [ ] Added Supabase credentials to `.env`
- [ ] Generated and added JWT secrets to `.env`
- [ ] Started Redis
- [ ] Tested API Gateway (http://localhost:3000/api/v1/health)
- [ ] Tested Auth Service (http://localhost:3001/api/v1/health)
- [ ] Tested User Service (http://localhost:3002/api/v1/health)
- [ ] Accessed API documentation (http://localhost:3000/api/docs)

---

**All set! Your backend is now running! 🎉**

Next, we'll create the database migrations and implement the authentication system.


