# Quick Start Guide - CI/CD Setup
## Get Started with SmileFactory CI/CD in 30 Minutes

**Date:** 2025-11-03  
**Audience:** Developers & DevOps Engineers  
**Prerequisites:** Docker, Git, GitLab account

---

## 🚀 Quick Setup (30 Minutes)

### Step 1: Clone Repository (2 min)

```bash
# Clone the repository
git clone https://gitlab.com/yourorg/smilefactory.git
cd smilefactory

# Create a new branch for CI/CD setup
git checkout -b feature/ci-cd-setup
```

### Step 2: Environment Configuration (5 min)

```bash
# Copy environment templates
cp .env.example .env
cp frontend/.env.example frontend/.env
cp backend-nestjs/.env.example backend-nestjs/.env

# Edit environment files with your credentials
# Use your favorite editor (nano, vim, vscode, etc.)
nano .env
nano frontend/.env
nano backend-nestjs/.env
```

**Required Environment Variables:**

```bash
# .env (Root)
NODE_ENV=development
BACKEND_TYPE=nestjs  # or springboot

# frontend/.env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# backend-nestjs/.env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/smilefactory
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key-change-this
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
```

### Step 3: Install Dependencies (5 min)

```bash
# Frontend dependencies
cd frontend
npm install
cd ..

# Backend dependencies
cd backend-nestjs
npm install
cd ..
```

### Step 4: Start Local Development (3 min)

```bash
# Start all services with Docker Compose
docker-compose up -d

# Wait for services to start (30 seconds)
# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

**Expected Output:**
```
✅ smilefactory-frontend      Running   0.0.0.0:5173->5173/tcp
✅ smilefactory-api-gateway   Running   0.0.0.0:3000->3000/tcp
✅ smilefactory-auth-service  Running   0.0.0.0:3001->3001/tcp
✅ smilefactory-user-service  Running   0.0.0.0:3002->3002/tcp
✅ smilefactory-redis         Running   0.0.0.0:6379->6379/tcp
✅ smilefactory-postgres      Running   0.0.0.0:5432->5432/tcp
```

### Step 5: Verify Services (2 min)

```bash
# Test frontend
curl http://localhost:5173
# Should return HTML

# Test API Gateway
curl http://localhost:3000/health
# Should return: {"status":"ok"}

# Test Auth Service
curl http://localhost:3001/health
# Should return: {"status":"ok"}

# Test User Service
curl http://localhost:3002/health
# Should return: {"status":"ok"}

# Test Redis
docker-compose exec redis redis-cli ping
# Should return: PONG

# Test PostgreSQL
docker-compose exec postgres psql -U postgres -c "SELECT version();"
# Should return PostgreSQL version
```

### Step 6: GitLab CI/CD Setup (10 min)

#### 6.1 Create GitLab Project

1. Go to GitLab: https://gitlab.com
2. Click **New Project**
3. Choose **Create blank project**
4. Name: `smilefactory`
5. Visibility: Private
6. Click **Create project**

#### 6.2 Add Remote and Push

```bash
# Add GitLab remote
git remote add gitlab https://gitlab.com/yourorg/smilefactory.git

# Push code
git add .
git commit -m "feat: initial CI/CD setup"
git push gitlab feature/ci-cd-setup
```

#### 6.3 Configure GitLab Variables

1. Go to **Settings → CI/CD → Variables**
2. Click **Add variable** for each:

| Key | Value | Protected | Masked |
|-----|-------|-----------|--------|
| `CI_REGISTRY` | `registry.gitlab.com/yourorg/smilefactory` | ✅ | ❌ |
| `CI_REGISTRY_USER` | `gitlab-ci-token` | ✅ | ❌ |
| `CI_REGISTRY_PASSWORD` | `${CI_JOB_TOKEN}` | ✅ | ✅ |
| `BACKEND_TYPE` | `nestjs` | ❌ | ❌ |
| `SUPABASE_URL` | `https://xxx.supabase.co` | ✅ | ❌ |
| `SUPABASE_ANON_KEY` | `eyJhbGc...` | ✅ | ✅ |
| `SUPABASE_SERVICE_KEY` | `eyJhbGc...` | ✅ | ✅ |

#### 6.4 Trigger Pipeline

```bash
# Push to trigger pipeline
git push gitlab feature/ci-cd-setup

# View pipeline
# Go to: CI/CD → Pipelines in GitLab UI
```

### Step 7: Verify Pipeline (3 min)

1. Go to **CI/CD → Pipelines** in GitLab
2. Click on the running pipeline
3. Verify all stages pass:
   - ✅ Validate
   - ✅ Test
   - ✅ Build
   - ✅ Containerize (if on develop/main branch)

