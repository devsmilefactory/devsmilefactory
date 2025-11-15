# SmileFactory Monorepo

Welcome to the SmileFactory monorepo! This repository contains all frontend, backend, and shared code for the SmileFactory application system.

## 🏗️ Repository Structure

```
/smilefactory
├─ /apps                    # Application code
│   ├─ /frontend           # React + Vite + shadcn/ui
│   ├─ /backend-node       # Node.js microservices
│   └─ /backend-java       # Java backend
├─ /deployment             # Deployment configurations
│   ├─ /compose           # Docker Compose files
│   ├─ /scripts           # Deployment scripts
│   └─ /nginx             # Nginx configuration
├─ /docs                   # Documentation
│   ├─ /deployment        # Deployment guides
│   └─ /development       # Development guides
├─ /shared                 # Shared libraries
│   ├─ /types             # TypeScript types
│   ├─ /utils             # Utility functions
│   └─ /constants         # Constants
├─ /config                 # Shared configurations
└─ /tools                  # Developer tools
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/devsmilefactory/devsmilefactory.git
cd devsmilefactory
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy example env files
cp .env.example .env
cp apps/frontend/.env.example apps/frontend/.env
cp apps/backend-node/.env.example apps/backend-node/.env
cp apps/backend-java/.env.example apps/backend-java/.env

# Edit .env files with your configuration
```

### Development

#### Frontend Development
```bash
cd apps/frontend
npm install
npm run dev
```

#### Backend Node Development
```bash
cd apps/backend-node
npm install
npm run dev
```

#### Backend Java Development
```bash
cd apps/backend-java
mvn spring-boot:run
```

## 🐳 Docker Deployment

### Deploy All Services
```bash
npm run deploy:all
```

### Deploy Individual Services
```bash
# Deploy backend services
npm run deploy:backend

# Deploy frontend
npm run deploy:frontend
```

### Health Check
```bash
npm run health-check
```

### Build Docker Images
```bash
# Build all images
npm run docker:build

# Build individual images
npm run docker:build:frontend
npm run docker:build:backend-node
npm run docker:build:backend-java
```

## 📦 Workspace Management

This monorepo uses npm workspaces for dependency management.

### Available Scripts

- `npm run build` - Build all workspace packages
- `npm run test` - Run tests in all workspaces
- `npm run lint` - Lint all code
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Adding Dependencies

```bash
# Add to root (shared dev dependencies)
npm install -D <package> -w root

# Add to specific workspace
npm install <package> -w apps/frontend
npm install <package> -w apps/backend-node
```

## 🔒 Security

### Sensitive Files

The following files are excluded from version control:

- `.env` files (environment variables)
- `*-secret.*` files
- `*-credentials.*` files
- API keys and JWT secrets
- Database credentials

Always use `.env.example` files as templates and never commit actual credentials.

### Environment Variables

Required environment variables are documented in `.env.example` files:

- **Root**: `.env.example`
- **Frontend**: `apps/frontend/.env.example`
- **Backend Node**: `apps/backend-node/.env.example`
- **Backend Java**: `apps/backend-java/.env.example`

## 🌐 Service URLs

### Development
- Frontend: http://localhost:5173
- Backend Node: http://localhost:3000
- Backend Java: http://localhost:8080

### Production (Docker)
- Frontend: http://localhost:80
- Backend Node: http://localhost:3000
- Backend Java: http://localhost:8080

## 📚 Documentation

- [Deployment Architecture](docs/deployment/architecture.md)
- [Server Setup Guide](docs/deployment/server-setup.md)
- [Deployment Guide](docs/deployment/deployment-guide.md)
- [Getting Started](docs/development/getting-started.md)
- [Git Workflow](docs/development/git-workflow.md)

## 🔄 Git Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Hotfix branches

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

Example:
```bash
git commit -m "feat(frontend): add user profile page"
git commit -m "fix(backend): resolve authentication bug"
```

## 🛠️ Troubleshooting

### Docker Issues

If containers fail to start:
```bash
# Check logs
docker-compose -f deployment/compose/backend/docker-compose.yml logs
docker-compose -f deployment/compose/frontend/docker-compose.yml logs

# Rebuild images
docker-compose -f deployment/compose/backend/docker-compose.yml build --no-cache
```

### Port Conflicts

If ports are already in use, update the port mappings in:
- `deployment/compose/backend/docker-compose.yml`
- `deployment/compose/frontend/docker-compose.yml`

### Network Issues

Create the Docker network manually:
```bash
docker network create smilefactory-network
```

## 📄 License

UNLICENSED - Private repository

## 👥 Team

SmileFactory Development Team

---

For more detailed information, see the [documentation](docs/) directory.
