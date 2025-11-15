# SmileFactory Backend System - Comprehensive Implementation Plan

**Version:** 1.0  
**Date:** October 21, 2025  
**Status:** Planning Phase

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Database Design](#database-design)
6. [Microservices Breakdown](#microservices-breakdown)
7. [Authentication System](#authentication-system)
8. [API Architecture](#api-architecture)
9. [Migration Strategy](#migration-strategy)
10. [Implementation Roadmap](#implementation-roadmap)

---

## Executive Summary

This document outlines the comprehensive plan for building an enterprise-level backend system for the SmileFactory innovation ecosystem platform. The system will be built using Node.js with a microservices architecture, designed for easy future migration to Java, and will leverage Supabase for database management, Redis for caching, and Docker for containerization.

### Key Objectives

- Build a scalable microservices architecture
- Implement unified OTP-based authentication
- Support multiple profiles per user account
- Enable seamless migration from previous platform
- Provide social media features (feed, messaging, search)
- Ensure easy future migration to Java

---

## Current State Analysis

### Existing Frontend Architecture

**Technology Stack:**
- **Framework:** React 18.3.1 with TypeScript
- **Build Tool:** Vite 5.4.19
- **State Management:** Zustand 5.0.8
- **UI Components:** Radix UI + shadcn/ui
- **Styling:** Tailwind CSS 3.4.17
- **Routing:** React Router DOM 6.30.1
- **Data Fetching:** TanStack Query 5.83.0

**Current Data Stores (Client-Side):**
- `postsStore.ts` - Feed posts management
- `messagingStore.ts` - Conversations and messages
- `eventsStore.ts` - Events management
- `marketplaceStore.ts` - Marketplace items
- `blogStore.ts` - Blog posts
- `eventRegistrationStore.ts` - Event registrations

**User Profile Types Identified:**
- Innovator
- Mentor
- Investor
- Student (Academic Student)
- Organization (Academic Institution & Organizations)
- Professional

**Existing Features:**
- Landing page with sign-in/sign-up dialogs
- Feed system with post types (general, opportunity, project, marketplace, event, blog)
- Messaging system with conversations
- Profile management (multiple profiles per user)
- Events system
- Marketplace
- Blog
- Search functionality
- Notifications
- Bookmarks
- Connections
- Groups

### Integration Points

The backend will need to provide REST APIs that replace the current Zustand stores with real data from Supabase. The frontend is already structured to consume data through stores, making the integration straightforward.

---

## Technology Stack

### Backend Framework: NestJS

**Rationale:**
- **Spring Boot-like Architecture:** NestJS mirrors Spring Boot's architecture (dependency injection, decorators, modules), making future Java migration straightforward
- **TypeScript Native:** Full TypeScript support with strong typing
- **Microservices Support:** Built-in support for microservices with multiple transport layers
- **Extensive Ecosystem:** Large community, extensive documentation, and enterprise adoption
- **Modular Architecture:** Clear separation of concerns with modules, controllers, services, and repositories

### Database: Supabase (PostgreSQL)

**Rationale:**
- **PostgreSQL Foundation:** Robust, ACID-compliant relational database
- **Built-in Auth:** Supabase Auth with OTP support
- **Real-time Capabilities:** WebSocket support for real-time features
- **Row Level Security:** Fine-grained access control
- **Storage:** Built-in file storage for images and documents
- **RESTful API:** Auto-generated REST API (can be used or bypassed)

### Caching: Redis

**Use Cases:**
- Session management
- OTP storage (temporary)
- Feed caching
- Search results caching
- Rate limiting
- Real-time features (pub/sub)

### Containerization: Docker

**Components:**
- Individual containers for each microservice
- Redis container
- Nginx for load balancing
- Docker Compose for local development
- Kubernetes-ready for production scaling

### Additional Technologies

- **Message Queue:** RabbitMQ or Redis Pub/Sub for inter-service communication
- **API Gateway:** Kong or custom NestJS gateway
- **Monitoring:** Prometheus + Grafana
- **Logging:** Winston + ELK Stack (Elasticsearch, Logstash, Kibana)
- **Email Service:** SendGrid or AWS SES for OTP delivery
- **File Storage:** Supabase Storage or AWS S3

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Load Balancer (Nginx)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (NestJS)                        │
│  - Request routing                                               │
│  - Authentication middleware                                     │
│  - Rate limiting                                                 │
│  - Request/Response transformation                               │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐      ┌──────────────┐
│ Auth Service │    │ User Service │      │ Feed Service │
└──────────────┘    └──────────────┘      └──────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐      ┌──────────────┐
│   Messaging  │    │    Events    │      │ Marketplace  │
│   Service    │    │   Service    │      │   Service    │
└──────────────┘    └──────────────┘      └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐      ┌──────────────┐
│   Supabase   │    │    Redis     │      │  RabbitMQ    │
│  (PostgreSQL)│    │   (Cache)    │      │ (Message Q)  │
└──────────────┘    └──────────────┘      └──────────────┘
```

### Architecture Patterns

1. **Microservices Pattern:** Each service is independently deployable
2. **API Gateway Pattern:** Single entry point for all client requests
3. **Database per Service:** Each service has its own database schema (logical separation in Supabase)
4. **Event-Driven Architecture:** Services communicate via events for async operations
5. **CQRS (Command Query Responsibility Segregation):** Separate read and write operations for complex domains
6. **Circuit Breaker Pattern:** Fault tolerance for service-to-service communication

---

## Database Design

### Core Entities and Relationships

#### 1. Users Table (auth.users - Supabase Auth)
```sql
-- Managed by Supabase Auth
-- Extended with custom fields in public.user_metadata
```

#### 2. User Accounts Table
```sql
CREATE TABLE user_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  is_migrated BOOLEAN DEFAULT FALSE,
  migration_completed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT unique_auth_user UNIQUE(auth_user_id)
);

CREATE INDEX idx_user_accounts_email ON user_accounts(email);
CREATE INDEX idx_user_accounts_auth_user_id ON user_accounts(auth_user_id);
```

#### 3. Profiles Table (One-to-Many with User Accounts)
```sql
CREATE TYPE profile_type AS ENUM (
  'innovator',
  'mentor', 
  'investor',
  'academic_student',
  'academic_institution',
  'organization',
  'professional'
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_account_id UUID REFERENCES user_accounts(id) ON DELETE CASCADE,
  profile_type profile_type NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,
  location VARCHAR(255),
  website VARCHAR(255),
  phone VARCHAR(50),
  is_primary BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  completion_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_primary_profile UNIQUE(user_account_id, is_primary) WHERE is_primary = TRUE
);

CREATE INDEX idx_profiles_user_account ON profiles(user_account_id);
CREATE INDEX idx_profiles_type ON profiles(profile_type);
CREATE INDEX idx_profiles_username ON profiles(username);
```

#### 4. Profile Metadata Table
```sql
CREATE TABLE profile_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  key VARCHAR(100) NOT NULL,
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_profile_metadata UNIQUE(profile_id, key)
);

CREATE INDEX idx_profile_metadata_profile_id ON profile_metadata(profile_id);
CREATE INDEX idx_profile_metadata_key ON profile_metadata(key);
```

#### 5. Posts Table
```sql
CREATE TYPE post_type AS ENUM (
  'general',
  'opportunity',
  'project',
  'marketplace',
  'event',
  'blog',
  'update'
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_type post_type NOT NULL,
  title VARCHAR(500),
  content TEXT NOT NULL,
  image_url TEXT,
  metadata JSONB, -- For type-specific fields (price, date, location, etc.)
  tags TEXT[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_posts_profile_id ON posts(profile_id);
CREATE INDEX idx_posts_type ON posts(post_type);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
```

#### 6. Comments Table
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_profile_id ON comments(profile_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
```

#### 7. Likes Table
```sql
CREATE TYPE likeable_type AS ENUM ('post', 'comment');

CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  likeable_type likeable_type NOT NULL,
  likeable_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_like UNIQUE(profile_id, likeable_type, likeable_id)
);

CREATE INDEX idx_likes_profile_id ON likes(profile_id);
CREATE INDEX idx_likes_likeable ON likes(likeable_type, likeable_id);
```

#### 8. Connections Table
```sql
CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'rejected', 'blocked');

CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  addressee_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status connection_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_connection UNIQUE(requester_profile_id, addressee_profile_id),
  CONSTRAINT no_self_connection CHECK (requester_profile_id != addressee_profile_id)
);

CREATE INDEX idx_connections_requester ON connections(requester_profile_id);
CREATE INDEX idx_connections_addressee ON connections(addressee_profile_id);
CREATE INDEX idx_connections_status ON connections(status);
```

#### 9. Conversations Table
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 10. Conversation Participants Table
```sql
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_read_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT unique_participant UNIQUE(conversation_id, profile_id)
);

CREATE INDEX idx_conversation_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX idx_conversation_participants_profile ON conversation_participants(profile_id);
```

#### 11. Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_profile_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

#### 12. Events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  event_type VARCHAR(100),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(500),
  is_virtual BOOLEAN DEFAULT FALSE,
  virtual_link TEXT,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_events_organizer ON events(organizer_profile_id);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_featured ON events(is_featured);
```

#### 13. Event Registrations Table
```sql
CREATE TYPE registration_status AS ENUM ('registered', 'cancelled', 'attended');

CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status registration_status DEFAULT 'registered',
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_registration UNIQUE(event_id, profile_id)
);

CREATE INDEX idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_profile ON event_registrations(profile_id);
```

#### 14. Marketplace Items Table
```sql
CREATE TYPE item_type AS ENUM ('product', 'service');
CREATE TYPE item_status AS ENUM ('active', 'sold', 'inactive');

CREATE TABLE marketplace_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_type item_type NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  status item_status DEFAULT 'active',
  is_featured BOOLEAN DEFAULT FALSE,
  image_urls TEXT[],
  tags TEXT[],
  location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_marketplace_items_seller ON marketplace_items(seller_profile_id);
CREATE INDEX idx_marketplace_items_status ON marketplace_items(status);
CREATE INDEX idx_marketplace_items_featured ON marketplace_items(is_featured);
```

#### 15. Bookmarks Table
```sql
CREATE TYPE bookmarkable_type AS ENUM ('post', 'event', 'marketplace_item', 'profile');

CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  bookmarkable_type bookmarkable_type NOT NULL,
  bookmarkable_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_bookmark UNIQUE(profile_id, bookmarkable_type, bookmarkable_id)
);

CREATE INDEX idx_bookmarks_profile ON bookmarks(profile_id);
CREATE INDEX idx_bookmarks_bookmarkable ON bookmarks(bookmarkable_type, bookmarkable_id);
```

#### 16. Notifications Table
```sql
CREATE TYPE notification_type AS ENUM (
  'connection_request',
  'connection_accepted',
  'message',
  'comment',
  'like',
  'event_reminder',
  'system'
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  actor_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notification_type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_profile_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

#### 17. OTP Codes Table (Temporary Storage)
```sql
CREATE TABLE otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_otp_codes_email ON otp_codes(email);
CREATE INDEX idx_otp_codes_expires_at ON otp_codes(expires_at);
```

#### 18. Migration Tracking Table
```sql
CREATE TABLE migration_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  old_user_id VARCHAR(255),
  new_user_account_id UUID REFERENCES user_accounts(id),
  migration_status VARCHAR(50),
  migration_data JSONB,
  migrated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_migration_records_old_user_id ON migration_records(old_user_id);
```

### Database Triggers and Functions

#### Auto-update timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_user_accounts_updated_at BEFORE UPDATE ON user_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ... (apply to all relevant tables)
```

#### Auto-increment counters
```sql
CREATE OR REPLACE FUNCTION increment_post_likes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.likeable_type = 'post' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.likeable_id;
  ELSIF TG_OP = 'DELETE' AND OLD.likeable_type = 'post' THEN
    UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.likeable_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_likes_count
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION increment_post_likes();
```

---

## Microservices Breakdown

### 1. API Gateway Service

**Responsibilities:**
- Route requests to appropriate microservices
- Authentication and authorization middleware
- Rate limiting
- Request/response transformation
- API versioning
- CORS handling

**Technology:** NestJS with @nestjs/microservices

**Endpoints:**
- All external API endpoints proxy through this service

### 2. Auth Service

**Responsibilities:**
- User registration and login
- OTP generation and verification
- JWT token generation and validation
- Session management
- Password reset (if needed)
- OAuth integration (future)

**Technology:** NestJS + Supabase Auth + Redis

**Key Endpoints:**
```
POST   /api/v1/auth/send-otp
POST   /api/v1/auth/verify-otp
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
```

**Database Tables:**
- user_accounts
- otp_codes (or Redis)

### 3. User Profile Service

**Responsibilities:**
- Profile CRUD operations
- Multiple profile management
- Profile completion tracking
- Profile search and discovery
- Profile verification

**Technology:** NestJS + Supabase

**Key Endpoints:**
```
GET    /api/v1/profiles
POST   /api/v1/profiles
GET    /api/v1/profiles/:id
PUT    /api/v1/profiles/:id
DELETE /api/v1/profiles/:id
GET    /api/v1/profiles/user/:userId
PATCH  /api/v1/profiles/:id/set-primary
GET    /api/v1/profiles/search
```

**Database Tables:**
- profiles
- profile_metadata

### 4. Feed Service

**Responsibilities:**
- Post CRUD operations
- Feed generation (personalized and general)
- Post filtering and sorting
- Post engagement (likes, comments)
- Content moderation

**Technology:** NestJS + Supabase + Redis (for feed caching)

**Key Endpoints:**
```
GET    /api/v1/feed
GET    /api/v1/feed/personalized
POST   /api/v1/posts
GET    /api/v1/posts/:id
PUT    /api/v1/posts/:id
DELETE /api/v1/posts/:id
POST   /api/v1/posts/:id/like
DELETE /api/v1/posts/:id/like
POST   /api/v1/posts/:id/comments
GET    /api/v1/posts/:id/comments
```

**Database Tables:**
- posts
- comments
- likes

### 5. Messaging Service

**Responsibilities:**
- Direct messaging between profiles
- Conversation management
- Message delivery and read receipts
- Real-time message notifications

**Technology:** NestJS + Supabase + WebSockets

**Key Endpoints:**
```
GET    /api/v1/conversations
POST   /api/v1/conversations
GET    /api/v1/conversations/:id
GET    /api/v1/conversations/:id/messages
POST   /api/v1/conversations/:id/messages
PATCH  /api/v1/conversations/:id/read
DELETE /api/v1/conversations/:id
```

**WebSocket Events:**
```
message:new
message:read
conversation:typing
```

**Database Tables:**
- conversations
- conversation_participants
- messages

### 6. Connection Service

**Responsibilities:**
- Connection requests management
- Connection acceptance/rejection
- Connection recommendations
- Network graph management

**Technology:** NestJS + Supabase

**Key Endpoints:**
```
GET    /api/v1/connections
POST   /api/v1/connections/request
PUT    /api/v1/connections/:id/accept
PUT    /api/v1/connections/:id/reject
DELETE /api/v1/connections/:id
GET    /api/v1/connections/suggestions
GET    /api/v1/connections/mutual/:profileId
```

**Database Tables:**
- connections

### 7. Events Service

**Responsibilities:**
- Event CRUD operations
- Event registration management
- Event discovery and search
- Event reminders
- Featured events

**Technology:** NestJS + Supabase

**Key Endpoints:**
```
GET    /api/v1/events
POST   /api/v1/events
GET    /api/v1/events/:id
PUT    /api/v1/events/:id
DELETE /api/v1/events/:id
POST   /api/v1/events/:id/register
DELETE /api/v1/events/:id/register
GET    /api/v1/events/:id/attendees
GET    /api/v1/events/featured
```

**Database Tables:**
- events
- event_registrations

### 8. Marketplace Service

**Responsibilities:**
- Marketplace item CRUD operations
- Item search and filtering
- Featured items management
- Transaction tracking (future)

**Technology:** NestJS + Supabase

**Key Endpoints:**
```
GET    /api/v1/marketplace
POST   /api/v1/marketplace
GET    /api/v1/marketplace/:id
PUT    /api/v1/marketplace/:id
DELETE /api/v1/marketplace/:id
GET    /api/v1/marketplace/featured
PATCH  /api/v1/marketplace/:id/status
```

**Database Tables:**
- marketplace_items

### 9. Search Service

**Responsibilities:**
- Global search across all entities
- Advanced filtering
- Search indexing
- Search suggestions

**Technology:** NestJS + Supabase + Elasticsearch (optional, future enhancement)

**Key Endpoints:**
```
GET    /api/v1/search
GET    /api/v1/search/profiles
GET    /api/v1/search/posts
GET    /api/v1/search/events
GET    /api/v1/search/marketplace
GET    /api/v1/search/suggestions
```

**Database Tables:**
- All tables (read-only queries)

### 10. Notification Service

**Responsibilities:**
- Notification creation and delivery
- Notification preferences management
- Push notifications (future)
- Email notifications
- In-app notifications

**Technology:** NestJS + Supabase + Redis (for real-time delivery)

**Key Endpoints:**
```
GET    /api/v1/notifications
PATCH  /api/v1/notifications/:id/read
PATCH  /api/v1/notifications/read-all
DELETE /api/v1/notifications/:id
GET    /api/v1/notifications/preferences
PUT    /api/v1/notifications/preferences
```

**Database Tables:**
- notifications

### 11. Migration Service

**Responsibilities:**
- User data migration from old platform
- Data validation and transformation
- Migration status tracking
- Rollback capabilities

**Technology:** NestJS + Supabase

**Key Endpoints:**
```
POST   /api/v1/migration/initiate
GET    /api/v1/migration/status/:userId
POST   /api/v1/migration/complete
POST   /api/v1/migration/rollback
```

**Database Tables:**
- migration_records
- All user-related tables

---

## Authentication System

### Unified OTP-Based Authentication Flow

#### Architecture Overview

```
┌─────────────┐
│   Client    │
│  (Frontend) │
└──────┬──────┘
       │
       │ 1. POST /auth/send-otp { email }
       ▼
┌─────────────────────────────────────┐
│         API Gateway                 │
└──────┬──────────────────────────────┘
       │
       │ 2. Forward to Auth Service
       ▼
┌─────────────────────────────────────┐
│         Auth Service                │
│  - Check if user exists             │
│  - Generate 6-digit OTP             │
│  - Store in Redis (5 min TTL)       │
│  - Send email via SendGrid          │
└──────┬──────────────────────────────┘
       │
       │ 3. Return success (no user info)
       ▼
┌─────────────┐
│   Client    │
│ Show OTP    │
│ Input Form  │
└──────┬──────┘
       │
       │ 4. POST /auth/verify-otp { email, code }
       ▼
┌─────────────────────────────────────┐
│         Auth Service                │
│  - Verify OTP from Redis            │
│  - Check if user exists in DB       │
│  - If NOT exists: Create user       │
│    * Extract name from email        │
│    * Create user_account            │
│    * Create primary profile         │
│  - Generate JWT tokens              │
│  - Store session in Redis           │
└──────┬──────────────────────────────┘
       │
       │ 5. Return { accessToken, refreshToken, user, profiles }
       ▼
┌─────────────┐
│   Client    │
│ Store tokens│
│ Redirect to │
│ Dashboard   │
└─────────────┘
```

#### Implementation Details

**1. OTP Generation and Storage**

```typescript
// auth.service.ts
async sendOTP(email: string): Promise<void> {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store in Redis with 5-minute expiration
  await this.redisService.set(
    `otp:${email}`,
    JSON.stringify({ code: otp, attempts: 0 }),
    300 // 5 minutes
  );

  // Send email
  await this.emailService.sendOTP(email, otp);
}
```

**2. OTP Verification and User Creation**

```typescript
// auth.service.ts
async verifyOTP(email: string, code: string): Promise<AuthResponse> {
  // Verify OTP from Redis
  const otpData = await this.redisService.get(`otp:${email}`);

  if (!otpData || otpData.code !== code) {
    throw new UnauthorizedException('Invalid OTP');
  }

  // Check if user exists
  let userAccount = await this.userAccountRepository.findByEmail(email);

  // If user doesn't exist, create seamlessly
  if (!userAccount) {
    userAccount = await this.createNewUser(email);
  }

  // Generate JWT tokens
  const tokens = await this.generateTokens(userAccount);

  // Delete OTP from Redis
  await this.redisService.del(`otp:${email}`);

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: userAccount,
    profiles: await this.profileService.getUserProfiles(userAccount.id)
  };
}

private async createNewUser(email: string): Promise<UserAccount> {
  // Extract name from email (before @)
  const displayName = email.split('@')[0];

  // Create user account
  const userAccount = await this.userAccountRepository.create({
    email,
    emailVerified: true // OTP verified
  });

  // Create primary profile
  await this.profileService.createProfile({
    userAccountId: userAccount.id,
    displayName,
    profileType: 'innovator', // Default type
    isPrimary: true,
    completionPercentage: 20 // Initial completion
  });

  return userAccount;
}
```

**3. JWT Token Structure**

```typescript
// Access Token Payload
{
  sub: 'user-account-id',
  email: 'user@example.com',
  profileId: 'current-active-profile-id',
  type: 'access',
  iat: 1234567890,
  exp: 1234571490 // 1 hour
}

// Refresh Token Payload
{
  sub: 'user-account-id',
  type: 'refresh',
  iat: 1234567890,
  exp: 1237159890 // 30 days
}
```

**4. Session Management**

```typescript
// Store session in Redis
await this.redisService.set(
  `session:${userAccount.id}`,
  JSON.stringify({
    userId: userAccount.id,
    activeProfileId: primaryProfile.id,
    lastActivity: new Date()
  }),
  2592000 // 30 days
);
```

### Security Considerations

1. **Rate Limiting:** Max 3 OTP requests per email per hour
2. **OTP Attempts:** Max 3 verification attempts before OTP expires
3. **Token Rotation:** Refresh tokens rotated on each use
4. **Session Invalidation:** Logout invalidates all sessions
5. **HTTPS Only:** All auth endpoints require HTTPS
6. **CORS:** Strict CORS policy for auth endpoints

---

## API Architecture

### API Versioning Strategy

All APIs will be versioned using URL path versioning:
```
/api/v1/...
/api/v2/...
```

### Standard Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2025-10-21T10:30:00Z",
    "version": "1.0"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-10-21T10:30:00Z",
    "version": "1.0"
  }
}
```

### Pagination Standard

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Common Query Parameters

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `sort` - Sort field (e.g., `createdAt`, `-createdAt` for desc)
- `filter` - Filter criteria (JSON string)
- `search` - Search query
- `fields` - Fields to include (comma-separated)

### API Documentation

- **Tool:** Swagger/OpenAPI 3.0
- **Auto-generation:** NestJS @nestjs/swagger decorators
- **Endpoint:** `/api/docs`

---

## Migration Strategy

### Migration from Previous Platform

#### Phase 1: Data Assessment and Mapping

**Objectives:**
- Identify all data entities in the old platform
- Map old schema to new schema
- Identify data quality issues
- Plan data transformation rules

**Activities:**
1. Export sample data from old platform
2. Create data mapping document
3. Identify missing or incompatible data
4. Define transformation rules

**Example Mapping:**
```
Old Platform          →    New Platform
─────────────────────────────────────────
users.id              →    migration_records.old_user_id
users.email           →    user_accounts.email
users.name            →    profiles.display_name
users.type            →    profiles.profile_type
users.bio             →    profiles.bio
users.avatar          →    profiles.avatar_url
```

#### Phase 2: Migration Service Development

**Components:**

1. **Data Extraction Module**
   - Connect to old database
   - Extract data in batches
   - Validate data integrity

2. **Data Transformation Module**
   - Apply transformation rules
   - Handle data type conversions
   - Generate missing data (e.g., usernames)

3. **Data Loading Module**
   - Insert into new database
   - Handle conflicts
   - Track migration status

4. **Validation Module**
   - Verify data integrity
   - Compare record counts
   - Validate relationships

**Migration Script Example:**
```typescript
// migration.service.ts
async migrateUser(oldUserId: string): Promise<void> {
  // 1. Extract old user data
  const oldUser = await this.oldDbService.getUser(oldUserId);

  // 2. Check if already migrated
  const existing = await this.migrationRepository.findByOldUserId(oldUserId);
  if (existing) {
    throw new Error('User already migrated');
  }

  // 3. Transform data
  const userAccountData = {
    email: oldUser.email,
    emailVerified: true,
    isMigrated: true
  };

  // 4. Create user account
  const userAccount = await this.userAccountRepository.create(userAccountData);

  // 5. Create primary profile
  const profileData = {
    userAccountId: userAccount.id,
    displayName: oldUser.name,
    profileType: this.mapProfileType(oldUser.type),
    bio: oldUser.bio,
    avatarUrl: oldUser.avatar,
    isPrimary: true
  };

  const profile = await this.profileRepository.create(profileData);

  // 6. Migrate related data (posts, connections, etc.)
  await this.migrateUserPosts(oldUserId, profile.id);
  await this.migrateUserConnections(oldUserId, profile.id);

  // 7. Record migration
  await this.migrationRepository.create({
    oldUserId,
    newUserAccountId: userAccount.id,
    migrationStatus: 'completed',
    migrationData: { oldUser, newProfile: profile }
  });
}
```

#### Phase 3: User Notification and Onboarding

**Migration Banner Component:**
```typescript
// Frontend component
<MigrationBanner>
  <Icon>🎉</Icon>
  <Title>Welcome to the New SmileFactory!</Title>
  <Description>
    Your account has been upgraded with new features:
    - Multiple profiles support
    - Enhanced messaging
    - Improved matchmaking
  </Description>
  <Actions>
    <Button onClick={updateProfile}>Update Profile</Button>
    <Button variant="secondary" onClick={exploreFeaturesGuide}>Learn More</Button>
  </Actions>
</MigrationBanner>
```

**Post-Login Flow for Migrated Users:**
1. User signs in with OTP
2. System detects `is_migrated = true`
3. Show migration welcome banner
4. Prompt to complete/update profile
5. Show feature tour (optional)
6. Allow profile completion in stages

#### Phase 4: Gradual Rollout

**Strategy:**
1. **Week 1-2:** Migrate 10% of users (beta testers)
2. **Week 3-4:** Migrate 30% of users
3. **Week 5-6:** Migrate 60% of users
4. **Week 7-8:** Migrate remaining users
5. **Week 9+:** Monitor and support

**Rollback Plan:**
- Keep old platform running in read-only mode for 3 months
- Maintain data sync for critical data
- Provide export functionality for users who want to leave

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)

**Objectives:**
- Set up development environment
- Implement core infrastructure
- Establish CI/CD pipeline

**Tasks:**

**Week 1: Project Setup**
- [ ] Create backend folder structure
- [ ] Initialize NestJS monorepo with microservices
- [ ] Set up Docker Compose for local development
- [ ] Configure Supabase project
- [ ] Set up Redis instance
- [ ] Configure environment variables
- [ ] Set up Git repository and branching strategy

**Week 2: API Gateway & Auth Service**
- [ ] Implement API Gateway with routing
- [ ] Set up authentication middleware
- [ ] Implement rate limiting
- [ ] Create Auth Service
- [ ] Implement OTP generation and verification
- [ ] Integrate with email service (SendGrid)
- [ ] Implement JWT token generation
- [ ] Set up Redis for OTP and session storage

**Week 3: Database Setup**
- [ ] Create Supabase database schema
- [ ] Implement all tables and relationships
- [ ] Create database triggers and functions
- [ ] Set up Row Level Security (RLS) policies
- [ ] Create database migrations
- [ ] Seed initial data for testing

**Week 4: User Profile Service**
- [ ] Implement User Profile Service
- [ ] Create profile CRUD endpoints
- [ ] Implement multiple profile management
- [ ] Add profile completion tracking
- [ ] Implement profile search
- [ ] Write unit tests

### Phase 2: Core Features (Weeks 5-8)

**Week 5: Feed Service**
- [ ] Implement Feed Service
- [ ] Create post CRUD endpoints
- [ ] Implement feed generation algorithm
- [ ] Add post filtering and sorting
- [ ] Implement likes and comments
- [ ] Set up Redis caching for feeds
- [ ] Write unit tests

**Week 6: Messaging Service**
- [ ] Implement Messaging Service
- [ ] Create conversation management
- [ ] Implement message sending/receiving
- [ ] Set up WebSocket for real-time messaging
- [ ] Add read receipts
- [ ] Implement message notifications
- [ ] Write unit tests

**Week 7: Connection Service**
- [ ] Implement Connection Service
- [ ] Create connection request flow
- [ ] Implement connection acceptance/rejection
- [ ] Add connection recommendations
- [ ] Implement mutual connections
- [ ] Write unit tests

**Week 8: Events & Marketplace Services**
- [ ] Implement Events Service
- [ ] Create event CRUD endpoints
- [ ] Implement event registration
- [ ] Implement Marketplace Service
- [ ] Create marketplace item CRUD endpoints
- [ ] Add featured items/events
- [ ] Write unit tests

### Phase 3: Advanced Features (Weeks 9-12)

**Week 9: Search & Notification Services**
- [ ] Implement Search Service
- [ ] Create global search functionality
- [ ] Add advanced filtering
- [ ] Implement Notification Service
- [ ] Create notification delivery system
- [ ] Add notification preferences
- [ ] Write unit tests

**Week 10: Migration Service**
- [ ] Implement Migration Service
- [ ] Create data extraction module
- [ ] Implement data transformation
- [ ] Create migration tracking
- [ ] Test migration with sample data
- [ ] Write migration documentation

**Week 11: Integration & Testing**
- [ ] Integrate all microservices
- [ ] End-to-end testing
- [ ] Performance testing
- [ ] Load testing with Redis
- [ ] Security audit
- [ ] Fix bugs and issues

**Week 12: Frontend Integration**
- [ ] Update frontend to use backend APIs
- [ ] Replace Zustand stores with API calls
- [ ] Implement authentication flow
- [ ] Add error handling
- [ ] Test all features
- [ ] Fix integration issues

### Phase 4: Deployment & Migration (Weeks 13-16)

**Week 13: Deployment Preparation**
- [ ] Set up production environment
- [ ] Configure production Supabase
- [ ] Set up production Redis cluster
- [ ] Configure load balancer (Nginx)
- [ ] Set up monitoring (Prometheus + Grafana)
- [ ] Set up logging (ELK Stack)
- [ ] Configure CI/CD pipeline

**Week 14: Beta Deployment**
- [ ] Deploy to staging environment
- [ ] Conduct beta testing with 10% of users
- [ ] Monitor performance and errors
- [ ] Gather user feedback
- [ ] Fix critical issues
- [ ] Optimize performance

**Week 15: User Migration**
- [ ] Begin gradual user migration
- [ ] Monitor migration progress
- [ ] Provide user support
- [ ] Address migration issues
- [ ] Update documentation

**Week 16: Full Launch**
- [ ] Complete user migration
- [ ] Deploy to production
- [ ] Monitor system health
- [ ] Provide ongoing support
- [ ] Gather feedback for improvements

### Phase 5: Post-Launch (Weeks 17+)

**Ongoing Tasks:**
- [ ] Monitor system performance
- [ ] Address user feedback
- [ ] Implement feature enhancements
- [ ] Optimize database queries
- [ ] Scale infrastructure as needed
- [ ] Regular security updates
- [ ] Documentation updates

---

## Technology Migration Path (Node.js to Java)

### Design Principles for Easy Migration

1. **Layered Architecture**
   - Clear separation: Controllers → Services → Repositories
   - Mirrors Spring Boot's architecture
   - Easy to map NestJS modules to Spring Boot modules

2. **Dependency Injection**
   - NestJS uses DI similar to Spring
   - Services are injectable
   - Easy to convert to Spring @Service, @Component

3. **Decorators to Annotations**
   - NestJS decorators map to Spring annotations
   - `@Controller()` → `@RestController`
   - `@Injectable()` → `@Service`
   - `@Get()` → `@GetMapping()`

4. **DTOs and Validation**
   - Use class-validator in NestJS
   - Maps to Bean Validation in Spring
   - `@IsEmail()` → `@Email`

5. **Repository Pattern**
   - Use TypeORM or Prisma in NestJS
   - Maps to Spring Data JPA
   - Similar query methods

### Migration Mapping

| NestJS | Spring Boot |
|--------|-------------|
| `@Module()` | `@Configuration` |
| `@Controller()` | `@RestController` |
| `@Injectable()` | `@Service` |
| `@Get()` | `@GetMapping()` |
| `@Post()` | `@PostMapping()` |
| `@Body()` | `@RequestBody` |
| `@Param()` | `@PathVariable` |
| `@Query()` | `@RequestParam` |
| TypeORM Entity | JPA Entity |
| class-validator | Bean Validation |

### Example Code Comparison

**NestJS:**
```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findOne(id: string): Promise<User> {
    return this.usersRepository.findById(id);
  }
}
```

**Spring Boot (Future):**
```java
@RestController
@RequestMapping("/users")
public class UsersController {
  private final UsersService usersService;

  @Autowired
  public UsersController(UsersService usersService) {
    this.usersService = usersService;
  }

  @GetMapping("/{id}")
  public User findOne(@PathVariable String id) {
    return usersService.findOne(id);
  }
}

@Service
public class UsersService {
  private final UsersRepository usersRepository;

  @Autowired
  public UsersService(UsersRepository usersRepository) {
    this.usersRepository = usersRepository;
  }

  public User findOne(String id) {
    return usersRepository.findById(id).orElseThrow();
  }
}
```

---

## Deployment Architecture

### Docker Compose Structure (Development)

```yaml
version: '3.8'

services:
  # API Gateway
  api-gateway:
    build: ./services/api-gateway
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
      - auth-service
      - user-service

  # Auth Service
  auth-service:
    build: ./services/auth-service
    environment:
      - NODE_ENV=development
      - DATABASE_URL=${SUPABASE_URL}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis

  # User Profile Service
  user-service:
    build: ./services/user-service
    environment:
      - NODE_ENV=development
      - DATABASE_URL=${SUPABASE_URL}

  # Feed Service
  feed-service:
    build: ./services/feed-service
    environment:
      - NODE_ENV=development
      - DATABASE_URL=${SUPABASE_URL}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis

  # Messaging Service
  messaging-service:
    build: ./services/messaging-service
    environment:
      - NODE_ENV=development
      - DATABASE_URL=${SUPABASE_URL}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  # Nginx Load Balancer
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - api-gateway

volumes:
  redis-data:
```

### Production Deployment (Kubernetes)

**Recommended Setup:**
- Kubernetes cluster (AWS EKS, GCP GKE, or Azure AKS)
- Managed Redis (AWS ElastiCache, GCP Memorystore)
- Supabase hosted instance
- Load balancer (AWS ALB, GCP Load Balancer)
- Auto-scaling for microservices
- Monitoring with Prometheus + Grafana
- Logging with ELK Stack

---

## Monitoring and Observability

### Metrics to Track

1. **System Metrics**
   - CPU usage per service
   - Memory usage per service
   - Network I/O
   - Disk usage

2. **Application Metrics**
   - Request rate (requests/second)
   - Response time (p50, p95, p99)
   - Error rate
   - Active users
   - Database query performance

3. **Business Metrics**
   - User registrations
   - Profile creations
   - Posts created
   - Messages sent
   - Events registered
   - Marketplace items listed

### Logging Strategy

- **Structured Logging:** JSON format
- **Log Levels:** ERROR, WARN, INFO, DEBUG
- **Correlation IDs:** Track requests across services
- **Centralized Logging:** ELK Stack or CloudWatch

---

## Security Considerations

### Authentication & Authorization

- JWT tokens with short expiration (1 hour)
- Refresh token rotation
- Rate limiting on auth endpoints
- OTP expiration (5 minutes)
- Max OTP attempts (3)

### Data Protection

- Encryption at rest (Supabase)
- Encryption in transit (HTTPS/TLS)
- Row Level Security (RLS) in Supabase
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitize user input)

### API Security

- CORS configuration
- Rate limiting (Redis)
- API key authentication for service-to-service
- Request size limits
- Timeout configurations

---

## Conclusion

This comprehensive implementation plan provides a solid foundation for building the SmileFactory backend system. The architecture is designed to be scalable, maintainable, and easily migratable to Java in the future. The phased approach ensures steady progress while allowing for adjustments based on feedback and requirements.

### Next Steps

1. **Review and Approval:** Stakeholder review of this plan
2. **Team Formation:** Assemble development team
3. **Environment Setup:** Set up development environments
4. **Sprint Planning:** Break down tasks into 2-week sprints
5. **Begin Development:** Start with Phase 1

### Success Criteria

- ✅ All microservices deployed and functional
- ✅ Authentication system working seamlessly
- ✅ Multiple profiles per user supported
- ✅ Migration from old platform completed
- ✅ All social features operational
- ✅ System performance meets SLAs
- ✅ Security audit passed
- ✅ Documentation complete

---

**Document Version:** 1.0
**Last Updated:** October 21, 2025
**Author:** SmileFactory Development Team
**Status:** Ready for Implementation


