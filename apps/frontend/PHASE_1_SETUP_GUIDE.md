# Phase 1: Foundation Setup - Step-by-Step Guide

**Status:** 🚀 Ready to Begin  
**Duration:** Weeks 1-4  
**Current Step:** Prerequisites Installation

---

## ✅ Prerequisites Checklist

Before we begin, ensure you have the following installed:

### Required Software

- [ ] **Node.js** (v18 or higher)
  - Check: `node --version`
  - Download: https://nodejs.org/

- [ ] **npm** (comes with Node.js)
  - Check: `npm --version`

- [ ] **Git** (already installed)
  - Check: `git --version`

- [ ] **Docker Desktop** (for Windows)
  - Check: `docker --version`
  - Download: https://www.docker.com/products/docker-desktop/

- [ ] **Docker Compose** (comes with Docker Desktop)
  - Check: `docker-compose --version`

### Optional but Recommended

- [ ] **Supabase CLI**
  - Install: `npm install -g supabase`
  - Check: `supabase --version`

- [ ] **Postman or Insomnia** (for API testing)
  - Download: https://www.postman.com/

---

## 📦 Backend Dependencies to Install

### Step 1: Create Backend Directory

We'll create a `backend` folder in your workspace alongside the frontend.

```
smilefactory/
├── src/                  # Frontend (existing)
├── backend/              # Backend (new)
│   ├── services/
│   ├── shared/
│   └── package.json
└── package.json          # Frontend package.json
```

### Step 2: Backend Root Dependencies

Create `backend/package.json` with these dependencies:

```json
{
  "name": "smilefactory-backend",
  "version": "1.0.0",
  "description": "SmileFactory Backend Microservices",
  "private": true,
  "workspaces": [
    "services/*",
    "shared/*"
  ],
  "scripts": {
    "install:all": "npm install --workspaces",
    "dev": "docker-compose up",
    "dev:gateway": "npm run start:dev --workspace=services/api-gateway",
    "dev:auth": "npm run start:dev --workspace=services/auth-service",
    "dev:user": "npm run start:dev --workspace=services/user-service",
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "lint": "npm run lint --workspaces",
    "migrate": "node scripts/migrate.js",
    "seed": "node scripts/seed.js"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "typescript": "^5.3.0",
    "prettier": "^3.1.0",
    "eslint": "^8.55.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0"
  }
}
```

### Step 3: NestJS Core Dependencies (for each microservice)

Each microservice will have these core dependencies:

```json
{
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/platform-express": "^10.3.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/swagger": "^7.1.17",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "rxjs": "^7.8.1",
    "reflect-metadata": "^0.1.14"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.2.1",
    "@nestjs/schematics": "^10.0.3",
    "@nestjs/testing": "^10.3.0",
    "@types/express": "^4.17.21",
    "@types/passport-jwt": "^4.0.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0"
  }
}
```

### Step 4: Database & Caching Dependencies

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "ioredis": "^5.3.2",
    "pg": "^8.11.3"
  },
  "devDependencies": {
    "@types/pg": "^8.10.9"
  }
}
```

### Step 5: Additional Service-Specific Dependencies

```json
{
  "dependencies": {
    "@nestjs/microservices": "^10.3.0",
    "@nestjs/websockets": "^10.3.0",
    "@nestjs/platform-socket.io": "^10.3.0",
    "@sendgrid/mail": "^7.7.0",
    "bcrypt": "^5.1.1",
    "uuid": "^9.0.1",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/uuid": "^9.0.7"
  }
}
```

---

## 🚀 Installation Commands

### Command 1: Install Global Tools

```bash
# Install Supabase CLI globally
npm install -g supabase

# Install NestJS CLI globally
npm install -g @nestjs/cli
```

### Command 2: Verify Installations

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check Docker
docker --version

# Check Docker Compose
docker-compose --version

# Check NestJS CLI
nest --version

# Check Supabase CLI
supabase --version
```

---

## 📁 Folder Structure to Create

I will create this structure for you:

