# SmileFactory Backend - Folder Structure

This document outlines the recommended folder structure for the SmileFactory backend system.

---

## Root Directory Structure

```
smilefactory-backend/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── services/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── user-service/
│   ├── feed-service/
│   ├── messaging-service/
│   ├── connection-service/
│   ├── events-service/
│   ├── marketplace-service/
│   ├── search-service/
│   ├── notification-service/
│   └── migration-service/
├── shared/
│   ├── common/
│   ├── config/
│   ├── database/
│   └── utils/
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   └── terraform/
├── scripts/
│   ├── migration/
│   └── seed/
├── docs/
│   ├── api/
│   ├── architecture/
│   └── guides/
├── tests/
│   ├── e2e/
│   └── integration/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── docker-compose.prod.yml
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

---

## Individual Microservice Structure

Each service follows the same structure (example: `auth-service`):

```
auth-service/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── controllers/
│   │   │   │   └── auth.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── otp.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── user-account.repository.ts
│   │   │   ├── dto/
│   │   │   │   ├── send-otp.dto.ts
│   │   │   │   ├── verify-otp.dto.ts
│   │   │   │   └── auth-response.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── user-account.entity.ts
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── interfaces/
│   │   │   │   └── auth.interface.ts
│   │   │   └── auth.module.ts
│   │   └── health/
│   │       ├── health.controller.ts
│   │       └── health.module.ts
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   └── middleware/
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── jwt.config.ts
│   ├── database/
│   │   ├── migrations/
│   │   └── seeds/
│   ├── app.module.ts
│   └── main.ts
├── test/
│   ├── unit/
│   └── integration/
├── .env.example
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

---

## Shared Module Structure

```
shared/
├── common/
│   ├── constants/
│   │   ├── error-codes.ts
│   │   ├── response-messages.ts
│   │   └── index.ts
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   ├── roles.decorator.ts
│   │   └── index.ts
│   ├── dto/
│   │   ├── pagination.dto.ts
│   │   ├── response.dto.ts
│   │   └── index.ts
│   ├── enums/
│   │   ├── profile-type.enum.ts
│   │   ├── post-type.enum.ts
│   │   └── index.ts
│   ├── filters/
│   │   ├── http-exception.filter.ts
│   │   └── index.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── index.ts
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   ├── transform.interceptor.ts
│   │   └── index.ts
│   ├── interfaces/
│   │   ├── user.interface.ts
│   │   ├── profile.interface.ts
│   │   └── index.ts
│   ├── pipes/
│   │   ├── validation.pipe.ts
│   │   └── index.ts
│   └── utils/
│       ├── date.util.ts
│       ├── string.util.ts
│       └── index.ts
├── config/
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── redis.config.ts
│   └── index.ts
├── database/
│   ├── supabase.client.ts
│   ├── redis.client.ts
│   └── index.ts
└── utils/
    ├── logger.util.ts
    ├── crypto.util.ts
    └── index.ts
```

---

## Infrastructure Structure

```
infrastructure/
├── docker/
│   ├── api-gateway/
│   │   └── Dockerfile
│   ├── auth-service/
│   │   └── Dockerfile
│   ├── nginx/
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   └── redis/
│       └── redis.conf
├── kubernetes/
│   ├── namespaces/
│   │   └── smilefactory.yaml
│   ├── deployments/
│   │   ├── api-gateway.yaml
│   │   ├── auth-service.yaml
│   │   └── ...
│   ├── services/
│   │   ├── api-gateway-service.yaml
│   │   └── ...
│   ├── configmaps/
│   │   └── app-config.yaml
│   ├── secrets/
│   │   └── app-secrets.yaml
│   ├── ingress/
│   │   └── ingress.yaml
│   └── hpa/
│       └── api-gateway-hpa.yaml
└── terraform/
    ├── modules/
    │   ├── eks/
    │   ├── rds/
    │   └── redis/
    ├── environments/
    │   ├── dev/
    │   ├── staging/
    │   └── production/
    ├── main.tf
    ├── variables.tf
    └── outputs.tf
```

---

## Scripts Structure

```
scripts/
├── migration/
│   ├── extract-old-data.ts
│   ├── transform-data.ts
│   ├── load-data.ts
│   └── validate-migration.ts
├── seed/
│   ├── seed-users.ts
│   ├── seed-profiles.ts
│   ├── seed-posts.ts
│   └── seed-all.ts
├── deploy/
│   ├── deploy-dev.sh
│   ├── deploy-staging.sh
│   └── deploy-production.sh
└── utils/
    ├── generate-jwt-secret.ts
    └── check-health.ts
```

---

## Documentation Structure

```
docs/
├── api/
│   ├── auth-api.md
│   ├── user-api.md
│   ├── feed-api.md
│   └── ...
├── architecture/
│   ├── system-architecture.md
│   ├── database-schema.md
│   ├── microservices-communication.md
│   └── security-architecture.md
├── guides/
│   ├── getting-started.md
│   ├── local-development.md
│   ├── deployment-guide.md
│   ├── migration-guide.md
│   └── troubleshooting.md
└── diagrams/
    ├── system-architecture.png
    ├── database-erd.png
    └── auth-flow.png
```

---

## Key Files

### Root `package.json`

```json
{
  "name": "smilefactory-backend",
  "version": "1.0.0",
  "description": "SmileFactory Innovation Ecosystem Backend",
  "scripts": {
    "dev": "docker-compose up",
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "lint": "eslint . --ext .ts",
    "format": "prettier --write \"**/*.ts\"",
    "migrate": "node scripts/migration/run-migration.js",
    "seed": "node scripts/seed/seed-all.js"
  },
  "workspaces": [
    "services/*",
    "shared/*"
  ],
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Root `docker-compose.yml`

```yaml
version: '3.8'

services:
  api-gateway:
    build: ./services/api-gateway
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    env_file:
      - .env
    depends_on:
      - redis
      - auth-service

  auth-service:
    build: ./services/auth-service
    environment:
      - NODE_ENV=development
    env_file:
      - .env
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

volumes:
  redis-data:
```

### Root `.env.example`

```env
# Application
NODE_ENV=development
PORT=3000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=1h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRATION=30d

# Email Service
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-sendgrid-key
EMAIL_FROM=noreply@smilefactory.com

# OTP
OTP_EXPIRATION=300
OTP_MAX_ATTEMPTS=3

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

---

## Best Practices

1. **Consistent Naming:**
   - Use kebab-case for folders and files
   - Use PascalCase for classes
   - Use camelCase for variables and functions

2. **Module Organization:**
   - Each feature should be a module
   - Keep modules focused and cohesive
   - Use barrel exports (index.ts)

3. **Separation of Concerns:**
   - Controllers handle HTTP requests
   - Services contain business logic
   - Repositories handle data access
   - DTOs for data validation

4. **Testing:**
   - Unit tests alongside source files
   - Integration tests in test/ folder
   - E2E tests in root tests/ folder

5. **Documentation:**
   - README.md in each service
   - API documentation with Swagger
   - Architecture diagrams in docs/

---

This folder structure provides a solid foundation for the SmileFactory backend system, ensuring scalability, maintainability, and ease of development.


