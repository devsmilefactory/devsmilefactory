# Social Collaboration Platform - Specifications

This directory contains detailed specifications for all microservices in the social collaboration platform. Each spec follows a structured workflow: Requirements → Design → Implementation Tasks.

## Architecture Overview

The platform is built using:
- **Frontend**: React (already mocked/implemented)
- **Backend**: NestJS + TypeScript microservices with hexagonal architecture
- **Database**: PostgreSQL with TypeORM
- **Cache/Queue**: Redis for caching, sessions, and pub/sub
- **Auth**: Supabase Auth for passwordless OTP authentication
- **API Gateway**: NestJS BFF pattern for unified frontend API

**Design Philosophy**: Built with Spring Boot patterns (DI, modules, controllers, services) to facilitate future migration to Java/Spring Boot while starting with Node.js/NestJS.

## Service Specifications

### 1. Authentication & Account Management
**Path**: `.kiro/specs/auth-and-account-management/`
**Status**: ✅ Requirements, Design, and Tasks Complete

**Responsibilities**:
- Passwordless OTP authentication via Supabase
- Account creation and session management
- Token validation and refresh
- Account synchronization between Supabase and platform database

**Key Endpoints**:
- `POST /auth/request-otp` - Request OTP for sign-in/sign-up
- `POST /auth/verify-otp` - Verify OTP and get tokens
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout and invalidate session
- `GET /auth/me` - Get current user profile

**Dependencies**: Supabase Auth, Redis, PostgreSQL

---

### 2. Profiles & Directory
**Path**: `.kiro/specs/profiles-and-directory/`
**Status**: ✅ Requirements, Design, and Tasks Complete

**Responsibilities**:
- Multiple profile management per account (Innovator, Investor, Mentor, etc.)
- Profile CRUD operations
- Profile directory with search and filtering
- Profile visibility controls

**Key Endpoints**:
- `POST /profiles/bulk-create` - Create multiple profiles during onboarding
- `GET /profiles/me` - Get all profiles for authenticated user
- `POST /profiles/switch` - Switch active profile
- `PATCH /profiles/:id` - Update profile
- `GET /profiles/directory` - Browse profile directory with filters
- `GET /profiles/:id` - View profile details

**Dependencies**: PostgreSQL, Redis

---

### 3. Posts & Feeds
**Path**: `.kiro/specs/posts-and-feeds/`
**Status**: ✅ Requirements Complete (Design and Tasks Pending)

**Responsibilities**:
- Post CRUD for multiple content types (blog, event, marketplace, group_post, general_update)
- Unified feed generation
- Specialized tab feeds (blog, events, marketplace, groups)
- Post visibility controls

**Key Endpoints**:
- `POST /posts` - Create post
- `GET /posts/:id` - Get post details
- `PATCH /posts/:id` - Update post
- `DELETE /posts/:id` - Archive post
- `GET /feed` - Get feed with tab filtering

**Dependencies**: PostgreSQL, Redis

---

### 4. Interactions & Connect
**Path**: `.kiro/specs/interactions-and-connect/`
**Status**: ✅ Requirements Complete (Design and Tasks Pending)

**Responsibilities**:
- Post interactions (like, comment, share, save)
- Connection requests and management (LinkedIn-style)
- Engagement count aggregation
- Interaction state tracking

**Key Endpoints**:
- `POST /posts/:id/like` - Toggle like on post
- `POST /posts/:id/comments` - Create comment
- `POST /posts/:id/share` - Share post
- `POST /posts/:id/save` - Toggle save on post
- `POST /connections` - Send connection request
- `POST /connections/:id/accept` - Accept connection
- `GET /connections` - List connections

**Dependencies**: PostgreSQL, Redis

---

### 5. Notifications
**Path**: `.kiro/specs/notifications/`
**Status**: ✅ Requirements Complete (Design and Tasks Pending)

**Responsibilities**:
- Domain event consumption via Redis pub/sub
- Notification generation and storage
- Real-time notification delivery via WebSocket
- Unread count tracking

**Key Endpoints**:
- `GET /notifications` - List notifications
- `POST /notifications/:id/read` - Mark notification as read
- `POST /notifications/read-all` - Mark all as read
- `GET /notifications/unread-count` - Get unread count
- `WS /notifications/ws` - WebSocket for real-time notifications

**Dependencies**: PostgreSQL, Redis, WebSocket

---

### 6. Search & Filter
**Path**: `.kiro/specs/search-and-filter/`
**Status**: ✅ Requirements Complete (Design and Tasks Pending)

**Responsibilities**:
- Global full-text search across posts, profiles, events, marketplace, groups
- Search index synchronization via domain events
- Faceted search with filters
- Autocomplete suggestions

**Key Endpoints**:
- `GET /search` - Global search with filters
- `GET /search/autocomplete` - Search suggestions
- `GET /search/facets` - Get available facets

**Dependencies**: PostgreSQL (full-text search) or Elasticsearch, Redis

