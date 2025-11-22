# SmileFactory Innovation Ecosystem - Project Documentation

**Version:** 1.0  
**Last Updated:** November 20, 2025  
**Status:** Phase 1 - MVP Development

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [System Architecture](#system-architecture)
4. [Core Features](#core-features)
5. [Technology Stack](#technology-stack)
6. [Database Schema](#database-schema)
7. [Authentication & User Management](#authentication--user-management)
8. [API Documentation](#api-documentation)
9. [Frontend Architecture](#frontend-architecture)
10. [Migration Strategy](#migration-strategy)
11. [Current Implementation Status](#current-implementation-status)
12. [Development Guidelines](#development-guidelines)
13. [Deployment Guide](#deployment-guide)
14. [Known Issues & Technical Debt](#known-issues--technical-debt)
15. [Roadmap](#roadmap)

---

## Executive Summary

SmileFactory is a comprehensive community platform designed to foster collaboration between key players in the innovation ecosystem. The platform connects innovators, mentors, investors, professionals, academic students, academic institutions, and organizations in a unified digital space.

### Key Highlights

- **Multi-Profile System**: Users can maintain multiple professional identities (e.g., both Innovator and Investor)
- **OTP-Based Authentication**: Passwordless authentication for seamless user experience
- **Content Categories**: Posts, Events, Blog, Marketplace, and Profile Directory
- **Real-Time Messaging**: Private messaging between users
- **Network Building**: Connection system for building professional networks
- **Migration-Ready**: Designed for easy migration from existing systems

### Current Status

- **Frontend**: 90% complete with mock data
- **Backend**: Architecture designed, implementation pending
- **Database**: Schema designed, awaiting deployment
- **Authentication**: Fully designed, ready for implementation

---

## Project Overview

### Vision

Create a thriving innovation ecosystem where ideas meet resources, expertise meets opportunity, and collaboration drives meaningful change.

### Target Users

1. **Innovators**: Entrepreneurs and startups with innovative ideas
2. **Mentors**: Experienced professionals offering guidance
3. **Investors**: Business investors looking to fund projects
4. **Professionals**: Industry professionals seeking collaboration
5. **Academic Students**: Students engaged in innovation
6. **Academic Institutions**: Universities with innovation programs
7. **Organizations**: Companies, NGOs supporting innovation

### Core Value Propositions

- **For Innovators**: Access to funding, mentorship, and collaboration opportunities
- **For Investors**: Discover vetted innovation projects and startups
- **For Mentors**: Share expertise and build professional reputation
- **For Organizations**: Engage with innovation community and talent pipeline
- **For Students**: Learn, network, and launch innovation projects
- **For Institutions**: Showcase programs and connect with ecosystem

---

## System Architecture

### Phase 1: Quickest MVP (Current)

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  - Vite + TypeScript                                        │
│  - Zustand (State Management)                               │
│  - TanStack Query (Data Fetching)                           │
│  - Radix UI + shadcn/ui (Components)                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ REST API
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (NestJS)                      │
│  - Request Routing                                          │
│  - Authentication Middleware                                │
│  - Rate Limiting                                            │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬────────────┐
        ▼            ▼            ▼            ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Auth Service │ │  User    │ │  Feed    │ │Messaging │
│              │ │ Service  │ │ Service  │ │ Service  │
└──────┬───────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
       │              │            │            │
       └──────────────┴────────────┴────────────┘
                      │
                      ▼
       ┌──────────────────────────────────┐
       │      Supabase (PostgreSQL)       │
       │  - Database                      │
       │  - Row Level Security            │
       │  - Real-time Subscriptions       │
       └──────────────────────────────────┘
                      │
                      ▼
       ┌──────────────────────────────────┐
       │         Redis Cache              │
       │  - OTP Storage                   │
       │  - Session Management            │
       │  - Feed Caching                  │
       └──────────────────────────────────┘
```

### Microservices Architecture

**11 Core Services:**

1. **API Gateway** - Request routing, authentication, rate limiting
2. **Auth Service** - OTP authentication, JWT token management
3. **User Service** - Profile management, multiple profiles per user
4. **Feed Service** - Posts, comments, likes, content management
5. **Messaging Service** - Real-time private messaging
6. **Connection Service** - Network management, follow/follower
7. **Events Service** - Event creation, registration, management
8. **Marketplace Service** - Products, services listings
9. **Search Service** - Global search across all content
10. **Notification Service** - In-app and email notifications
11. **Migration Service** - User data migration from legacy system

---

## Core Features

### 1. User Connections

**Description**: Users can connect with each other to build their professional network.

**Functionality**:
- Send connection requests
- Accept/reject connection requests
- View mutual connections
- Connection suggestions based on profile type and interests
- Remove connections

**Status**: ✅ Designed | ⏳ Implementation Pending

---

### 2. Posts System

**Description**: Multi-category content creation and interaction system.

#### Main Content Categories

1. **Posts** (General Feed)
   - Standard community posts
   - Updates and announcements
   - Opportunity posts (jobs, collaborations)

2. **Profile Directory**
   - Searchable user profiles
   - Filter by profile type
   - View profile details

3. **Events**
   - Event creation and management
   - Event registration
   - Categories: Networking, Workshop, Conference, Meetup
   - "Join Event" CTA

4. **Blog**
   - Long-form content
   - Categories and tags
   - Rich text editor
   - "Read More" CTA

5. **Marketplace**
   - Products and services listings
   - Pricing information
   - "Contact Seller" CTA
   - Categories: Product, Service

#### Post Types

- **General Posts**: Standard community posts
- **Opportunity Posts**: Job opportunities, collaborations, partnerships
- **Update Posts**: Status updates and announcements
- **Blog Posts**: Long-form content with categories and tags
- **Event Posts**: Events with registration functionality
- **Marketplace Posts**: Products/services with contact seller option
- **Admin Posts**: Platform announcements and updates

#### Post Features

- **Pre-suggested Tags**: Selectable tags based on post type
- **Custom Tags**: Users can add their own tags
- **Sub-categories**: Organize content within main categories
- **Badges**: Visual indicators for post types
- **Type-specific CTAs**:
  - "Contact Seller" for marketplace
  - "Join Event" for events
  - "Apply Now" for opportunities
  - "Read More" for blog posts
- **View Details**: Available on all posts
- **Post Interactions**:
  - Like
  - Share
  - Bookmark
  - Comment

**Status**: ✅ Frontend Complete | ⏳ Backend Pending

---

### 3. Post Creation

**Description**: Unified post creation interface with category-specific forms.

**Features**:
- Tabbed interface for all main categories
- Category-specific fields (price for marketplace, date for events)
- Image upload support
- Tag selection (pre-suggested + custom)
- Form clearing when switching categories (prevents data leakage)
- Profile selection (post from any of your profiles)
- Rich text editor for blog posts

**Status**: ✅ Frontend Complete | ⏳ Backend Pending

---

### 4. Private Messaging

**Description**: Real-time private messaging between users.

**Features**:
- One-on-one conversations
- Message history
- Read receipts
- Unread message count
- Search conversations
- Real-time message delivery (WebSocket)
- Typing indicators

**Status**: ✅ Frontend Complete | ⏳ Backend Pending

---

### 5. Events System

**Description**: Comprehensive event management platform.

**Features**:
- Event creation with rich details
- Event categories and tags
- Registration management
- Attendee tracking
- Virtual and in-person events
- Event reminders
- Featured events
- Event search and filtering

**Status**: ✅ Frontend Complete | ⏳ Backend Pending

---

### 6. Marketplace

**Description**: Platform for listing products and services.

**Features**:
- Product/service listings
- Pricing information
- Image galleries
- Categories and tags
- Seller contact functionality
- Featured listings
- Search and filtering

**Status**: ✅ Frontend Complete | ⏳ Backend Pending

---

### 7. Search & Discovery

**Description**: Global search across all content types.

**Features**:
- Search posts, profiles, events, marketplace items
- Filter by category
- Filter by tags
- Advanced filtering options
- Real-time search results

**Status**: ✅ Frontend Complete | ⏳ Backend Pending

---

### 8. Notifications

**Description**: Keep users informed of important activities.

**Notification Types**:
- Connection requests
- Connection accepted
- New messages
- Post comments
- Post likes
- Event reminders
- System announcements

**Delivery Channels**:
- In-app notifications
- Email notifications (via Resend.io)

**Status**: ✅ Designed | ⏳ Implementation Pending

---

## Technology Stack

### Phase 1: Quickest MVP (Current)

#### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.19
- **Language**: TypeScript 5.8.3
- **State Management**: Zustand 5.0.8
- **Data Fetching**: TanStack Query 5.83.0
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router DOM 6.30.1
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React

#### Backend
- **Framework**: NestJS (TypeScript)
- **Runtime**: Node.js 18+
- **Database**: Supabase (PostgreSQL)
- **Caching**: Redis 7
- **Authentication**: JWT + OTP
- **Email Service**: Resend.io
- **Containerization**: Docker + Docker Compose
- **API Documentation**: Swagger/OpenAPI

#### Infrastructure
- **Version Control**: Git
- **CI/CD**: GitHub Actions (planned)
- **Hosting**: TBD (Phase 1 deployment)
- **Monitoring**: Prometheus + Grafana (planned)
- **Logging**: Winston + ELK Stack (planned)

---

### Phase 2: Self-Hosted Infrastructure

**Changes from Phase 1**:

#### Authentication
- **From**: Supabase Auth
- **To**: Keycloak (OIDC/OAuth2)
- **Features**:
  - AD/LDAP federation
  - Single Sign-On (SSO)
  - Multi-factor authentication
  - Role-based access control

#### Database
- **From**: Supabase (managed)
- **To**: PostgreSQL on Docker
- **Features**:
  - Self-hosted database
  - Full control over data
  - Custom backup strategies
  - Database replication

#### Backend
- **Framework**: Remains NestJS
- **Changes**:
  - All Supabase-handled logic moves to custom implementation
  - Custom authentication middleware
  - Custom real-time implementation (WebSockets)

---

### Phase 3: Java Migration

**Changes from Phase 2**:

#### Backend
- **From**: NestJS (Node.js/TypeScript)
- **To**: Spring Boot (Java)
- **Migration Strategy**:
  - Microservices migrated one at a time
  - API contracts remain unchanged
  - Database schema remains unchanged
  - Frontend requires no changes

#### Technology Mapping

| NestJS | Spring Boot |
|--------|-------------|
| `@Module()` | `@Configuration` |
| `@Controller()` | `@RestController` |
| `@Injectable()` | `@Service` |
| TypeORM Entity | JPA Entity |
| class-validator | Bean Validation |
| Passport JWT | Spring Security |

---

## Database Schema

### Overview

**Total Tables**: 18 core tables
**Database**: PostgreSQL (via Supabase in Phase 1)
**Features**: Row Level Security (RLS), Triggers, Indexes

### Core Tables

#### 1. user_accounts

**Purpose**: Base user authentication accounts

```sql
CREATE TABLE user_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Key Points**:
- One account per email
- Used for authentication only
- Links to multiple profiles

---

#### 2. profiles

**Purpose**: User profiles (multiple per account)

```sql
CREATE TYPE profile_type AS ENUM (
  'innovator',
  'mentor',
  'investor',
  'professional',
  'academic_student',
  'academic_institution',
  'organization'
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
  CONSTRAINT unique_primary_profile UNIQUE(user_account_id, is_primary)
    WHERE is_primary = TRUE
);
```

**Key Points**:
- Multiple profiles per user account
- One primary profile per account
- Profile completion tracking
- Verification status

---

#### 3. posts

**Purpose**: All content posts across categories

```sql
CREATE TYPE post_type AS ENUM (
  'general',
  'opportunity',
  'update',
  'blog',
  'event',
  'marketplace',
  'admin'
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_type post_type NOT NULL,
  title VARCHAR(500),
  content TEXT NOT NULL,
  image_url TEXT,
  metadata JSONB, -- Type-specific fields (price, date, location)
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
```

**Key Points**:
- Unified table for all post types
- JSONB metadata for type-specific fields
- Engagement metrics (likes, comments, shares, views)
- Soft delete capability

---

#### 4. connections

**Purpose**: User network connections

```sql
CREATE TYPE connection_status AS ENUM (
  'pending',
  'accepted',
  'rejected',
  'blocked'
);

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
```

---

#### 5. conversations & messages

**Purpose**: Private messaging system

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_read_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT unique_participant UNIQUE(conversation_id, profile_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

#### 6. events

**Purpose**: Event management

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

CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'registered',
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_registration UNIQUE(event_id, profile_id)
);
```

---

#### Additional Tables

7. **comments** - Post comments
8. **likes** - Likes on posts/comments
9. **marketplace_items** - Products and services
10. **bookmarks** - Saved content
11. **notifications** - User notifications
12. **otp_codes** - Temporary OTP storage
13. **profile_metadata** - Extended profile data (JSONB)
14. **migration_records** - Migration tracking

### Entity Relationships

```
user_accounts (1) ──────── (N) profiles
                              │
                              ├── (N) posts
                              ├── (N) connections
                              ├── (N) messages
                              ├── (N) events
                              ├── (N) marketplace_items
                              └── (N) notifications

posts (1) ──────── (N) comments
      (1) ──────── (N) likes
      (1) ──────── (N) bookmarks

events (1) ──────── (N) event_registrations

conversations (1) ──────── (N) conversation_participants
              (1) ──────── (N) messages
```

---

## Authentication & User Management

### Authentication Flow

#### OTP-Based Authentication

**No Password Required** - Users authenticate using One-Time Passwords sent to their email.

**Unified Sign-In/Sign-Up Flow**:

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: User enters email                                   │
│ - No distinction between sign-in and sign-up               │
│ - Same flow for new and existing users                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Backend generates 6-digit OTP                       │
│ - OTP stored in Redis (5-minute expiration)                │
│ - OTP sent to email via Resend.io                          │
│ - Maximum 3 verification attempts                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: User enters OTP code                                │
│ - Frontend validates format                                │
│ - Backend verifies code                                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Backend processes authentication                    │
│                                                             │
│ IF user exists:                                             │
│   - Generate JWT tokens (access + refresh)                 │
│   - Return user data and profiles                          │
│   - Set isNewUser: false                                   │
│                                                             │
│ IF user is new:                                             │
│   - Create user_account record                             │
│   - Create default profile (innovator type)               │
│   - Generate JWT tokens                                    │
│   - Set isNewUser: true, firstLogin: true                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 5: Frontend handles response                           │
│                                                             │
│ IF isNewUser = true:                                        │
│   - Show profile wizard                                    │
│   - Guide user through profile setup                       │
│                                                             │
│ IF isNewUser = false:                                       │
│   - Redirect to feed                                       │
│   - Load user's profiles and data                          │
└─────────────────────────────────────────────────────────────┘
```

**Security Features**:
- OTP expires after 5 minutes
- Maximum 3 verification attempts
- Rate limiting on OTP requests
- JWT token rotation
- Refresh token for session management
- HTTPS only for authentication endpoints

---

### Profile Management

#### Base Profile vs User Profiles

**Base Profile (user_accounts)**:
- Contains email and phone
- Used for authentication
- One per user
- Links to all user profiles

**User Profiles (profiles)**:
- Multiple profiles per user account
- Each profile has a specific type
- One primary profile per account
- Independent display names, bios, avatars

#### Profile Types

1. **Innovator** - Entrepreneurs and startups
2. **Mentor** - Experienced professionals offering guidance
3. **Investor** - Business investors looking to fund projects
4. **Professional** - Industry professionals
5. **Academic Student** - Students engaged in innovation
6. **Academic Institution** - Universities with innovation programs
7. **Organization** - Companies, NGOs supporting innovation

#### Profile Questions

Each profile type has specific questions defined in JSON files:

**Location**: `profile-questions/{profileType}.json`

**Structure**:
```json
{
  "profileType": "innovator",
  "displayName": "Innovator",
  "description": "Entrepreneurs and startups with innovative ideas",
  "sections": [
    {
      "title": "Executive Summary",
      "icon": "person",
      "description": "Share a brief introduction",
      "questions": [
        {
          "id": "bio",
          "name": "bio",
          "label": "Executive Summary",
          "type": "textarea",
          "required": true,
          "fullWidth": true,
          "hint": "Tell us about yourself (max 500 characters)"
        }
      ]
    }
  ]
}
```

**Dynamic Form Generation**:
- Forms are generated dynamically from JSON
- No code changes needed to modify questions
- Supports various field types: text, textarea, select, checkbox, radio

---

### Onboarding Flow for Existing Users

Since the platform is migrating from an existing system, a two-step onboarding process is implemented:

#### Step 1: Profile Selection Message

**Message**: "You can now select multiple profiles. You are required to update your profile information. Select all profiles that you may be interested in."

**Behavior**:
- Shown to users migrated from old system
- Tracked via `firstLogin` flag
- Persists until user selects at least one profile
- Cannot be dismissed without selection

#### Step 2: Profile Completion Message

**Message**: "Your profiles require completion."

**Behavior**:
- Shown after Step 1 is complete
- Guides users to complete profile information
- Tracks completion percentage
- Can be dismissed but shows reminder

---

### Profile CRUD Operations

#### Create Profile

**Endpoint**: `POST /api/v1/profiles`

**Frontend**: `useProfilesStore.createProfile()`

**Features**:
- Select profile type
- Fill profile-specific questions
- Upload avatar and cover image
- Set as primary (optional)
- Draft data saved during creation

#### Read Profile

**Endpoints**:
- `GET /api/v1/profiles` - Get all user's profiles
- `GET /api/v1/profiles/:id` - Get specific profile

**Frontend**: `useProfilesStore.fetchProfiles()`

#### Update Profile

**Endpoint**: `PUT /api/v1/profiles/:id`

**Frontend**: `useProfilesStore.updateProfile()`

**Features**:
- Update any profile field
- Change profile type (with confirmation)
- Update completion percentage
- Upload new images

#### Delete Profile

**Endpoint**: `DELETE /api/v1/profiles/:id`

**Frontend**: `useProfilesStore.deleteProfile()`

**Restrictions**:
- Cannot delete primary profile if it's the only profile
- Must set another profile as primary first
- Confirmation required

---

## API Documentation

### Base URL

- **Development**: `http://localhost:3000/api/v1`
- **Production**: `https://api.smilefactory.com/api/v1`

### Authentication

All authenticated endpoints require a Bearer token:

```
Authorization: Bearer <access_token>
```

### API Endpoints Summary

#### Authentication Service

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/send-otp` | Send OTP to email | No |
| POST | `/auth/verify-otp` | Verify OTP and authenticate | No |
| POST | `/auth/refresh-token` | Refresh access token | Yes |
| POST | `/auth/logout` | Logout user | Yes |
| GET | `/auth/me` | Get current user info | Yes |
| POST | `/auth/complete-wizard` | Mark wizard as complete | Yes |

#### Profile Service

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profiles` | Get all user's profiles | Yes |
| POST | `/profiles` | Create new profile | Yes |
| GET | `/profiles/:id` | Get specific profile | Yes |
| PUT | `/profiles/:id` | Update profile | Yes |
| DELETE | `/profiles/:id` | Delete profile | Yes |
| PATCH | `/profiles/:id/set-primary` | Set as primary profile | Yes |
| GET | `/profiles/search` | Search public profiles | Yes |

#### Feed Service

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/feed` | Get general feed | Yes |
| GET | `/feed/personalized` | Get personalized feed | Yes |
| POST | `/posts` | Create new post | Yes |
| GET | `/posts/:id` | Get specific post | Yes |
| PUT | `/posts/:id` | Update post | Yes |
| DELETE | `/posts/:id` | Delete post | Yes |
| POST | `/posts/:id/like` | Like a post | Yes |
| DELETE | `/posts/:id/like` | Unlike a post | Yes |
| POST | `/posts/:id/comments` | Add comment | Yes |
| GET | `/posts/:id/comments` | Get comments | Yes |

#### Messaging Service

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/conversations` | Get all conversations | Yes |
| POST | `/conversations` | Create conversation | Yes |
| GET | `/conversations/:id` | Get conversation | Yes |
| GET | `/conversations/:id/messages` | Get messages | Yes |
| POST | `/conversations/:id/messages` | Send message | Yes |
| PATCH | `/conversations/:id/read` | Mark as read | Yes |
| DELETE | `/conversations/:id` | Delete conversation | Yes |

#### Connection Service

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/connections` | Get all connections | Yes |
| POST | `/connections/request` | Send connection request | Yes |
| PUT | `/connections/:id/accept` | Accept request | Yes |
| PUT | `/connections/:id/reject` | Reject request | Yes |
| DELETE | `/connections/:id` | Remove connection | Yes |
| GET | `/connections/suggestions` | Get suggestions | Yes |

#### Events Service

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/events` | Get all events | Yes |
| POST | `/events` | Create event | Yes |
| GET | `/events/:id` | Get specific event | Yes |
| PUT | `/events/:id` | Update event | Yes |
| DELETE | `/events/:id` | Delete event | Yes |
| POST | `/events/:id/register` | Register for event | Yes |
| DELETE | `/events/:id/register` | Unregister from event | Yes |

#### Marketplace Service

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/marketplace` | Get all items | Yes |
| POST | `/marketplace` | Create listing | Yes |
| GET | `/marketplace/:id` | Get specific item | Yes |
| PUT | `/marketplace/:id` | Update listing | Yes |
| DELETE | `/marketplace/:id` | Delete listing | Yes |

### API Response Format

**Success Response**:
```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Frontend Architecture

### Project Structure

```
apps/frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Layout.tsx      # Main layout wrapper
│   │   ├── PostCard.tsx    # Post display component
│   │   ├── CreatePostForm.tsx
│   │   ├── ProfileWizard.tsx
│   │   └── ...
│   ├── pages/              # Route pages
│   │   ├── Landing.tsx
│   │   ├── Feed.tsx
│   │   ├── Messages.tsx
│   │   ├── Profiles.tsx
│   │   └── ...
│   ├── stores/             # Zustand state stores
│   │   ├── authStore.ts
│   │   ├── profilesStore.ts
│   │   ├── postsStore.ts
│   │   ├── messagingStore.ts
│   │   └── ...
│   ├── lib/                # Utilities and helpers
│   │   ├── api.ts          # API client
│   │   └── utils.ts
│   ├── hooks/              # Custom React hooks
│   └── assets/             # Static assets
├── profile-questions/      # Profile type questions (JSON)
├── public/                 # Public assets
└── package.json
```

### State Management

**Zustand Stores**:

1. **authStore** - Authentication state
   - User data
   - Profiles
   - Tokens (access, refresh)
   - Authentication status
   - OTP flow methods

2. **profilesStore** - Profile management
   - User's profiles
   - Current active profile
   - CRUD operations
   - Profile wizard state

3. **postsStore** - Posts and feed
   - Posts list
   - Post interactions (like, comment, share)
   - Post creation

4. **messagingStore** - Private messaging
   - Conversations
   - Messages
   - Unread counts
   - Send message functionality

5. **eventsStore** - Events management
6. **marketplaceStore** - Marketplace items
7. **eventRegistrationStore** - Event registrations

### Routing

**React Router DOM** - Client-side routing

**Main Routes**:
- `/` - Landing page
- `/feed` - Main feed
- `/profiles` - Profile directory
- `/profile/:id` - View profile
- `/profile/:id/edit` - Edit profile
- `/messages` - Private messages
- `/events` - Events listing
- `/marketplace` - Marketplace
- `/blog` - Blog posts
- `/search` - Global search
- `/notifications` - Notifications
- `/connections` - User connections
- `/settings` - User settings

### UI Components

**Component Library**: Radix UI + shadcn/ui

**Key Components**:
- Button, Input, Textarea, Select
- Dialog, Sheet, Popover, Dropdown
- Card, Badge, Avatar
- Tabs, Accordion, Collapsible
- Toast notifications (Sonner)
- Form components (React Hook Form)

**Custom Components**:
- PostCard - Display posts with interactions
- CreatePostForm - Unified post creation
- ProfileWizard - Multi-step profile setup
- FilterModal - Advanced filtering
- UserBadge - Profile type indicators

---

## Migration Strategy

### Overview

The platform is designed for a three-phase migration approach, ensuring minimal disruption and maximum flexibility.

### Phase 1 → Phase 2: Self-Hosted Migration

**Timeline**: 3-6 months after Phase 1 launch

**Migration Steps**:

1. **Set Up Infrastructure**
   - Deploy PostgreSQL on Docker
   - Set up Keycloak for authentication
   - Configure AD/LDAP federation
   - Set up monitoring and logging

2. **Database Migration**
   - Export data from Supabase
   - Import to self-hosted PostgreSQL
   - Verify data integrity
   - Set up replication

3. **Authentication Migration**
   - Configure Keycloak
   - Migrate user accounts
   - Set up SSO
   - Test authentication flows

4. **Backend Updates**
   - Replace Supabase client with PostgreSQL client
   - Implement custom authentication middleware
   - Replace Supabase real-time with WebSockets
   - Update environment variables

5. **Testing & Validation**
   - Run integration tests
   - Perform load testing
   - Validate all features
   - User acceptance testing

6. **Deployment**
   - Blue-green deployment
   - Gradual traffic migration
   - Monitor performance
   - Rollback plan ready

**Downtime**: Minimal (< 1 hour during final cutover)

---

### Phase 2 → Phase 3: Java Migration

**Timeline**: 6-12 months after Phase 2

**Migration Strategy**: Microservice-by-microservice migration

**Migration Order**:

1. **Non-Critical Services First**
   - Search Service
   - Notification Service
   - Migration Service

2. **Medium-Critical Services**
   - Events Service
   - Marketplace Service
   - Connection Service

3. **Critical Services Last**
   - Feed Service
   - Messaging Service
   - User Service
   - Auth Service

**Per-Service Migration Steps**:

1. **Preparation**
   - Review NestJS service code
   - Design Spring Boot equivalent
   - Set up Spring Boot project structure
   - Configure dependencies

2. **Implementation**
   - Implement controllers (map from NestJS)
   - Implement services (business logic)
   - Implement repositories (data access)
   - Implement DTOs and validation
   - Write unit tests

3. **Testing**
   - Unit tests (JUnit)
   - Integration tests
   - API contract tests
   - Performance tests

4. **Deployment**
   - Deploy Spring Boot service alongside NestJS
   - Route small percentage of traffic to new service
   - Monitor performance and errors
   - Gradually increase traffic
   - Decommission NestJS service

**Key Principles**:
- API contracts remain unchanged
- Database schema remains unchanged
- Frontend requires no changes
- One service at a time
- Rollback capability at each step

---

### Data Migration from Legacy System

**Migration Service** handles importing users from the existing platform.

**Migration Process**:

1. **Data Extraction**
   - Export user data from old system
   - Export posts, connections, messages
   - Validate data format

2. **Data Transformation**
   - Map old user types to new profile types
   - Transform data to new schema
   - Handle missing fields
   - Validate transformed data

3. **Data Loading**
   - Create user_accounts
   - Create profiles
   - Import posts
   - Import connections
   - Import messages

4. **Verification**
   - Verify data integrity
   - Check relationships
   - Validate counts
   - User acceptance testing

5. **Onboarding**
   - Flag migrated users (`firstLogin: true`)
   - Show profile selection wizard
   - Guide through profile completion
   - Track migration status

**Migration Tracking**:
- `migration_records` table tracks each user migration
- Status: pending, in_progress, completed, failed
- Rollback capability for failed migrations

---

## Current Implementation Status

### ✅ Completed

#### Frontend (90% Complete)

- [x] **UI Components**
  - All shadcn/ui components integrated
  - Custom components built
  - Responsive design implemented
  - Dark mode support

- [x] **Pages**
  - Landing page with authentication
  - Feed page with post creation
  - Profile pages (view, edit, unified)
  - Messages page
  - Events page
  - Marketplace page
  - Blog page
  - Search page
  - Notifications page
  - Settings page

- [x] **State Management**
  - Auth store (OTP flow ready)
  - Profiles store (CRUD operations)
  - Posts store (with mock data)
  - Messaging store (with mock data)
  - Events store
  - Marketplace store

- [x] **Features**
  - Post creation with all types
  - Post interactions (like, comment, share, bookmark)
  - Profile wizard (multi-step)
  - Private messaging UI
  - Event registration UI
  - Marketplace listings UI
  - Search and filtering

#### Documentation (100% Complete)

- [x] Backend implementation plan
- [x] API endpoints documentation
- [x] Database schema design
- [x] Authentication flow documentation
- [x] Profile wizard implementation guide
- [x] Deployment guides
- [x] CI/CD implementation plan

---

### ⏳ In Progress

#### Backend (0% Complete - Designed, Not Implemented)

- [ ] **Infrastructure Setup**
  - [ ] Supabase project setup
  - [ ] Redis deployment
  - [ ] Docker Compose configuration
  - [ ] Environment variables

- [ ] **Microservices**
  - [ ] API Gateway
  - [ ] Auth Service
  - [ ] User Service
  - [ ] Feed Service
  - [ ] Messaging Service
  - [ ] Connection Service
  - [ ] Events Service
  - [ ] Marketplace Service
  - [ ] Search Service
  - [ ] Notification Service
  - [ ] Migration Service

- [ ] **Database**
  - [ ] Run migrations
  - [ ] Set up RLS policies
  - [ ] Create indexes
  - [ ] Seed initial data

---

### 🔜 Planned

#### Phase 1 Completion

- [ ] **Backend Implementation** (8-12 weeks)
  - Week 1-2: Infrastructure & API Gateway
  - Week 3-4: Auth & User Services
  - Week 5-6: Feed & Messaging Services
  - Week 7-8: Connection & Events Services
  - Week 9-10: Marketplace & Search Services
  - Week 11-12: Notification & Migration Services

- [ ] **Integration** (2-4 weeks)
  - Connect frontend to backend APIs
  - Replace mock data with real API calls
  - Implement real-time features (WebSockets)
  - End-to-end testing

- [ ] **Testing** (2-3 weeks)
  - Unit tests (backend)
  - Integration tests
  - E2E tests
  - Performance testing
  - Security testing
  - User acceptance testing

- [ ] **Deployment** (1-2 weeks)
  - Set up production environment
  - Configure CI/CD pipeline
  - Deploy to production
  - Monitor and optimize

#### Phase 2 (Self-Hosted)

- [ ] Infrastructure setup (4-6 weeks)
- [ ] Keycloak configuration (2-3 weeks)
- [ ] Database migration (2-3 weeks)
- [ ] Backend updates (4-6 weeks)
- [ ] Testing and validation (3-4 weeks)
- [ ] Deployment (1-2 weeks)

#### Phase 3 (Java Migration)

- [ ] Service-by-service migration (6-12 months)
- [ ] Testing and validation (ongoing)
- [ ] Gradual deployment (ongoing)

---

## Development Guidelines

### Code Standards

#### TypeScript/JavaScript

**Style Guide**: Airbnb JavaScript Style Guide (adapted)

**Key Rules**:
- Use TypeScript for type safety
- Prefer functional components (React)
- Use async/await over promises
- Destructure props and state
- Use meaningful variable names
- Comment complex logic
- Keep functions small and focused

**Example**:
```typescript
// Good
interface UserProfile {
  id: string;
  displayName: string;
  profileType: ProfileType;
}

const fetchUserProfile = async (profileId: string): Promise<UserProfile> => {
  const response = await api.get<ApiResponse<UserProfile>>(
    `/profiles/${profileId}`
  );
  return response.data;
};

// Bad
const fetchUserProfile = (profileId) => {
  return api.get('/profiles/' + profileId).then(res => res.data);
};
```

---

#### NestJS Backend

**Architecture**: Layered architecture (Controller → Service → Repository)

**Key Principles**:
- Dependency injection
- Single responsibility principle
- Separation of concerns
- DTOs for validation
- Repository pattern for data access

**Example**:
```typescript
// Controller
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id')
  async getProfile(@Param('id') id: string): Promise<ProfileDto> {
    return this.profileService.findById(id);
  }
}

// Service
@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async findById(id: string): Promise<ProfileDto> {
    const profile = await this.profileRepository.findById(id);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return this.mapToDto(profile);
  }
}

// Repository
@Injectable()
export class ProfileRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findById(id: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
}
```

---

### Java Migration Patterns

**Ensure NestJS code can be easily translated to Spring Boot**:

| NestJS Pattern | Spring Boot Equivalent |
|----------------|------------------------|
| `@Module()` | `@Configuration` |
| `@Controller()` | `@RestController` |
| `@Injectable()` | `@Service` |
| `@Get()`, `@Post()` | `@GetMapping`, `@PostMapping` |
| class-validator | Bean Validation (`@Valid`) |
| TypeORM Entity | JPA Entity (`@Entity`) |
| Passport JWT | Spring Security |

**Example Migration**:

```typescript
// NestJS
@Controller('profiles')
export class ProfileController {
  @Get(':id')
  async getProfile(@Param('id') id: string) {
    return this.profileService.findById(id);
  }
}
```

```java
// Spring Boot
@RestController
@RequestMapping("/profiles")
public class ProfileController {
  @GetMapping("/{id}")
  public ProfileDto getProfile(@PathVariable String id) {
    return profileService.findById(id);
  }
}
```

---

### Git Workflow

**Branching Strategy**: Git Flow

**Branches**:
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Production hotfixes
- `release/*` - Release preparation

**Commit Messages**:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Example**:
```
feat(auth): implement OTP verification

- Add OTP generation service
- Implement email sending via Resend.io
- Add OTP verification endpoint
- Update auth store with OTP flow

Closes #123
```

---

### Testing Strategy

#### Frontend Testing

**Tools**: Vitest, React Testing Library

**Test Types**:
- Unit tests for utilities and hooks
- Component tests for UI components
- Integration tests for pages
- E2E tests for critical flows

**Coverage Target**: 80%

#### Backend Testing

**Tools**: Jest, Supertest

**Test Types**:
- Unit tests for services and utilities
- Integration tests for controllers
- E2E tests for API endpoints
- Database tests for repositories

**Coverage Target**: 85%

---

## Deployment Guide

### Phase 1: Development Environment

#### Prerequisites

- Node.js 18+ and npm/yarn
- Docker and Docker Compose
- Git
- Supabase account
- Resend.io account (for email)

#### Frontend Setup

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd apps/frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**

   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:3000/api/v1
   VITE_SUPABASE_URL=<your-supabase-url>
   VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:5173`

---

#### Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd apps/backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**

   Create `.env` file:
   ```env
   # Application
   NODE_ENV=development
   PORT=3000

   # Supabase
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_SERVICE_KEY=<your-supabase-service-key>
   SUPABASE_ANON_KEY=<your-supabase-anon-key>

   # Redis
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=

   # JWT
   JWT_SECRET=<generate-random-secret>
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_SECRET=<generate-random-secret>
   JWT_REFRESH_EXPIRES_IN=7d

   # Email (Resend.io)
   RESEND_API_KEY=<your-resend-api-key>
   EMAIL_FROM=noreply@smilefactory.com

   # OTP
   OTP_EXPIRY_MINUTES=5
   OTP_MAX_ATTEMPTS=3
   ```

4. **Start Redis**
   ```bash
   docker-compose up -d redis
   ```

5. **Run Database Migrations**
   ```bash
   npm run migration:run
   ```

6. **Start Development Server**
   ```bash
   npm run start:dev
   ```

   Backend will be available at `http://localhost:3000`

---

#### Database Setup (Supabase)

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - Note the URL and keys

2. **Run Migrations**

   Execute SQL files in order:
   ```sql
   -- 001_create_user_accounts.sql
   -- 002_create_profiles.sql
   -- 003_create_posts.sql
   -- 004_create_connections.sql
   -- 005_create_conversations.sql
   -- 006_create_events.sql
   -- 007_create_marketplace.sql
   -- 008_create_notifications.sql
   -- 009_create_indexes.sql
   -- 010_create_rls_policies.sql
   ```

3. **Enable Row Level Security**

   RLS policies are automatically created by migration scripts.

4. **Seed Initial Data** (Optional)
   ```bash
   npm run seed
   ```

---

### Phase 1: Production Deployment

#### Option 1: Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel)**:

1. **Connect Repository**
   - Import project to Vercel
   - Select `apps/frontend` as root directory

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   - Add all `VITE_*` variables
   - Use production API URL

4. **Deploy**
   - Automatic deployment on push to `main`

**Backend (Railway)**:

1. **Create New Project**
   - Connect GitHub repository
   - Select `apps/backend` as root directory

2. **Add Services**
   - Add PostgreSQL (or use Supabase)
   - Add Redis

3. **Environment Variables**
   - Add all backend environment variables
   - Use production database credentials

4. **Deploy**
   - Automatic deployment on push to `main`

---

#### Option 2: Docker Deployment

**Build Docker Images**:

```bash
# Frontend
cd apps/frontend
docker build -t smilefactory-frontend .

# Backend
cd apps/backend
docker build -t smilefactory-backend .
```

**Docker Compose**:

```yaml
version: '3.8'

services:
  frontend:
    image: smilefactory-frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=https://api.smilefactory.com/api/v1

  backend:
    image: smilefactory-backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
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

**Deploy**:
```bash
docker-compose up -d
```

---

### Phase 2: Self-Hosted Deployment

#### Infrastructure Requirements

- **Server**: 4 CPU, 16GB RAM minimum
- **Storage**: 100GB SSD minimum
- **OS**: Ubuntu 22.04 LTS
- **Docker**: Latest version
- **Kubernetes**: Optional (for scaling)

#### Services to Deploy

1. **PostgreSQL**
   ```bash
   docker run -d \
     --name postgres \
     -e POSTGRES_PASSWORD=<password> \
     -e POSTGRES_DB=smilefactory \
     -v postgres-data:/var/lib/postgresql/data \
     -p 5432:5432 \
     postgres:15
   ```

2. **Keycloak**
   ```bash
   docker run -d \
     --name keycloak \
     -e KEYCLOAK_ADMIN=admin \
     -e KEYCLOAK_ADMIN_PASSWORD=<password> \
     -p 8080:8080 \
     quay.io/keycloak/keycloak:latest start-dev
   ```

3. **Redis**
   ```bash
   docker run -d \
     --name redis \
     -v redis-data:/data \
     -p 6379:6379 \
     redis:7-alpine
   ```

4. **Backend Services**
   - Deploy each microservice separately
   - Use Docker Compose or Kubernetes
   - Configure service discovery
   - Set up load balancing

5. **Monitoring**
   - Prometheus for metrics
   - Grafana for dashboards
   - ELK Stack for logging

---

### Phase 3: Java Deployment

**Spring Boot Deployment**:

1. **Build JAR**
   ```bash
   ./mvnw clean package
   ```

2. **Run Application**
   ```bash
   java -jar target/smilefactory-service.jar
   ```

3. **Docker Deployment**
   ```dockerfile
   FROM openjdk:17-jdk-slim
   COPY target/*.jar app.jar
   ENTRYPOINT ["java", "-jar", "/app.jar"]
   ```

4. **Kubernetes Deployment**
   - Use Helm charts
   - Configure auto-scaling
   - Set up health checks
   - Configure ingress

---

## Known Issues & Technical Debt

### Current Limitations

#### Frontend

1. **Mock Data**
   - **Issue**: All data is currently mocked in stores
   - **Impact**: No persistence, data resets on refresh
   - **Resolution**: Connect to backend APIs (Phase 1 completion)
   - **Priority**: High

2. **No Real-Time Updates**
   - **Issue**: No WebSocket implementation
   - **Impact**: Users must refresh to see new content
   - **Resolution**: Implement WebSocket connections
   - **Priority**: Medium

3. **Limited Error Handling**
   - **Issue**: Basic error handling in place
   - **Impact**: Poor user experience on errors
   - **Resolution**: Implement comprehensive error boundaries
   - **Priority**: Medium

4. **No Offline Support**
   - **Issue**: App requires internet connection
   - **Impact**: No functionality when offline
   - **Resolution**: Implement service workers and caching
   - **Priority**: Low

5. **Performance Optimization Needed**
   - **Issue**: No code splitting or lazy loading
   - **Impact**: Large initial bundle size
   - **Resolution**: Implement route-based code splitting
   - **Priority**: Medium

---

#### Backend

1. **Not Implemented**
   - **Issue**: Backend architecture designed but not implemented
   - **Impact**: Frontend cannot function with real data
   - **Resolution**: Complete backend implementation
   - **Priority**: Critical

2. **No Rate Limiting**
   - **Issue**: API endpoints not protected from abuse
   - **Impact**: Potential DDoS vulnerability
   - **Resolution**: Implement rate limiting middleware
   - **Priority**: High

3. **No Caching Strategy**
   - **Issue**: No caching layer for frequently accessed data
   - **Impact**: Increased database load
   - **Resolution**: Implement Redis caching
   - **Priority**: Medium

4. **No File Upload Service**
   - **Issue**: Image uploads not implemented
   - **Impact**: Users cannot upload avatars, post images
   - **Resolution**: Implement file upload service (S3 or similar)
   - **Priority**: High

---

#### Database

1. **No Backup Strategy**
   - **Issue**: No automated backups configured
   - **Impact**: Risk of data loss
   - **Resolution**: Set up automated daily backups
   - **Priority**: Critical

2. **No Database Replication**
   - **Issue**: Single point of failure
   - **Impact**: Downtime if database fails
   - **Resolution**: Set up master-slave replication
   - **Priority**: High

3. **Missing Indexes**
   - **Issue**: Some queries may be slow without proper indexes
   - **Impact**: Performance degradation as data grows
   - **Resolution**: Add indexes based on query patterns
   - **Priority**: Medium

---

#### Security

1. **No Security Audit**
   - **Issue**: Code not reviewed for security vulnerabilities
   - **Impact**: Potential security risks
   - **Resolution**: Conduct security audit before production
   - **Priority**: Critical

2. **No HTTPS Enforcement**
   - **Issue**: Development uses HTTP
   - **Impact**: Insecure data transmission
   - **Resolution**: Enforce HTTPS in production
   - **Priority**: Critical

3. **No Input Sanitization**
   - **Issue**: User input not fully sanitized
   - **Impact**: XSS vulnerability risk
   - **Resolution**: Implement comprehensive input validation
   - **Priority**: High

4. **No CSRF Protection**
   - **Issue**: No CSRF tokens implemented
   - **Impact**: CSRF attack vulnerability
   - **Resolution**: Implement CSRF protection
   - **Priority**: High

---

### Technical Debt

1. **Test Coverage**
   - **Current**: 0% (no tests written)
   - **Target**: 80% frontend, 85% backend
   - **Action**: Write comprehensive test suite

2. **Documentation**
   - **Current**: API documentation incomplete
   - **Target**: Full API documentation with examples
   - **Action**: Complete Swagger/OpenAPI documentation

3. **Code Quality**
   - **Current**: No linting/formatting enforcement
   - **Target**: Automated code quality checks
   - **Action**: Set up ESLint, Prettier, Husky

4. **Accessibility**
   - **Current**: Basic accessibility support
   - **Target**: WCAG 2.1 AA compliance
   - **Action**: Accessibility audit and improvements

5. **Internationalization**
   - **Current**: English only
   - **Target**: Multi-language support
   - **Action**: Implement i18n framework

---

## Roadmap

### Q1 2026: Phase 1 Completion

**Weeks 1-4: Backend Foundation**
- ✅ Set up infrastructure (Supabase, Redis, Docker)
- ✅ Implement API Gateway
- ✅ Implement Auth Service
- ✅ Implement User Service

**Weeks 5-8: Core Features**
- ✅ Implement Feed Service
- ✅ Implement Messaging Service
- ✅ Implement Connection Service
- ✅ Implement Events Service

**Weeks 9-12: Additional Features**
- ✅ Implement Marketplace Service
- ✅ Implement Search Service
- ✅ Implement Notification Service
- ✅ Implement Migration Service

**Weeks 13-16: Integration & Testing**
- ✅ Connect frontend to backend
- ✅ End-to-end testing
- ✅ Performance optimization
- ✅ Security audit

**Week 17-18: Launch Preparation**
- ✅ Production deployment
- ✅ User acceptance testing
- ✅ Documentation finalization
- ✅ Launch!

---

### Q2-Q3 2026: Phase 1 Enhancements

**Features**:
- Advanced search with filters
- Content recommendations
- Analytics dashboard
- Mobile app (React Native)
- Email notifications
- Push notifications
- File upload and management
- Video content support

**Improvements**:
- Performance optimization
- Accessibility improvements
- SEO optimization
- Internationalization
- Advanced caching strategies

---

### Q4 2026 - Q1 2027: Phase 2 Migration

**Months 1-2: Infrastructure**
- Set up self-hosted infrastructure
- Deploy PostgreSQL
- Deploy Keycloak
- Configure monitoring

**Months 3-4: Migration**
- Migrate database
- Migrate authentication
- Update backend services
- Testing and validation

**Months 5-6: Deployment**
- Production deployment
- User migration
- Monitoring and optimization

---

### 2027: Phase 3 - Java Migration

**Q1-Q2**: Migrate non-critical services
**Q3-Q4**: Migrate critical services
**Ongoing**: Testing, optimization, monitoring

---

## Appendix

### Glossary

- **OTP**: One-Time Password
- **JWT**: JSON Web Token
- **RLS**: Row Level Security
- **CRUD**: Create, Read, Update, Delete
- **SSO**: Single Sign-On
- **OIDC**: OpenID Connect
- **LDAP**: Lightweight Directory Access Protocol
- **WCAG**: Web Content Accessibility Guidelines
- **XSS**: Cross-Site Scripting
- **CSRF**: Cross-Site Request Forgery

### References

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Keycloak Documentation](https://www.keycloak.org/documentation)

### Contact

For questions or support, contact the development team.

---

**Document Version**: 1.0
**Last Updated**: November 20, 2025
**Next Review**: December 20, 2025


