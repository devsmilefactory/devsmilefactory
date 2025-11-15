# Repository Structure Guide - SmileFactory
## Detailed Breakdown of Recommended Structure

**Date:** 2025-11-03  
**Purpose:** Guide for understanding and implementing the new repository structure

---

## 📁 Complete Directory Structure

```
smilefactory/
│
├── .gitlab-ci.yml                    # Main CI/CD pipeline
├── .gitignore                        # Git ignore rules
├── docker-compose.yml                # Local development
├── docker-compose.staging.yml        # Staging environment
├── docker-compose.prod.yml           # Production environment
├── .env.example                      # Environment template
├── README.md                         # Project overview
├── LICENSE                           # License file
│
├── frontend/                         # React Application
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── AIChatbot.tsx
│   │   │   ├── AppSidebar.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── ...
│   │   ├── pages/                   # Page components
│   │   │   ├── Feed.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Messages.tsx
│   │   │   └── ...
│   │   ├── stores/                  # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   ├── postsStore.ts
│   │   │   └── ...
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/                     # Utilities
│   │   │   ├── api.ts              # API client
│   │   │   └── utils.ts
│   │   ├── assets/                  # Images, fonts, etc.
│   │   ├── App.tsx                  # Root component
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── public/                      # Static assets
│   │   ├── favicon.ico
│   │   ├── robots.txt
│   │   └── placeholder.svg
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts               # Vite configuration
│   ├── tsconfig.json                # TypeScript config
│   ├── tailwind.config.ts           # Tailwind CSS config
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── Dockerfile                   # Production build
│   ├── Dockerfile.dev               # Development build
│   ├── .htaccess                    # Apache routing
│   ├── nginx.conf                   # Nginx configuration
│   ├── .env.example
│   └── README.md
│
├── backend-nestjs/                  # Node.js/NestJS Backend
│   ├── services/
│   │   ├── api-gateway/            # API Gateway Service
│   │   │   ├── src/
│   │   │   │   ├── modules/
│   │   │   │   │   ├── auth/
│   │   │   │   │   ├── users/
│   │   │   │   │   └── ...
│   │   │   │   ├── middleware/
│   │   │   │   ├── guards/
│   │   │   │   ├── filters/
│   │   │   │   ├── interceptors/
│   │   │   │   ├── app.module.ts
│   │   │   │   └── main.ts
│   │   │   ├── test/
│   │   │   │   ├── unit/
│   │   │   │   ├── integration/
│   │   │   │   └── e2e/
│   │   │   ├── Dockerfile
│   │   │   ├── package.json
│   │   │   ├── tsconfig.json
│   │   │   ├── nest-cli.json
│   │   │   └── README.md
│   │   │
│   │   ├── auth-service/           # Authentication Service
│   │   │   ├── src/
│   │   │   │   ├── modules/
│   │   │   │   │   ├── jwt/
│   │   │   │   │   ├── sessions/
│   │   │   │   │   └── oauth/
│   │   │   │   ├── strategies/
│   │   │   │   ├── app.module.ts
│   │   │   │   └── main.ts
│   │   │   ├── test/
│   │   │   ├── Dockerfile
│   │   │   ├── package.json
│   │   │   └── README.md
│   │   │
│   │   ├── user-service/           # User Management Service
│   │   ├── feed-service/           # Feed & Posts Service
│   │   ├── messaging-service/      # Messaging Service
│   │   ├── connection-service/     # Connections Service
│   │   ├── events-service/         # Events Service
│   │   ├── marketplace-service/    # Marketplace Service
│   │   ├── notification-service/   # Notifications Service
│   │   └── search-service/         # Search Service
│   │
│   ├── shared/                     # Shared code across services
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── enums/
│   │   │   ├── exceptions/
│   │   │   ├── interfaces/
│   │   │   └── utils/
│   │   ├── config/
│   │   │   ├── database.config.ts
│   │   │   ├── redis.config.ts
│   │   │   ├── jwt.config.ts
│   │   │   └── app.config.ts
│   │   ├── database/
│   │   │   ├── prisma/
│   │   │   │   ├── schema.prisma
│   │   │   │   └── migrations/
│   │   │   └── seeds/
│   │   └── types/
│   │       └── index.ts
│   │
│   ├── package.json                # Workspace root
│   ├── package-lock.json
│   ├── tsconfig.json               # Base TypeScript config
│   ├── nest-cli.json
│   ├── .eslintrc.js
│   ├── .prettierrc
│   ├── docker-compose.yml          # Backend-only development
│   ├── .env.example
│   └── README.md
│
├── backend-springboot/             # Java/Spring Boot Backend
│   ├── services/
│   │   ├── api-gateway/           # API Gateway Service
│   │   │   ├── src/
│   │   │   │   ├── main/
│   │   │   │   │   ├── java/
│   │   │   │   │   │   └── com/smilefactory/gateway/
│   │   │   │   │   │       ├── config/
│   │   │   │   │   │       ├── controller/
│   │   │   │   │   │       ├── service/
│   │   │   │   │   │       ├── filter/
│   │   │   │   │   │       └── GatewayApplication.java
│   │   │   │   │   └── resources/
│   │   │   │   │       ├── application.yml
│   │   │   │   │       ├── application-dev.yml
│   │   │   │   │       ├── application-prod.yml
│   │   │   │   │       └── logback-spring.xml
│   │   │   │   └── test/
│   │   │   │       └── java/
│   │   │   ├── Dockerfile
│   │   │   ├── pom.xml
│   │   │   └── README.md
│   │   │
│   │   ├── auth-service/          # Authentication Service
│   │   ├── user-service/          # User Management Service
│   │   ├── feed-service/          # Feed & Posts Service
│   │   ├── messaging-service/     # Messaging Service
│   │   ├── connection-service/    # Connections Service
│   │   ├── events-service/        # Events Service
│   │   ├── marketplace-service/   # Marketplace Service
│   │   ├── notification-service/  # Notifications Service
│   │   └── search-service/        # Search Service
│   │
│   ├── shared/                    # Shared Java code
│   │   ├── common/
│   │   │   ├── src/main/java/com/smilefactory/common/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   ├── exception/
│   │   │   │   ├── util/
│   │   │   │   └── constant/
│   │   │   └── pom.xml
│   │   ├── config/
│   │   │   ├── src/main/java/com/smilefactory/config/
│   │   │   │   ├── DatabaseConfig.java
│   │   │   │   ├── RedisConfig.java
│   │   │   │   └── SecurityConfig.java
│   │   │   └── pom.xml
│   │   └── models/
│   │       └── pom.xml
│   │
│   ├── pom.xml                    # Parent POM
│   ├── .gitignore
│   ├── docker-compose.yml
│   ├── .env.example
│   └── README.md
│
├── infrastructure/                # DevOps & Infrastructure as Code
│   ├── docker/
│   │   ├── frontend/
│   │   │   ├── Dockerfile.dev
│   │   │   ├── Dockerfile.prod
│   │   │   └── nginx.conf
│   │   ├── nestjs/
│   │   │   ├── Dockerfile.dev
│   │   │   └── Dockerfile.prod
│   │   ├── springboot/
│   │   │   ├── Dockerfile.dev
│   │   │   └── Dockerfile.prod
│   │   ├── nginx/
│   │   │   ├── Dockerfile
│   │   │   ├── nginx.conf
│   │   │   └── ssl/
│   │   └── redis/
│   │       └── redis.conf
│   │
│   ├── kubernetes/                # Kubernetes manifests
│   │   ├── base/
│   │   │   ├── namespace.yaml
│   │   │   ├── configmap.yaml
│   │   │   ├── secrets.yaml
│   │   │   ├── redis-deployment.yaml
│   │   │   ├── redis-service.yaml
│   │   │   └── postgres-deployment.yaml
│   │   └── overlays/
│   │       ├── dev/
│   │       │   ├── kustomization.yaml
│   │       │   └── patches/
│   │       ├── staging/
│   │       │   ├── kustomization.yaml
│   │       │   └── patches/
│   │       └── prod/
│   │           ├── kustomization.yaml
│   │           ├── patches/
│   │           └── ingress.yaml
│   │
│   ├── terraform/                 # Infrastructure as Code
│   │   ├── modules/
│   │   │   ├── vpc/
│   │   │   ├── compute/
│   │   │   ├── database/
│   │   │   ├── redis/
│   │   │   └── monitoring/
│   │   ├── environments/
│   │   │   ├── dev/
│   │   │   │   ├── main.tf
│   │   │   │   ├── variables.tf
│   │   │   │   └── outputs.tf
│   │   │   ├── staging/
│   │   │   └── prod/
│   │   └── README.md
│   │
│   └── scripts/
│       ├── setup-server.sh        # Server initialization
│       ├── deploy-dev.sh          # Deploy to dev
│       ├── deploy-staging.sh      # Deploy to staging
│       ├── deploy-prod.sh         # Deploy to production
│       ├── rollback.sh            # Rollback deployment
│       ├── backup-db.sh           # Database backup
│       ├── restore-db.sh          # Database restore
│       └── health-check.sh        # Health check script
│
├── shared/                        # Cross-stack shared resources
│   ├── api-contracts/
│   │   ├── openapi/              # OpenAPI 3.0 specifications
│   │   │   ├── auth.yaml
│   │   │   ├── users.yaml
│   │   │   ├── feed.yaml
│   │   │   ├── messaging.yaml
│   │   │   ├── events.yaml
│   │   │   └── marketplace.yaml
│   │   └── postman/              # Postman collections
│   │       ├── collections/
│   │       └── environments/
│   ├── proto/                    # gRPC Protocol Buffers (if used)
│   │   ├── auth.proto
│   │   ├── users.proto
│   │   └── ...
│   └── docs/
│       ├── architecture/
│       │   ├── system-design.md
│       │   ├── database-schema.md
│       │   ├── api-design.md
│       │   └── diagrams/
│       ├── api/
│       │   ├── authentication.md
│       │   ├── users.md
│       │   └── ...
│       └── deployment/
│           ├── local-setup.md
│           ├── staging-deployment.md
│           └── production-deployment.md
│
└── deployment/                   # Legacy deployment configs (archive)
    └── legacy/
        ├── Dockerfile
        ├── Dockerfile-lab
        ├── .gitlab-ci.yml
        └── README.md
```