---

### 7. Messaging & Chat
**Path**: `.kiro/specs/messaging-and-chat/`
**Status**: ✅ Requirements Complete (Design and Tasks Pending)

**Responsibilities**:
- 1:1 and group messaging
- Real-time message delivery via WebSocket
- Message history and search
- Read receipts and typing indicators
- Online/offline status

**Key Endpoints**:
- `POST /conversations` - Create conversation
- `GET /conversations` - List conversations
- `POST /conversations/:id/messages` - Send message
- `GET /conversations/:id/messages` - Get message history
- `POST /conversations/:id/read` - Mark messages as read
- `WS /messaging/ws` - WebSocket for real-time messaging

**Dependencies**: PostgreSQL, Redis, WebSocket

---

### 8. API Gateway / BFF
**Path**: `.kiro/specs/api-gateway/`
**Status**: ✅ Requirements Complete (Design and Tasks Pending)

**Responsibilities**:
- Single entry point for React frontend
- Request routing to microservices
- Authentication and authorization
- Response aggregation for complex screens
- Rate limiting and circuit breaker
- CORS and security headers

**Key Features**:
- Routes all `/auth/*`, `/profiles/*`, `/posts/*`, etc. to appropriate services
- Aggregates responses for complex screens (feed with engagement, profile with connections)
- Validates JWT tokens and adds account/profile headers
- Implements rate limiting (1000 req/hour authenticated, 100 req/hour unauthenticated)
- Proxies WebSocket connections

**Dependencies**: All microservices, Redis

---

## Implementation Priority

Recommended implementation order based on dependencies:

1. **Auth & Account Management** - Foundation for all other services ✅
2. **Profiles & Directory** - Required for user identity ✅
3. **API Gateway** - Single entry point for frontend
4. **Posts & Feeds** - Core content functionality
5. **Interactions & Connect** - Engagement features
6. **Notifications** - User engagement notifications
7. **Search & Filter** - Discovery and findability
8. **Messaging & Chat** - Real-time communication

## Development Workflow

For each service:

1. **Review Requirements** - Ensure all user stories and acceptance criteria are clear
2. **Review Design** - Understand architecture, components, and data models
3. **Execute Tasks** - Follow the implementation plan in tasks.md
4. **Test** - Unit tests for business logic, integration tests for APIs
5. **Document** - Update OpenAPI specs and README

## Getting Started

To begin implementing a service:

1. Navigate to the service spec directory (e.g., `.kiro/specs/auth-and-account-management/`)
2. Read `requirements.md` to understand what needs to be built
3. Read `design.md` to understand how it should be built
4. Open `tasks.md` and start with task 1
5. Use Kiro to execute tasks: Click "Start task" next to each task item

## Architecture Patterns

All services follow these patterns:

### Hexagonal Architecture (Ports & Adapters)
```
Presentation Layer (Controllers, DTOs)
    ↓
Application Layer (Services, Use Cases)
    ↓
Domain Layer (Entities, Value Objects, Ports)
    ↓
Infrastructure Layer (Adapters, Repositories, External Services)
```

### NestJS Module Structure
- **Controllers**: Handle HTTP requests, validate input, return responses
- **Services**: Contain business logic, orchestrate use cases
- **Repositories**: Data access layer, implement domain ports
- **Adapters**: External service integrations (Supabase, Redis, etc.)

### Database Design
- PostgreSQL with TypeORM
- Migrations for schema changes
- Indexes for performance
- Constraints for data integrity

### Event-Driven Communication
- Redis pub/sub for domain events
- Services publish events (PostCreated, ProfileUpdated, etc.)
- Other services subscribe and react (update search index, send notifications, etc.)

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: NestJS 10+
- **Language**: TypeScript 5+
- **Database**: PostgreSQL 15+
- **ORM**: TypeORM 0.3+
- **Cache**: Redis 7+
- **Auth**: Supabase Auth
- **Validation**: class-validator, class-transformer
- **Documentation**: @nestjs/swagger
- **Testing**: Jest (unit), Supertest (integration)

## Environment Setup

Each service requires:
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname

# Redis
REDIS_URL=redis://localhost:6379

# Service Port
PORT=300X

# Environment
NODE_ENV=development|production

# Service-specific variables (see each service's .env.example)
```

## Next Steps

1. ✅ Auth & Account Management - Complete spec, ready for implementation
2. ✅ Profiles & Directory - Complete spec, ready for implementation
3. 🔄 Complete design and tasks for remaining services
4. 🔄 Set up monorepo structure
5. 🔄 Implement services in priority order
6. 🔄 Set up CI/CD pipeline
7. 🔄 Deploy to staging environment

## Questions or Issues?

If you need clarification on any spec or encounter issues during implementation, refer to:
- The PRD document for business context
- The design.md for technical decisions
- The requirements.md for acceptance criteria
- The tasks.md for step-by-step implementation guidance
