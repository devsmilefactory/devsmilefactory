# Getting Started with SmileFactory Development

Welcome to SmileFactory! This guide will help you set up your development environment and start contributing.

## Prerequisites

### Required Software

- **Node.js**: >= 18.0.0 ([Download](https://nodejs.org/))
- **npm**: >= 9.0.0 (comes with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))
- **Docker**: Latest version ([Download](https://www.docker.com/))
- **Docker Compose**: >= 2.0
- **Code Editor**: VS Code recommended ([Download](https://code.visualstudio.com/))

### Optional Tools

- **Postman** or **Insomnia**: For API testing
- **DBeaver** or **pgAdmin**: For database management
- **Docker Desktop**: For easier Docker management

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/devsmilefactory/devsmilefactory.git
cd devsmilefactory
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd apps/frontend
npm install
cd ../..

# Install backend-node dependencies
cd apps/backend-node
npm install
cd ../..
```

### 3. Set Up Environment Variables

```bash
# Copy environment templates
cp .env.example .env
cp apps/frontend/.env.example apps/frontend/.env
cp apps/backend-node/.env.example apps/backend-node/.env
cp apps/backend-java/.env.example apps/backend-java/.env
```

Edit each `.env` file with your local configuration:

**Root `.env`:**
```env
NODE_ENV=development
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:3000
VITE_BACKEND_URL=http://localhost:3000
```

**Backend Node `.env`:**
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/smilefactory_dev
JWT_SECRET=your-dev-jwt-secret
API_KEY=your-dev-api-key
```

**Backend Java `.env`:**
```env
SPRING_PROFILES_ACTIVE=development
DATABASE_URL=postgresql://user:password@localhost:5432/smilefactory_dev
JWT_SECRET=your-dev-jwt-secret
```

### 4. Set Up Database (if needed)

```bash
# Using Docker
docker run --name smilefactory-db \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=smilefactory_dev \
  -p 5432:5432 \
  -d postgres:15

# Or install PostgreSQL locally
```

## Development Workflow

### Running Services Locally

#### Frontend Development

```bash
cd apps/frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

#### Backend Node Development

```bash
cd apps/backend-node
npm run dev
```

The backend API will be available at `http://localhost:3000`

#### Backend Java Development

```bash
cd apps/backend-java
mvn spring-boot:run
```

The Java backend will be available at `http://localhost:8080`

### Running All Services with Docker

```bash
# Start all services
docker-compose -f apps/backend-node/docker-compose.yml up -d

# Or use deployment compose files
docker-compose -f deployment/compose/backend/docker-compose.yml up -d
docker-compose -f deployment/compose/frontend/docker-compose.yml up -d
```

## Project Structure

```
/smilefactory
├─ /apps
│   ├─ /frontend              # React + Vite application
│   │   ├─ /src
│   │   │   ├─ /components   # React components
│   │   │   ├─ /pages        # Page components
│   │   │   ├─ /hooks        # Custom hooks
│   │   │   ├─ /lib          # Utilities and helpers
│   │   │   └─ /types        # TypeScript types
│   │   └─ package.json
│   │
│   ├─ /backend-node          # Node.js microservices
│   │   ├─ /services
│   │   │   ├─ /api-gateway  # API Gateway service
│   │   │   ├─ /auth-service # Authentication service
│   │   │   └─ /user-service # User management service
│   │   ├─ /infrastructure   # Infrastructure code
│   │   └─ /database         # Database migrations
│   │
│   └─ /backend-java          # Java backend
│       ├─ /src/main/java
│       └─ pom.xml
│
├─ /shared                     # Shared code
│   ├─ /types                 # Shared TypeScript types
│   ├─ /utils                 # Shared utilities
│   └─ /constants             # Shared constants
│
├─ /config                     # Shared configurations
├─ /tools                      # Developer tools
└─ /docs                       # Documentation
```

## Development Commands

### Root Level Commands

```bash
# Install all dependencies
npm install

# Build all workspaces
npm run build

# Run tests in all workspaces
npm run test

# Lint all code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Frontend Commands

```bash
cd apps/frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint
npm run lint
```

### Backend Node Commands

```bash
cd apps/backend-node

# Start dev server with hot reload
npm run dev

# Start production server
npm start

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint
```

### Backend Java Commands

```bash
cd apps/backend-java

# Run application
mvn spring-boot:run

# Build
mvn clean package

# Run tests
mvn test

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## Code Style and Standards

### TypeScript/JavaScript

- Use TypeScript for type safety
- Follow ESLint rules (see `config/.eslintrc.js`)
- Use Prettier for formatting (see `config/.prettierrc`)
- Write meaningful variable and function names
- Add JSDoc comments for complex functions

### React

- Use functional components with hooks
- Keep components small and focused
- Use custom hooks for reusable logic
- Follow component naming conventions (PascalCase)
- Use TypeScript interfaces for props

### Git Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

Examples:
```bash
git commit -m "feat(frontend): add user profile page"
git commit -m "fix(backend): resolve authentication bug"
git commit -m "docs: update getting started guide"
```

## Testing

### Frontend Testing

```bash
cd apps/frontend

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Backend Node Testing

```bash
cd apps/backend-node

# Run all tests
npm run test

# Run specific test file
npm run test -- services/auth-service/auth.test.js

# Run with coverage
npm run test:coverage
```

### Backend Java Testing

```bash
cd apps/backend-java

# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=UserServiceTest

# Run with coverage
mvn test jacoco:report
```

## Debugging

### Frontend Debugging

1. Use browser DevTools (F12)
2. Use React DevTools extension
3. Add `debugger` statements in code
4. Use VS Code debugger with launch configuration

### Backend Node Debugging

```bash
# Start with debugger
npm run dev:debug

# Or use VS Code debugger
# Add to .vscode/launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "program": "${workspaceFolder}/apps/backend-node/services/api-gateway/index.js",
  "env": {
    "NODE_ENV": "development"
  }
}
```

### Backend Java Debugging

```bash
# Run with debug mode
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"

# Or use IDE debugger (IntelliJ IDEA, Eclipse)
```

## Common Tasks

### Adding a New Dependency

```bash
# Add to frontend
npm install <package> -w apps/frontend

# Add to backend-node
npm install <package> -w apps/backend-node

# Add to root (shared dev dependency)
npm install -D <package>
```

### Creating a New Component

```bash
# Frontend component
cd apps/frontend/src/components
mkdir MyComponent
touch MyComponent/MyComponent.tsx
touch MyComponent/MyComponent.test.tsx
touch MyComponent/index.ts
```

### Creating a New API Endpoint

```bash
# Backend Node
cd apps/backend-node/services/api-gateway
# Add route in routes/ directory
# Add controller in controllers/ directory
# Add service logic in services/ directory
```

### Running Database Migrations

```bash
cd apps/backend-node
npm run migrate:up

# Rollback
npm run migrate:down
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues

```bash
# Restart Docker
# macOS/Windows: Restart Docker Desktop
# Linux:
sudo systemctl restart docker

# Clean up Docker
docker system prune -a
```

### Build Errors

```bash
# Clear build cache
rm -rf dist/ build/ target/

# Rebuild
npm run build
```

## VS Code Setup

### Recommended Extensions

- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- Docker
- GitLens
- Thunder Client (API testing)

### Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Getting Help

- **Documentation**: Check `/docs` directory
- **Code Comments**: Read inline comments in code
- **Git History**: Use `git log` and `git blame`
- **Team**: Ask team members for help
- **Issues**: Check GitHub issues for known problems

## Next Steps

1. Read the [Git Workflow](git-workflow.md) guide
2. Review the [Architecture Documentation](../deployment/architecture.md)
3. Explore the codebase
4. Pick up a task from the issue tracker
5. Make your first contribution!

Happy coding! 🚀
