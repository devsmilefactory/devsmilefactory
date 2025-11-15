# SmileFactory Backend - Complete Dependencies List

This document contains all the dependencies needed for the SmileFactory backend system.

---

## 🌍 Global Dependencies (Install First)

Run these commands to install global tools:

```bash
# Install NestJS CLI globally
npm install -g @nestjs/cli

# Install Supabase CLI globally
npm install -g supabase

# Verify installations
nest --version
supabase --version
```

---

## 📦 Backend Root `package.json`

Location: `backend/package.json`

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

---

## 🔧 API Gateway Service Dependencies

Location: `backend/services/api-gateway/package.json`

```json
{
  "name": "@smilefactory/api-gateway",
  "version": "1.0.0",
  "description": "API Gateway Service",
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "build": "nest build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"
  },
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/platform-express": "^10.3.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/swagger": "^7.1.17",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/axios": "^3.0.1",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "rxjs": "^7.8.1",
    "reflect-metadata": "^0.1.14",
    "ioredis": "^5.3.2",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.2.1",
    "@nestjs/schematics": "^10.0.3",
    "@nestjs/testing": "^10.3.0",
    "@types/express": "^4.17.21",
    "@types/passport-jwt": "^4.0.0",
    "@types/jest": "^29.5.11",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.3.0"
  }
}
```

---

## 🔐 Auth Service Dependencies

Location: `backend/services/auth-service/package.json`

```json
{
  "name": "@smilefactory/auth-service",
  "version": "1.0.0",
  "description": "Authentication Service",
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "build": "nest build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"
  },
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/platform-express": "^10.3.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/swagger": "^7.1.17",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "@supabase/supabase-js": "^2.39.0",
    "@sendgrid/mail": "^7.7.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "rxjs": "^7.8.1",
    "reflect-metadata": "^0.1.14",
    "ioredis": "^5.3.2",
    "bcrypt": "^5.1.1",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.2.1",
    "@nestjs/schematics": "^10.0.3",
    "@nestjs/testing": "^10.3.0",
    "@types/express": "^4.17.21",
    "@types/passport-jwt": "^4.0.0",
    "@types/bcrypt": "^5.0.2",
    "@types/uuid": "^9.0.7",
    "@types/jest": "^29.5.11",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.3.0"
  }
}
```

---

## 👤 User Service Dependencies

Location: `backend/services/user-service/package.json`

```json
{
  "name": "@smilefactory/user-service",
  "version": "1.0.0",
  "description": "User Profile Service",
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "build": "nest build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"
  },
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/platform-express": "^10.3.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/swagger": "^7.1.17",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "@supabase/supabase-js": "^2.39.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "rxjs": "^7.8.1",
    "reflect-metadata": "^0.1.14",
    "ioredis": "^5.3.2",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.2.1",
    "@nestjs/schematics": "^10.0.3",
    "@nestjs/testing": "^10.3.0",
    "@types/express": "^4.17.21",
    "@types/passport-jwt": "^4.0.0",
    "@types/uuid": "^9.0.7",
    "@types/jest": "^29.5.11",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.3.0"
  }
}
```

---

## 📝 Complete Dependency Summary

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| @nestjs/common | ^10.3.0 | NestJS core functionality |
| @nestjs/core | ^10.3.0 | NestJS core |
| @nestjs/platform-express | ^10.3.0 | Express platform |
| @nestjs/config | ^3.1.1 | Configuration management |
| @nestjs/swagger | ^7.1.17 | API documentation |
| @nestjs/jwt | ^10.2.0 | JWT authentication |
| @nestjs/passport | ^10.0.3 | Passport integration |
| @nestjs/axios | ^3.0.1 | HTTP client |
| @supabase/supabase-js | ^2.39.0 | Supabase client |
| @sendgrid/mail | ^7.7.0 | Email service |
| passport | ^0.7.0 | Authentication middleware |
| passport-jwt | ^4.0.1 | JWT strategy |
| class-validator | ^0.14.0 | Validation |
| class-transformer | ^0.5.1 | Transformation |
| rxjs | ^7.8.1 | Reactive programming |
| reflect-metadata | ^0.1.14 | Metadata reflection |
| ioredis | ^5.3.2 | Redis client |
| bcrypt | ^5.1.1 | Password hashing |
| uuid | ^9.0.1 | UUID generation |
| axios | ^1.6.2 | HTTP requests |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| @nestjs/cli | ^10.2.1 | NestJS CLI |
| @nestjs/schematics | ^10.0.3 | Code generation |
| @nestjs/testing | ^10.3.0 | Testing utilities |
| @types/express | ^4.17.21 | Express types |
| @types/passport-jwt | ^4.0.0 | Passport JWT types |
| @types/bcrypt | ^5.0.2 | Bcrypt types |
| @types/uuid | ^9.0.7 | UUID types |
| @types/node | ^20.10.0 | Node.js types |
| @types/jest | ^29.5.11 | Jest types |
| typescript | ^5.3.0 | TypeScript compiler |
| jest | ^29.7.0 | Testing framework |
| ts-jest | ^29.1.1 | TypeScript Jest |
| ts-node | ^10.9.2 | TypeScript execution |
| tsconfig-paths | ^4.2.0 | Path mapping |
| prettier | ^3.1.0 | Code formatter |
| eslint | ^8.55.0 | Linter |
| @typescript-eslint/eslint-plugin | ^6.15.0 | TypeScript ESLint |
| @typescript-eslint/parser | ^6.15.0 | TypeScript parser |

---

## 🚀 Installation Instructions

### Step 1: Install Global Tools

```bash
npm install -g @nestjs/cli supabase
```

### Step 2: Create Backend Directory

```bash
cd c:\Users\Public\Documents\newsmilefactory_connect\smilefactory
mkdir backend
cd backend
```

### Step 3: Initialize Root Package

```bash
# Create package.json (I will provide this file)
npm install
```

### Step 4: Install All Workspace Dependencies

```bash
# After folder structure is created
npm install --workspaces
```

---

## ✅ Verification Commands

After installation, verify everything is working:

```bash
# Check NestJS CLI
nest --version

# Check Supabase CLI
supabase --version

# Check Node.js
node --version

# Check npm
npm --version

# List installed packages
npm list --depth=0
```

---

## 📋 Next Steps

1. ✅ Install global tools (`npm install -g @nestjs/cli supabase`)
2. ⏳ Wait for backend folder structure creation
3. ⏳ Run `npm install` in backend directory
4. ⏳ Configure `.env` file with Supabase credentials
5. ⏳ Start development with `npm run dev`

---

**Ready to install? Run the global tools command first, then let me know!** 🚀


