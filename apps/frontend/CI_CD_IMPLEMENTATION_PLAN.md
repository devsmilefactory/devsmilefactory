# CI/CD Implementation Plan - SmileFactory
## Comprehensive Guide for Dual Backend Architecture with GitLab CI/CD

**Date:** 2025-11-03  
**Status:** Planning Phase  
**Estimated Timeline:** 3-4 weeks

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Recommended Repository Structure](#recommended-repository-structure)
4. [Backend Architecture Design](#backend-architecture-design)
5. [Docker Configuration](#docker-configuration)
6. [GitLab CI/CD Pipeline](#gitlab-cicd-pipeline)
7. [Local Development Setup](#local-development-setup)
8. [Temporary Hosting Setup](#temporary-hosting-setup)
9. [Migration Path to On-Premises](#migration-path-to-on-premises)
10. [Implementation Phases](#implementation-phases)

---

## 1. Executive Summary

### Objectives
- Implement dual backend architecture (NestJS + Spring Boot)
- Set up GitLab CI/CD for automated builds and deployments
- Enable local development environment mirroring production
- Prepare for on-premises deployment

### Key Decisions
- **Repository Structure:** Monorepo with separate backend folders
- **Primary Backend:** NestJS (current) → Spring Boot (future)
- **Containerization:** Docker + Docker Compose
- **CI/CD Platform:** GitLab CI/CD
- **Caching Layer:** Redis
- **Database:** Supabase (PostgreSQL)

---

## 2. Current State Analysis

### Existing Structure
```
smilefactory/
├── src/                    # React frontend (root level)
├── backend/               # NestJS microservices (partial)
├── deployment/            # Legacy Java deployment configs
│   ├── Dockerfile
│   ├── Dockerfile-lab
│   └── .gitlab-ci.yml    # Java/Maven template
├── deploy.sh             # Frontend Apache deployment
└── package.json          # Frontend dependencies
```

### Findings
✅ **Strengths:**
- Frontend is Apache-ready with deployment scripts
- NestJS backend structure already started (3 services)
- GitLab CI/CD template exists (needs adaptation)
- Docker experience evident from existing configs

⚠️ **Gaps:**
- No unified CI/CD for frontend + backend
- Spring Boot backend not yet implemented
- No local development orchestration
- Missing infrastructure-as-code
- No API contract management

---

## 3. Recommended Repository Structure

### 🎯 Proposed Monorepo Structure

```
smilefactory/
│
├── .gitlab-ci.yml                    # 🔴 Main CI/CD pipeline
├── docker-compose.yml                # 🔴 Local development
├── docker-compose.prod.yml           # 🔴 Production setup
├── .env.example                      # Environment template
├── README.md                         # Project overview
│
├── frontend/                         # 🔴 React Application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/
│   │   ├── hooks/
│   │   └── lib/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── Dockerfile                    # Frontend container
│   ├── .htaccess                     # Apache routing
│   └── nginx.conf                    # Nginx alternative
│
├── backend-nestjs/                   # 🔴 Node.js Backend
│   ├── services/
│   │   ├── api-gateway/
│   │   │   ├── src/
│   │   │   ├── test/
│   │   │   ├── Dockerfile
│   │   │   └── package.json
│   │   ├── auth-service/
│   │   ├── user-service/
│   │   ├── feed-service/
│   │   ├── messaging-service/
│   │   ├── connection-service/
│   │   ├── events-service/
│   │   ├── marketplace-service/
│   │   └── notification-service/
│   ├── shared/
│   │   ├── common/                   # Shared utilities
│   │   ├── config/                   # Configuration
│   │   ├── database/                 # DB schemas
│   │   └── types/                    # TypeScript types
│   ├── package.json                  # Workspace root
│   ├── nest-cli.json
│   ├── tsconfig.json
│   └── docker-compose.yml            # Backend-only dev
│
├── backend-springboot/               # 🔴 Java Backend (NEW)
│   ├── services/
│   │   ├── api-gateway/
│   │   │   ├── src/main/java/
│   │   │   ├── src/main/resources/
│   │   │   ├── src/test/java/
│   │   │   ├── Dockerfile
│   │   │   └── pom.xml
│   │   ├── auth-service/
│   │   ├── user-service/
│   │   ├── feed-service/
│   │   └── ...
│   ├── shared/
│   │   ├── common/
│   │   ├── config/
│   │   └── models/
│   ├── pom.xml                       # Parent POM
│   └── docker-compose.yml
│
├── infrastructure/                   # 🔴 DevOps & IaC
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
│   │   │   └── nginx.conf
│   │   └── redis/
│   │       └── redis.conf
│   │
│   ├── kubernetes/                   # K8s manifests
│   │   ├── base/
│   │   │   ├── namespace.yaml
│   │   │   ├── configmap.yaml
│   │   │   └── secrets.yaml
│   │   └── overlays/
│   │       ├── dev/
│   │       ├── staging/
│   │       └── prod/
│   │
│   ├── terraform/                    # Infrastructure as Code
│   │   ├── modules/
│   │   │   ├── vpc/
│   │   │   ├── compute/
│   │   │   └── database/
│   │   └── environments/
│   │       ├── dev/
│   │       ├── staging/
│   │       └── prod/
│   │
│   └── scripts/
│       ├── deploy-dev.sh
│       ├── deploy-staging.sh
│       ├── deploy-prod.sh
│       └── rollback.sh
│
├── shared/                           # 🔴 Cross-stack shared
│   ├── api-contracts/
│   │   ├── openapi/
│   │   │   ├── auth.yaml
│   │   │   ├── users.yaml
│   │   │   ├── feed.yaml
│   │   │   └── ...
│   │   └── postman/
│   │       └── collections/
│   ├── proto/                        # gRPC (if needed)
│   └── docs/
│       ├── architecture/
│       ├── api/
│       └── deployment/
│
└── deployment/                       # Legacy configs (archive)
    └── legacy/
        ├── Dockerfile
        ├── Dockerfile-lab
        └── .gitlab-ci.yml
```

### 🔑 Key Structure Benefits

1. **Clear Separation of Concerns**
   - Frontend, backends, and infrastructure are isolated
   - Easy to navigate and understand

2. **Parallel Backend Development**
   - NestJS and Spring Boot can be developed simultaneously
   - Shared API contracts ensure compatibility

3. **Unified Infrastructure**
   - Single source of truth for Docker, K8s, Terraform
   - Reusable across both backends

4. **Scalable CI/CD**
   - Root pipeline orchestrates all builds
   - Service-specific pipelines for granular control

5. **Developer Experience**
   - Single repository clone
   - Consistent tooling and scripts
   - Easy to switch between backends

---

## 4. Backend Architecture Design

### Microservices Overview

Both NestJS and Spring Boot backends will implement the same microservices:

| Service | Port | Responsibility |
|---------|------|----------------|
| **API Gateway** | 3000/8080 | Request routing, rate limiting, auth validation |
| **Auth Service** | 3001/8081 | Authentication, JWT management, sessions |
| **User Service** | 3002/8082 | User profiles, preferences, settings |
| **Feed Service** | 3003/8083 | Posts, comments, likes, shares |
| **Messaging Service** | 3004/8084 | Direct messages, chat rooms |
| **Connection Service** | 3005/8085 | Follow/unfollow, connections |
| **Events Service** | 3006/8086 | Event creation, registration, management |
| **Marketplace Service** | 3007/8087 | Products, transactions, reviews |
| **Notification Service** | 3008/8088 | Push notifications, email, SMS |
| **Search Service** | 3009/8089 | Full-text search, filters |

### Technology Stack Comparison

| Component | NestJS Stack | Spring Boot Stack |
|-----------|--------------|-------------------|
| **Framework** | NestJS 10+ | Spring Boot 3.2+ |
| **Language** | TypeScript | Java 17+ |
| **Runtime** | Node.js 18+ | JVM 17+ |
| **Database ORM** | Prisma / TypeORM | JPA / Hibernate |
| **Validation** | class-validator | Jakarta Validation |
| **API Docs** | Swagger (NestJS) | SpringDoc OpenAPI |
| **Testing** | Jest | JUnit 5 + Mockito |
| **Caching** | ioredis | Spring Data Redis |
| **Message Queue** | Bull (Redis) | RabbitMQ / Kafka |

### Shared Infrastructure

```yaml
# Common services for both backends
services:
  - PostgreSQL (Supabase)
  - Redis (caching + sessions)
  - Nginx (reverse proxy)
  - RabbitMQ (message queue)
  - Elasticsearch (search)
```

---

## 5. Docker Configuration

### 5.1 Frontend Dockerfile

**Location:** `frontend/Dockerfile`

```dockerfile
# Multi-stage build for optimized production image
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy .htaccess equivalent for nginx
COPY infrastructure/docker/frontend/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 5.2 NestJS Service Dockerfile

**Location:** `backend-nestjs/services/*/Dockerfile`

```dockerfile
# Development stage
FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

### 5.3 Spring Boot Service Dockerfile

**Location:** `backend-springboot/services/*/Dockerfile`

```dockerfile
# Build stage
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom files for dependency caching
COPY pom.xml .
COPY services/*/pom.xml ./services/

# Download dependencies
RUN mvn dependency:go-offline

# Copy source code
COPY . .

# Build application
RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy JAR from builder
COPY --from=builder /app/services/*/target/*.jar app.jar

# Add non-root user
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

EXPOSE 8080

ENTRYPOINT ["java", "-Duser.timezone=CAT", "-jar", "app.jar"]
```

### 5.4 Root Docker Compose (Local Development)

**Location:** `docker-compose.yml`

```yaml
version: '3.8'

services:
  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: development
    container_name: smilefactory-frontend
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:3000
    depends_on:
      - api-gateway

  # Redis
  redis:
    image: redis:7-alpine
    container_name: smilefactory-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  # PostgreSQL (local alternative to Supabase)
  postgres:
    image: postgres:15-alpine
    container_name: smilefactory-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: smilefactory
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # NestJS API Gateway
  api-gateway:
    build:
      context: ./backend-nestjs/services/api-gateway
      dockerfile: ../../../infrastructure/docker/nestjs/Dockerfile.dev
    container_name: smilefactory-api-gateway
    ports:
      - "3000:3000"
    env_file:
      - ./backend-nestjs/.env
    environment:
      - NODE_ENV=development
      - REDIS_HOST=redis
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/smilefactory
    volumes:
      - ./backend-nestjs/services/api-gateway:/app
      - /app/node_modules
    depends_on:
      - redis
      - postgres
    command: npm run start:dev

  # NestJS Auth Service
  auth-service:
    build:
      context: ./backend-nestjs/services/auth-service
      dockerfile: ../../../infrastructure/docker/nestjs/Dockerfile.dev
    container_name: smilefactory-auth-service
    ports:
      - "3001:3001"
    env_file:
      - ./backend-nestjs/.env
    environment:
      - NODE_ENV=development
      - REDIS_HOST=redis
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/smilefactory
    volumes:
      - ./backend-nestjs/services/auth-service:/app
      - /app/node_modules
    depends_on:
      - redis
      - postgres
    command: npm run start:dev

  # NestJS User Service
  user-service:
    build:
      context: ./backend-nestjs/services/user-service
      dockerfile: ../../../infrastructure/docker/nestjs/Dockerfile.dev
    container_name: smilefactory-user-service
    ports:
      - "3002:3002"
    env_file:
      - ./backend-nestjs/.env
    environment:
      - NODE_ENV=development
      - REDIS_HOST=redis
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/smilefactory
    volumes:
      - ./backend-nestjs/services/user-service:/app
      - /app/node_modules
    depends_on:
      - redis
      - postgres
    command: npm run start:dev

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: smilefactory-nginx
    ports:
      - "80:80"
    volumes:
      - ./infrastructure/docker/nginx/nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
      - api-gateway

volumes:
  redis_data:
  postgres_data:

networks:
  default:
    name: smilefactory-network
```

---

## 6. GitLab CI/CD Pipeline

### 6.1 Root GitLab CI Configuration

**Location:** `.gitlab-ci.yml`

```yaml
# SmileFactory CI/CD Pipeline
# Supports: Frontend + NestJS Backend + Spring Boot Backend

image: docker:24.0.5

variables:
  # Docker Registry Configuration
  REGISTRY: ${CI_REGISTRY}
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

  # Backend Selection (nestjs or springboot)
  BACKEND_TYPE: "nestjs"

  # Image Tags
  FRONTEND_IMAGE: ${REGISTRY}/smilefactory/frontend
  NESTJS_GATEWAY_IMAGE: ${REGISTRY}/smilefactory/nestjs-api-gateway
  SPRINGBOOT_GATEWAY_IMAGE: ${REGISTRY}/smilefactory/springboot-api-gateway

  # Version Tags
  VERSION_TAG: ${CI_COMMIT_SHORT_SHA}
  LATEST_TAG: latest

services:
  - docker:24.0.5-dind

stages:
  - validate
  - test
  - build
  - containerize
  - deploy-dev
  - deploy-staging
  - deploy-prod

# Global before script
before_script:
  - docker info
  - echo "$CI_REGISTRY_PASSWORD" | docker login -u "$CI_REGISTRY_USER" --password-stdin $CI_REGISTRY

# ==========================================
# STAGE: VALIDATE
# ==========================================

validate:frontend:
  stage: validate
  image: node:18-alpine
  script:
    - cd frontend
    - npm ci
    - npm run lint
  cache:
    key: ${CI_COMMIT_REF_SLUG}-frontend
    paths:
      - frontend/node_modules/
  only:
    changes:
      - frontend/**/*

validate:nestjs:
  stage: validate
  image: node:18-alpine
  script:
    - cd backend-nestjs
    - npm ci
    - npm run lint
  cache:
    key: ${CI_COMMIT_REF_SLUG}-nestjs
    paths:
      - backend-nestjs/node_modules/
  only:
    changes:
      - backend-nestjs/**/*
  rules:
    - if: '$BACKEND_TYPE == "nestjs"'

validate:springboot:
  stage: validate
  image: maven:3.9-eclipse-temurin-17
  script:
    - cd backend-springboot
    - mvn validate
    - mvn checkstyle:check
  cache:
    key: ${CI_COMMIT_REF_SLUG}-springboot
    paths:
      - backend-springboot/.m2/repository/
  only:
    changes:
      - backend-springboot/**/*
  rules:
    - if: '$BACKEND_TYPE == "springboot"'

# ==========================================
# STAGE: TEST
# ==========================================

test:frontend:
  stage: test
  image: node:18-alpine
  script:
    - cd frontend
    - npm ci
    - npm run test -- --coverage
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: frontend/coverage/cobertura-coverage.xml
  only:
    changes:
      - frontend/**/*

test:nestjs:
  stage: test
  image: node:18-alpine
  script:
    - cd backend-nestjs
    - npm ci
    - npm run test:cov
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      junit: backend-nestjs/junit.xml
      coverage_report:
        coverage_format: cobertura
        path: backend-nestjs/coverage/cobertura-coverage.xml
  only:
    changes:
      - backend-nestjs/**/*
  rules:
    - if: '$BACKEND_TYPE == "nestjs"'

test:springboot:
  stage: test
  image: maven:3.9-eclipse-temurin-17
  script:
    - cd backend-springboot
    - mvn test
  artifacts:
    reports:
      junit: backend-springboot/target/surefire-reports/TEST-*.xml
  only:
    changes:
      - backend-springboot/**/*
  rules:
    - if: '$BACKEND_TYPE == "springboot"'

# ==========================================
# STAGE: BUILD
# ==========================================

build:frontend:
  stage: build
  image: node:18-alpine
  script:
    - cd frontend
    - npm ci
    - npm run build
  artifacts:
    paths:
      - frontend/dist/
    expire_in: 1 hour
  only:
    changes:
      - frontend/**/*

build:nestjs:
  stage: build
  image: node:18-alpine
  script:
    - cd backend-nestjs
    - npm ci
    - npm run build
  artifacts:
    paths:
      - backend-nestjs/dist/
    expire_in: 1 hour
  only:
    changes:
      - backend-nestjs/**/*
  rules:
    - if: '$BACKEND_TYPE == "nestjs"'

build:springboot:
  stage: build
  image: maven:3.9-eclipse-temurin-17
  script:
    - cd backend-springboot
    - mvn clean package -DskipTests
  artifacts:
    paths:
      - backend-springboot/services/*/target/*.jar
    expire_in: 1 hour
  only:
    changes:
      - backend-springboot/**/*
  rules:
    - if: '$BACKEND_TYPE == "springboot"'

# ==========================================
# STAGE: CONTAINERIZE
# ==========================================

containerize:frontend:
  stage: containerize
  script:
    - cd frontend
    - docker build -t ${FRONTEND_IMAGE}:${VERSION_TAG} -t ${FRONTEND_IMAGE}:${LATEST_TAG} .
    - docker push ${FRONTEND_IMAGE}:${VERSION_TAG}
    - docker push ${FRONTEND_IMAGE}:${LATEST_TAG}
  dependencies:
    - build:frontend
  only:
    refs:
      - develop
      - staging
      - main
      - master
    changes:
      - frontend/**/*

containerize:nestjs-gateway:
  stage: containerize
  script:
    - cd backend-nestjs/services/api-gateway
    - docker build -t ${NESTJS_GATEWAY_IMAGE}:${VERSION_TAG} -t ${NESTJS_GATEWAY_IMAGE}:${LATEST_TAG} .
    - docker push ${NESTJS_GATEWAY_IMAGE}:${VERSION_TAG}
    - docker push ${NESTJS_GATEWAY_IMAGE}:${LATEST_TAG}
  dependencies:
    - build:nestjs
  only:
    refs:
      - develop
      - staging
      - main
      - master
    changes:
      - backend-nestjs/**/*
  rules:
    - if: '$BACKEND_TYPE == "nestjs"'

containerize:springboot-gateway:
  stage: containerize
  script:
    - cd backend-springboot/services/api-gateway
    - docker build -t ${SPRINGBOOT_GATEWAY_IMAGE}:${VERSION_TAG} -t ${SPRINGBOOT_GATEWAY_IMAGE}:${LATEST_TAG} .
    - docker push ${SPRINGBOOT_GATEWAY_IMAGE}:${VERSION_TAG}
    - docker push ${SPRINGBOOT_GATEWAY_IMAGE}:${LATEST_TAG}
  dependencies:
    - build:springboot
  only:
    refs:
      - develop
      - staging
      - main
      - master
    changes:
      - backend-springboot/**/*
  rules:
    - if: '$BACKEND_TYPE == "springboot"'

# ==========================================
# STAGE: DEPLOY DEV
# ==========================================

deploy:dev:
  stage: deploy-dev
  image: ubuntu:latest
  script:
    - apt-get update && apt-get install -y openssh-client
    - mkdir -p ~/.ssh
    - echo "$DEV_SSH_PRIVATE_KEY" | tr -d '\r' > ~/.ssh/id_rsa
    - chmod 600 ~/.ssh/id_rsa
    - ssh -o StrictHostKeyChecking=no $DEV_SERVER_USER@$DEV_SERVER_HOST "
        cd /srv/smilefactory &&
        docker-compose pull &&
        docker-compose up -d &&
        docker system prune -f
      "
  environment:
    name: development
    url: http://dev.smilefactory.local
  only:
    refs:
      - develop

# ==========================================
# STAGE: DEPLOY STAGING
# ==========================================

deploy:staging:
  stage: deploy-staging
  image: ubuntu:latest
  script:
    - apt-get update && apt-get install -y openssh-client
    - mkdir -p ~/.ssh
    - echo "$STAGING_SSH_PRIVATE_KEY" | tr -d '\r' > ~/.ssh/id_rsa
    - chmod 600 ~/.ssh/id_rsa
    - ssh -o StrictHostKeyChecking=no $STAGING_SERVER_USER@$STAGING_SERVER_HOST "
        cd /srv/smilefactory &&
        docker-compose -f docker-compose.staging.yml pull &&
        docker-compose -f docker-compose.staging.yml up -d &&
        docker system prune -f
      "
  environment:
    name: staging
    url: http://staging.smilefactory.local
  when: manual
  only:
    refs:
      - staging

# ==========================================
# STAGE: DEPLOY PRODUCTION
# ==========================================

deploy:prod:
  stage: deploy-prod
  image: ubuntu:latest
  script:
    - apt-get update && apt-get install -y openssh-client
    - mkdir -p ~/.ssh
    - echo "$PROD_SSH_PRIVATE_KEY" | tr -d '\r' > ~/.ssh/id_rsa
    - chmod 600 ~/.ssh/id_rsa
    - ssh -o StrictHostKeyChecking=no $PROD_SERVER_USER@$PROD_SERVER_HOST "
        cd /srv/smilefactory &&
        docker-compose -f docker-compose.prod.yml pull &&
        docker-compose -f docker-compose.prod.yml up -d &&
        docker system prune -f
      "
  environment:
    name: production
    url: https://smilefactory.com
  when: manual
  only:
    refs:
      - main
      - master
```

### 6.2 GitLab CI/CD Variables

Configure these in GitLab: **Settings → CI/CD → Variables**

| Variable | Description | Example | Protected | Masked |
|----------|-------------|---------|-----------|--------|
| `CI_REGISTRY` | Docker registry URL | `registry.gitlab.com/yourorg/smilefactory` | ✅ | ❌ |
| `CI_REGISTRY_USER` | Registry username | `gitlab-ci-token` | ✅ | ❌ |
| `CI_REGISTRY_PASSWORD` | Registry password | `${CI_JOB_TOKEN}` | ✅ | ✅ |
| `BACKEND_TYPE` | Backend to deploy | `nestjs` or `springboot` | ❌ | ❌ |
| `DEV_SERVER_HOST` | Dev server IP | `10.132.228.90` | ✅ | ❌ |
| `DEV_SERVER_USER` | Dev server user | `deploy` | ✅ | ❌ |
| `DEV_SSH_PRIVATE_KEY` | Dev SSH key | `-----BEGIN RSA...` | ✅ | ✅ |
| `STAGING_SERVER_HOST` | Staging server IP | `10.132.228.91` | ✅ | ❌ |
| `STAGING_SERVER_USER` | Staging user | `deploy` | ✅ | ❌ |
| `STAGING_SSH_PRIVATE_KEY` | Staging SSH key | `-----BEGIN RSA...` | ✅ | ✅ |
| `PROD_SERVER_HOST` | Production server IP | `10.132.228.92` | ✅ | ❌ |
| `PROD_SERVER_USER` | Production user | `deploy` | ✅ | ❌ |
| `PROD_SSH_PRIVATE_KEY` | Production SSH key | `-----BEGIN RSA...` | ✅ | ✅ |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` | ✅ | ❌ |
| `SUPABASE_ANON_KEY` | Supabase anon key | `eyJhbGc...` | ✅ | ✅ |
| `SUPABASE_SERVICE_KEY` | Supabase service key | `eyJhbGc...` | ✅ | ✅ |

---

## 7. Local Development Setup

### 7.1 Prerequisites

```bash
# Required software
- Node.js 18+
- Docker Desktop
- Docker Compose
- Git
- (Optional) Java 17+ for Spring Boot development
- (Optional) Maven 3.9+ for Spring Boot development
```

### 7.2 Initial Setup

```bash
# 1. Clone repository
git clone https://gitlab.com/yourorg/smilefactory.git
cd smilefactory

# 2. Copy environment files
cp .env.example .env
cp frontend/.env.example frontend/.env
cp backend-nestjs/.env.example backend-nestjs/.env

# 3. Configure environment variables
# Edit .env files with your Supabase credentials and other settings

# 4. Install dependencies
cd frontend && npm install && cd ..
cd backend-nestjs && npm install && cd ..

# 5. Start all services
docker-compose up -d

# 6. Verify services are running
docker-compose ps

# 7. Check logs
docker-compose logs -f
```

### 7.3 Development Workflow

```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up frontend
docker-compose up api-gateway

# Rebuild after dependency changes
docker-compose up --build

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# View logs
docker-compose logs -f [service-name]

# Execute commands in container
docker-compose exec api-gateway npm run test
docker-compose exec frontend npm run lint
```

### 7.4 Hot Reload Configuration

All services are configured for hot reload in development:

- **Frontend:** Vite HMR on port 5173
- **NestJS Services:** Nodemon watches for changes
- **Spring Boot:** Spring DevTools (when implemented)

### 7.5 Database Migrations

```bash
# NestJS with Prisma
cd backend-nestjs
npx prisma migrate dev --name init
npx prisma generate
npx prisma studio  # Open database GUI

# Spring Boot with Flyway
cd backend-springboot
mvn flyway:migrate
```

---

## 8. Temporary Hosting Setup

### 8.1 Recommended Hosting Options

For testing before on-premises deployment:

#### Option 1: DigitalOcean Droplet (Recommended)
- **Cost:** $12-24/month
- **Specs:** 2 vCPUs, 4GB RAM, 80GB SSD
- **Setup Time:** 30 minutes
- **Pros:** Simple, affordable, good for testing
- **Cons:** Not production-grade

#### Option 2: AWS EC2
- **Cost:** ~$20-40/month (t3.medium)
- **Specs:** 2 vCPUs, 4GB RAM
- **Setup Time:** 1 hour
- **Pros:** Scalable, mirrors enterprise setup
- **Cons:** More complex, higher cost

#### Option 3: Hetzner Cloud
- **Cost:** €8-16/month
- **Specs:** 2 vCPUs, 4GB RAM, 40GB SSD
- **Setup Time:** 30 minutes
- **Pros:** Cheapest, good performance
- **Cons:** EU-based (may have latency)

### 8.2 Server Setup Script

```bash
#!/bin/bash
# setup-server.sh - Automated server setup

set -e

echo "🚀 SmileFactory Server Setup"
echo "=============================="

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo "🔧 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
echo "📚 Installing Git..."
sudo apt-get install -y git

# Create deployment directory
echo "📁 Creating deployment directory..."
sudo mkdir -p /srv/smilefactory
sudo chown $USER:$USER /srv/smilefactory

# Configure firewall
echo "🔒 Configuring firewall..."
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw --force enable

# Install Nginx (reverse proxy)
echo "🌐 Installing Nginx..."
sudo apt-get install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Install Certbot (SSL certificates)
echo "🔐 Installing Certbot..."
sudo apt-get install -y certbot python3-certbot-nginx

echo "✅ Server setup complete!"
echo ""
echo "Next steps:"
echo "1. Clone repository: git clone <repo-url> /srv/smilefactory"
echo "2. Configure environment: cp .env.example .env"
echo "3. Start services: docker-compose up -d"
echo "4. Setup SSL: sudo certbot --nginx -d yourdomain.com"
```

### 8.3 Deployment to Temporary Server

```bash
# On your local machine

# 1. SSH into server
ssh deploy@your-server-ip

# 2. Clone repository
cd /srv
git clone https://gitlab.com/yourorg/smilefactory.git
cd smilefactory

# 3. Configure environment
cp .env.example .env
nano .env  # Edit with your credentials

# 4. Pull Docker images
docker-compose pull

# 5. Start services
docker-compose -f docker-compose.prod.yml up -d

# 6. Check status
docker-compose ps
docker-compose logs -f

# 7. Setup SSL (if domain configured)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 9. Migration Path to On-Premises

### 9.1 Pre-Migration Checklist

- [ ] On-premises infrastructure ready (servers, network, storage)
- [ ] Docker/Kubernetes installed on on-premises servers
- [ ] Network connectivity verified
- [ ] SSL certificates obtained
- [ ] Database backup strategy in place
- [ ] Monitoring and logging configured
- [ ] Disaster recovery plan documented

### 9.2 Migration Strategy

#### Phase 1: Infrastructure Preparation (Week 1)
```bash
# On-premises server setup
1. Install Docker and Docker Compose
2. Configure network (VPN, firewall rules)
3. Set up private Docker registry
4. Configure persistent storage (NFS/SAN)
5. Install monitoring tools (Prometheus, Grafana)
```

#### Phase 2: Database Migration (Week 2)
```bash
# Option A: Supabase to On-Premises PostgreSQL
1. Export Supabase data
   pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql

2. Import to on-premises PostgreSQL
   psql -h on-prem-db-server -U postgres -d smilefactory < backup.sql

3. Update connection strings in .env files

# Option B: Continue using Supabase (hybrid approach)
1. Keep Supabase for database
2. Host application on-premises
3. Ensure network connectivity to Supabase
```

#### Phase 3: Application Deployment (Week 3)
```bash
# Deploy to on-premises Kubernetes cluster

1. Create namespace
kubectl create namespace smilefactory

2. Apply configurations
kubectl apply -f infrastructure/kubernetes/base/
kubectl apply -f infrastructure/kubernetes/overlays/prod/

3. Verify deployments
kubectl get pods -n smilefactory
kubectl get services -n smilefactory

4. Configure ingress
kubectl apply -f infrastructure/kubernetes/ingress/
```

#### Phase 4: Testing & Validation (Week 4)
```bash
# Comprehensive testing
1. Smoke tests
2. Load testing
3. Security scanning
4. Backup/restore testing
5. Failover testing
```

#### Phase 5: Cutover (Week 5)
```bash
# Production cutover
1. Schedule maintenance window
2. Final data sync
3. Update DNS records
4. Monitor closely for 48 hours
5. Decommission temporary hosting
```

### 9.3 Rollback Plan

```bash
# If issues occur during migration

# Quick rollback to temporary hosting
1. Revert DNS changes
2. Restart services on temporary server
3. Verify functionality
4. Investigate on-premises issues

# Database rollback
1. Restore from backup
2. Replay transaction logs
3. Verify data integrity
```

---

## 10. Implementation Phases

### 📅 Phase 1: Repository Restructuring (Days 1-3)

**Objective:** Reorganize codebase to support dual backend architecture

**Tasks:**
- [ ] Create new directory structure
- [ ] Move frontend code to `/frontend`
- [ ] Move backend code to `/backend-nestjs`
- [ ] Create `/backend-springboot` skeleton
- [ ] Set up `/infrastructure` folder
- [ ] Create `/shared` for API contracts
- [ ] Update all import paths
- [ ] Test that existing code still works

**Deliverables:**
- ✅ New repository structure
- ✅ Updated documentation
- ✅ Working frontend and NestJS backend

**Commands:**
```bash
# Backup current state
git checkout -b backup/pre-restructure
git push origin backup/pre-restructure

# Create restructure branch
git checkout -b feature/repository-restructure

# Execute restructuring (see detailed script below)
./scripts/restructure-repository.sh

# Test
npm run test
docker-compose up

# Commit and push
git add .
git commit -m "feat: restructure repository for dual backend architecture"
git push origin feature/repository-restructure
```

---

### 📅 Phase 2: Infrastructure Setup (Days 4-7)

**Objective:** Create Docker configurations and local development environment

**Tasks:**
- [ ] Create Dockerfiles for all services
- [ ] Set up root `docker-compose.yml`
- [ ] Configure Redis and PostgreSQL
- [ ] Create development environment files
- [ ] Set up Nginx reverse proxy
- [ ] Configure hot reload for development
- [ ] Document local setup process

**Deliverables:**
- ✅ Working Docker Compose setup
- ✅ All services running locally
- ✅ Hot reload functional
- ✅ Developer documentation

**Testing:**
```bash
# Start all services
docker-compose up

# Verify each service
curl http://localhost:5173  # Frontend
curl http://localhost:3000/health  # API Gateway
curl http://localhost:3001/health  # Auth Service

# Test hot reload
# Make a change to frontend code
# Verify browser auto-refreshes
```

---

### 📅 Phase 3: GitLab CI/CD Implementation (Days 8-11)

**Objective:** Automate build, test, and deployment pipelines

**Tasks:**
- [ ] Create root `.gitlab-ci.yml`
- [ ] Configure GitLab variables
- [ ] Set up Docker registry
- [ ] Create build jobs for frontend
- [ ] Create build jobs for NestJS
- [ ] Create test jobs
- [ ] Create containerization jobs
- [ ] Create deployment jobs
- [ ] Test pipeline on feature branch

**Deliverables:**
- ✅ Working CI/CD pipeline
- ✅ Automated tests
- ✅ Docker images in registry
- ✅ Deployment automation

**GitLab Setup:**
```bash
# 1. Create GitLab project
# 2. Add repository
git remote add gitlab https://gitlab.com/yourorg/smilefactory.git
git push gitlab main

# 3. Configure CI/CD variables (see section 6.2)
# 4. Push to trigger pipeline
git push gitlab feature/ci-cd-setup

# 5. Monitor pipeline
# Visit: https://gitlab.com/yourorg/smilefactory/-/pipelines
```

---

### 📅 Phase 4: Spring Boot Backend Development (Days 12-26)

**Objective:** Implement Java/Spring Boot backend matching NestJS functionality

**Tasks:**
- [ ] Set up Spring Boot project structure
- [ ] Create parent POM configuration
- [ ] Implement API Gateway service
- [ ] Implement Auth Service
- [ ] Implement User Service
- [ ] Implement Feed Service
- [ ] Implement Messaging Service
- [ ] Implement other microservices
- [ ] Add Redis integration
- [ ] Add database integration
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Document API endpoints

**Deliverables:**
- ✅ Complete Spring Boot backend
- ✅ API parity with NestJS
- ✅ Comprehensive tests
- ✅ API documentation

**Service Template (Spring Boot):**
```java
// Example: User Service
@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody CreateUserDto dto) {
        return ResponseEntity.ok(userService.create(dto));
    }
}
```

---

### 📅 Phase 5: Temporary Hosting Setup (Days 27-30)

**Objective:** Deploy to temporary infrastructure for testing

**Tasks:**
- [ ] Provision cloud server (DigitalOcean/AWS/Hetzner)
- [ ] Run server setup script
- [ ] Configure DNS (if applicable)
- [ ] Deploy application
- [ ] Set up SSL certificates
- [ ] Configure monitoring
- [ ] Test deployment
- [ ] Document deployment process

**Deliverables:**
- ✅ Running application on temporary server
- ✅ SSL configured
- ✅ Monitoring active
- ✅ Deployment documentation

**Deployment Commands:**
```bash
# On temporary server
cd /srv/smilefactory

# Pull latest code
git pull origin main

# Pull Docker images
docker-compose -f docker-compose.prod.yml pull

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Verify
docker-compose ps
curl https://yourdomain.com/health
```

---

### 📅 Phase 6: Testing & Optimization (Days 31-35)

**Objective:** Comprehensive testing and performance optimization

**Tasks:**
- [ ] Load testing
- [ ] Security testing
- [ ] Performance profiling
- [ ] Database query optimization
- [ ] Caching strategy refinement
- [ ] Error handling improvements
- [ ] Logging enhancements
- [ ] Documentation updates

**Deliverables:**
- ✅ Load test results
- ✅ Security audit report
- ✅ Performance benchmarks
- ✅ Optimized application

**Testing Tools:**
```bash
# Load testing with k6
k6 run infrastructure/scripts/load-test.js

# Security scanning
docker run --rm -v $(pwd):/src aquasec/trivy fs /src

# Performance profiling
npm run profile
```

---

## 📊 Success Metrics

### Development Metrics
- [ ] All services start successfully with `docker-compose up`
- [ ] Hot reload works for frontend and backend
- [ ] All tests pass locally
- [ ] Code coverage > 80%

### CI/CD Metrics
- [ ] Pipeline completes in < 15 minutes
- [ ] All stages pass successfully
- [ ] Docker images build correctly
- [ ] Automated deployment works

### Deployment Metrics
- [ ] Application accessible via HTTPS
- [ ] All API endpoints respond correctly
- [ ] Database connections stable
- [ ] Redis caching functional
- [ ] Monitoring dashboards active

### Performance Metrics
- [ ] Page load time < 2 seconds
- [ ] API response time < 200ms (p95)
- [ ] Database query time < 50ms (p95)
- [ ] Concurrent users supported: 100+

---

## 🔧 Troubleshooting

### Common Issues

#### Issue: Docker containers won't start
```bash
# Solution
docker-compose down -v
docker system prune -a
docker-compose up --build
```

#### Issue: Port already in use
```bash
# Find process using port
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill process or change port in docker-compose.yml
```

#### Issue: Database connection failed
```bash
# Check database is running
docker-compose ps postgres

# Check connection string
echo $DATABASE_URL

# Test connection
docker-compose exec postgres psql -U postgres -d smilefactory
```

#### Issue: GitLab pipeline fails
```bash
# Check GitLab CI/CD variables are set
# Verify Docker registry credentials
# Check .gitlab-ci.yml syntax
# Review pipeline logs in GitLab UI
```

---

## 📚 Additional Resources

### Documentation
- [NestJS Documentation](https://docs.nestjs.com/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Docker Documentation](https://docs.docker.com/)
- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

### Tools
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Postman](https://www.postman.com/) - API testing
- [k6](https://k6.io/) - Load testing
- [Lens](https://k8slens.dev/) - Kubernetes IDE

---

## 📞 Support & Next Steps

### Immediate Next Steps

1. **Review this plan** with your team
2. **Set up GitLab repository** if not already done
3. **Provision temporary hosting** (DigitalOcean recommended)
4. **Begin Phase 1** (Repository Restructuring)

### Questions to Address

- [ ] Which backend should we prioritize? (NestJS or Spring Boot)
- [ ] Do we have access to on-premises infrastructure yet?
- [ ] What is the timeline for on-premises migration?
- [ ] Do we need Kubernetes or is Docker Compose sufficient?
- [ ] What monitoring/logging tools are preferred?

---

**Document Version:** 1.0
**Last Updated:** 2025-11-03
**Author:** SmileFactory DevOps Team
**Status:** Ready for Implementation