---

## 🎯 Common Tasks

### Run Tests Locally

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend-nestjs
npm run test

# All tests
docker-compose exec api-gateway npm run test
docker-compose exec auth-service npm run test
docker-compose exec user-service npm run test
```

### Build for Production

```bash
# Frontend
cd frontend
npm run build
# Output: frontend/dist/

# Backend
cd backend-nestjs
npm run build
# Output: backend-nestjs/dist/
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api-gateway
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100 api-gateway
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart api-gateway

# Rebuild and restart
docker-compose up -d --build api-gateway
```

### Stop Services

```bash
# Stop all
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# Stop and remove images
docker-compose down --rmi all
```

---

## 🔧 Troubleshooting

### Issue: Port Already in Use

```bash
# Find what's using the port
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or change port in docker-compose.yml
```

### Issue: Docker Build Fails

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Start fresh
docker-compose down -v
docker-compose up --build
```

### Issue: Database Connection Error

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres

# Connect manually to test
docker-compose exec postgres psql -U postgres -d smilefactory
```

### Issue: Redis Connection Error

```bash
# Check if Redis is running
docker-compose ps redis

# Test connection
docker-compose exec redis redis-cli ping

# Restart Redis
docker-compose restart redis
```

### Issue: Frontend Not Loading

```bash
# Check if frontend is running
docker-compose ps frontend

# Check logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up -d --build frontend

# Access directly
curl http://localhost:5173
```

### Issue: GitLab Pipeline Fails

**Validate Stage Fails:**
```bash
# Run linting locally
cd frontend && npm run lint
cd backend-nestjs && npm run lint

# Fix issues and commit
```

**Test Stage Fails:**
```bash
# Run tests locally
npm run test

# Check test coverage
npm run test:cov

# Fix failing tests
```

**Build Stage Fails:**
```bash
# Check build locally
npm run build

# Check for TypeScript errors
npm run type-check
```

**Containerize Stage Fails:**
```bash
# Test Docker build locally
docker build -t test-image .

# Check Dockerfile syntax
# Verify all files are copied correctly
```

---

## 📊 Health Check Endpoints

| Service | URL | Expected Response |
|---------|-----|-------------------|
| Frontend | http://localhost:5173 | HTML page |
| API Gateway | http://localhost:3000/health | `{"status":"ok"}` |
| Auth Service | http://localhost:3001/health | `{"status":"ok"}` |
| User Service | http://localhost:3002/health | `{"status":"ok"}` |
| Redis | `redis-cli ping` | `PONG` |
| PostgreSQL | `psql -c "SELECT 1"` | `1` |

---

## 🎓 Next Steps

### For Developers

1. ✅ Complete this quick start
2. 📖 Read [CI_CD_IMPLEMENTATION_PLAN.md](./CI_CD_IMPLEMENTATION_PLAN.md)
3. 📁 Review [REPOSITORY_STRUCTURE_GUIDE.md](./REPOSITORY_STRUCTURE_GUIDE.md)
4. 🔨 Start developing features
5. 🧪 Write tests for your code
6. 🚀 Push and let CI/CD handle deployment

### For DevOps

1. ✅ Complete this quick start
2. 🖥️ Set up temporary hosting server
3. 🔐 Configure SSL certificates
4. 📊 Set up monitoring (Prometheus + Grafana)
5. 📝 Document deployment procedures
6. 🏢 Plan on-premises migration

### For Project Managers

1. ✅ Review implementation plan
2. 📅 Create project timeline
3. 👥 Assign team members to phases
4. 💰 Budget for temporary hosting
5. 📋 Track progress with milestones
6. 🎯 Define success metrics

---

## 📚 Additional Resources

- [Full Implementation Plan](./CI_CD_IMPLEMENTATION_PLAN.md)
- [Repository Structure Guide](./REPOSITORY_STRUCTURE_GUIDE.md)
- [Docker Documentation](https://docs.docker.com/)
- [GitLab CI/CD Docs](https://docs.gitlab.com/ee/ci/)
- [NestJS Documentation](https://docs.nestjs.com/)

---

## ✅ Checklist

- [ ] Repository cloned
- [ ] Environment files configured
- [ ] Dependencies installed
- [ ] Docker Compose running
- [ ] All services healthy
- [ ] GitLab project created
- [ ] GitLab variables configured
- [ ] Pipeline running successfully
- [ ] Tests passing
- [ ] Ready to develop!

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-03  
**Estimated Time:** 30 minutes  
**Difficulty:** Beginner-Friendly


