# SmileFactory Backend

Enterprise-level backend system for the SmileFactory innovation ecosystem platform.

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Supabase account

### Installation

```bash
# Install dependencies
npm install

# Install all workspace dependencies
npm install --workspaces

# Copy environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start all services with Docker
docker-compose up

# Or start individual services
npm run dev:gateway
npm run dev:auth
npm run dev:user
```

### Verify Installation

```bash
# Check API Gateway
curl http://localhost:3000/health

# Access API documentation
open http://localhost:3000/api/docs
```

## Project Structure

```
backend/
├── services/           # Microservices
│   ├── api-gateway/   # Main entry point (Port 3000)
│   ├── auth-service/  # Authentication (Port 3001)
│   └── user-service/  # User profiles (Port 3002)
├── shared/            # Shared code
├── infrastructure/    # Docker configs
├── scripts/          # Utility scripts
└── package.json      # Root package
```

## Services

- **API Gateway** (Port 3000) - Request routing, authentication middleware
- **Auth Service** (Port 3001) - OTP-based authentication, JWT tokens
- **User Service** (Port 3002) - User profile management, multiple profiles

## Documentation

See the root documentation files:
- `BACKEND_IMPLEMENTATION_PLAN.md` - Complete technical plan
- `BACKEND_QUICK_START_GUIDE.md` - Developer onboarding
- `BACKEND_API_ENDPOINTS.md` - API reference
- `PHASE_1_SETUP_GUIDE.md` - Phase 1 setup guide

## Development

```bash
# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Build all services
npm run build
```

## License

Copyright © 2025 SmileFactory. All rights reserved.