```
backend/
├── services/
│   ├── api-gateway/
│   │   ├── src/
│   │   ├── test/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── nest-cli.json
│   ├── auth-service/
│   │   ├── src/
│   │   ├── test/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── nest-cli.json
│   └── user-service/
│       ├── src/
│       ├── test/
│       ├── package.json
│       ├── tsconfig.json
│       └── nest-cli.json
├── shared/
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   ├── config/
│   └── database/
├── infrastructure/
│   ├── docker/
│   │   └── Dockerfile
│   └── docker-compose.yml
├── scripts/
│   ├── migrate.js
│   └── seed.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🗑️ Mock Database Removal (Frontend)

These Zustand stores will be removed from the frontend:

1. `src/stores/postsStore.ts` - Will be replaced with API calls to Feed Service
2. `src/stores/messagingStore.ts` - Will be replaced with API calls to Messaging Service
3. `src/stores/eventsStore.ts` - Will be replaced with API calls to Events Service
4. `src/stores/marketplaceStore.ts` - Will be replaced with API calls to Marketplace Service
5. `src/stores/blogStore.ts` - Will be replaced with API calls to Feed Service
6. `src/stores/eventRegistrationStore.ts` - Will be replaced with API calls to Events Service

**Note:** We'll keep these stores temporarily and replace them gradually as we build each backend service.

---

## 🔧 Supabase Setup

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name:** smilefactory-backend
   - **Database Password:** (generate a strong password)
   - **Region:** Choose closest to your users
5. Click "Create new project"
6. Wait for project to be provisioned (~2 minutes)

### Step 2: Get Supabase Credentials

Once your project is ready:

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., https://xxxxx.supabase.co)
   - **anon/public key**
   - **service_role key** (keep this secret!)

### Step 3: Configure Environment Variables

Create `backend/.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@smilefactory.com

# API Gateway
API_GATEWAY_PORT=3000

# Service Ports
AUTH_SERVICE_PORT=3001
USER_SERVICE_PORT=3002
FEED_SERVICE_PORT=3003
MESSAGING_SERVICE_PORT=3004
CONNECTION_SERVICE_PORT=3005
EVENTS_SERVICE_PORT=3006
MARKETPLACE_SERVICE_PORT=3007
SEARCH_SERVICE_PORT=3008
NOTIFICATION_SERVICE_PORT=3009

# Environment
NODE_ENV=development
```

---

## 📋 Phase 1 Tasks Breakdown

### Week 1: Setup & Infrastructure
- [x] Create implementation plan
- [ ] Install prerequisites
- [ ] Create backend folder structure
- [ ] Set up Supabase project
- [ ] Configure environment variables
- [ ] Set up Docker Compose

### Week 2: Database & Auth Service
- [ ] Create database migrations (18 tables)
- [ ] Run migrations on Supabase
- [ ] Build Auth Service (OTP flow)
- [ ] Test authentication endpoints

### Week 3: User Profile Service
- [ ] Build User Profile Service
- [ ] Implement multiple profiles logic
- [ ] Test profile endpoints
- [ ] Integrate with Auth Service

### Week 4: API Gateway & Integration
- [ ] Build API Gateway
- [ ] Set up routing to services
- [ ] Add authentication middleware
- [ ] Test end-to-end flow
- [ ] Create API documentation

---

## 🎯 Next Immediate Steps

1. **Verify Prerequisites** - Run all the check commands above
2. **Install Global Tools** - Install NestJS CLI and Supabase CLI
3. **Create Supabase Project** - Follow the Supabase setup steps
4. **Wait for Backend Folder Creation** - I will create the folder structure
5. **Install Dependencies** - Run `npm install` in backend directory
6. **Configure Environment** - Copy credentials to `.env` file

---

## ✅ Success Criteria for Phase 1

By the end of Phase 1, you should have:

- ✅ Backend folder structure created
- ✅ All dependencies installed
- ✅ Supabase project configured
- ✅ Database schema deployed (18 tables)
- ✅ Auth Service working (OTP flow)
- ✅ User Profile Service working
- ✅ API Gateway routing requests
- ✅ Docker Compose running all services
- ✅ API documentation available
- ✅ Basic tests passing

---

## 🆘 Need Help?

If you encounter any issues:

1. Check the error message carefully
2. Verify all prerequisites are installed
3. Check environment variables are set correctly
4. Ensure Docker is running
5. Check Supabase project is active

---

**Ready to proceed? Let me know and I'll create the backend folder structure!** 🚀