---

## 🎯 Key Principles

### 1. Separation of Concerns
- **Frontend:** Isolated in `/frontend` with its own dependencies
- **Backends:** Separate folders for NestJS and Spring Boot
- **Infrastructure:** Centralized DevOps configurations
- **Shared:** Common resources accessible to all

### 2. Consistency
- Each microservice follows the same structure
- Naming conventions are uniform
- Configuration patterns are standardized

### 3. Scalability
- Easy to add new microservices
- Infrastructure scales independently
- Clear boundaries between components

### 4. Developer Experience
- Single repository clone
- Clear navigation
- Comprehensive documentation
- Automated tooling

---

## 📝 File Naming Conventions

### TypeScript/JavaScript
- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Stores: `camelCase.ts` with `Store` suffix (e.g., `authStore.ts`)
- Tests: `*.test.ts` or `*.spec.ts`

### Java
- Classes: `PascalCase.java` (e.g., `UserService.java`)
- Interfaces: `PascalCase.java` with `I` prefix (e.g., `IUserRepository.java`)
- Tests: `*Test.java` (e.g., `UserServiceTest.java`)

### Configuration
- Docker: `Dockerfile`, `Dockerfile.dev`, `Dockerfile.prod`
- Compose: `docker-compose.yml`, `docker-compose.{env}.yml`
- Environment: `.env`, `.env.example`, `.env.{env}`

---

## 🔄 Migration from Current Structure

### Current → New Mapping

| Current Location | New Location | Action |
|-----------------|--------------|--------|
| `/src/*` | `/frontend/src/*` | Move |
| `/public/*` | `/frontend/public/*` | Move |
| `/package.json` | `/frontend/package.json` | Move |
| `/vite.config.ts` | `/frontend/vite.config.ts` | Move |
| `/backend/*` | `/backend-nestjs/*` | Move |
| `/deployment/*` | `/deployment/legacy/*` | Archive |
| `/deploy.sh` | `/infrastructure/scripts/deploy-frontend.sh` | Move & Rename |

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-03


