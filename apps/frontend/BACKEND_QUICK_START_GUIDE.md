# SmileFactory Backend - Quick Start Guide

This guide will help you get the SmileFactory backend system up and running on your local machine.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Docker** and **Docker Compose**
- **Git**
- **PostgreSQL** (optional, for local development without Supabase)
- **Redis** (optional, Docker will provide this)

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/smilefactory/backend.git
cd backend
```

---

## Step 2: Set Up Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit `.env` and fill in your credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# JWT Secrets (generate secure random strings)
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Email Service (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@smilefactory.com

# Other configurations...
```

### Generate JWT Secrets

You can generate secure JWT secrets using:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Step 3: Set Up Supabase

### Option A: Use Supabase Cloud (Recommended)

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and API keys
4. Run the database migrations:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Option B: Use Local Supabase

```bash
# Start local Supabase
supabase start

# This will give you local credentials
# Update your .env with the local URLs
```

---

## Step 4: Install Dependencies

```bash
# Install root dependencies
npm install

# Install dependencies for all services
npm install --workspaces
```

---

## Step 5: Run Database Migrations

```bash
# Run migrations
npm run migrate

# Seed initial data (optional)
npm run seed
```

---

## Step 6: Start the Development Environment

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up

# Or run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

This will start:
- API Gateway (http://localhost:3000)
- All microservices
- Redis
- Nginx (http://localhost:80)

### Without Docker (Individual Services)

```bash
# Terminal 1: Start Redis
redis-server

# Terminal 2: Start API Gateway
cd services/api-gateway
npm run start:dev

# Terminal 3: Start Auth Service
cd services/auth-service
npm run start:dev

# Terminal 4: Start User Service
cd services/user-service
npm run start:dev

# ... and so on for other services
```

---

## Step 7: Verify Installation

### Check Service Health

```bash
# API Gateway
curl http://localhost:3000/health

# Auth Service
curl http://localhost:3001/health

# User Service
curl http://localhost:3002/health
```

### Access API Documentation

Open your browser and navigate to:
- **Swagger UI:** http://localhost:3000/api/docs

---

## Step 8: Test the Authentication Flow

### 1. Send OTP

```bash
curl -X POST http://localhost:3000/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### 2. Check your email for the OTP code

### 3. Verify OTP

```bash
curl -X POST http://localhost:3000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456"
  }'
```

You should receive a response with access and refresh tokens.

---

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run tests for a specific service
cd services/auth-service
npm test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e
```

### Linting and Formatting

```bash
# Lint all code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Database Operations

```bash
# Create a new migration
npm run migration:create -- --name=add-new-table

# Run migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback

# Seed database
npm run seed
```

### Viewing Logs

```bash
# Docker Compose logs
docker-compose logs -f [service-name]

# Example: View auth service logs
docker-compose logs -f auth-service

# View all logs
docker-compose logs -f
```

---

## Common Issues and Solutions

### Issue 1: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find process using the port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port in .env
PORT=3001
```

### Issue 2: Redis Connection Failed

**Error:** `Error: Redis connection to localhost:6379 failed`

**Solution:**
```bash
# Start Redis
docker-compose up redis

# Or install and start Redis locally
brew install redis  # macOS
redis-server
```

### Issue 3: Supabase Connection Failed

**Error:** `Error: connect ECONNREFUSED`

**Solution:**
- Check your `SUPABASE_URL` in `.env`
- Verify your Supabase project is running
- Check your internet connection
- Verify API keys are correct

### Issue 4: Database Migration Failed

**Error:** `Migration failed: relation already exists`

**Solution:**
```bash
# Reset database (WARNING: This will delete all data)
npm run migrate:reset

# Or manually drop tables in Supabase dashboard
```

---

## Useful Commands

### Docker Commands

```bash
# Rebuild all containers
docker-compose build

# Rebuild specific service
docker-compose build auth-service

# Remove all containers and volumes
docker-compose down -v

# View running containers
docker-compose ps

# Execute command in container
docker-compose exec auth-service npm run test
```

### NPM Workspace Commands

```bash
# Run command in all workspaces
npm run build --workspaces

# Run command in specific workspace
npm run test --workspace=services/auth-service

# Add dependency to specific workspace
npm install express --workspace=services/api-gateway
```

---

## Project Structure Overview

```
backend/
├── services/           # Microservices
│   ├── api-gateway/   # Main entry point
│   ├── auth-service/  # Authentication
│   ├── user-service/  # User profiles
│   └── ...
├── shared/            # Shared code
│   ├── common/        # Common utilities
│   ├── config/        # Configuration
│   └── database/      # Database clients
├── infrastructure/    # Docker, K8s configs
├── scripts/          # Utility scripts
├── docs/             # Documentation
└── tests/            # E2E tests
```

---

## Next Steps

1. **Explore the API Documentation:** http://localhost:3000/api/docs
2. **Read the Architecture Guide:** `docs/architecture/system-architecture.md`
3. **Review the Database Schema:** `docs/architecture/database-schema.md`
4. **Check the Implementation Plan:** `BACKEND_IMPLEMENTATION_PLAN.md`
5. **Join the Development Team:** Contact your team lead

---

## Getting Help

- **Documentation:** Check the `docs/` folder
- **Issues:** Create an issue on GitHub
- **Slack:** Join #backend-dev channel
- **Email:** dev-team@smilefactory.com

---

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Write tests
4. Run linting and tests: `npm run lint && npm test`
5. Commit your changes: `git commit -m "Add your feature"`
6. Push to the branch: `git push origin feature/your-feature`
7. Create a Pull Request

---

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Redis Documentation](https://redis.io/docs)
- [Docker Documentation](https://docs.docker.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Happy Coding! 🚀**


