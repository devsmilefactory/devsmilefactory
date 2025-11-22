# Admin Dashboard and CMS Design Document

## Overview

The Admin Dashboard and CMS will be implemented as a separate application within the SmileFactory monorepo at `apps/admin`. It will be a React-based single-page application (SPA) using the same technology stack as the main frontend (React + Vite + shadcn/ui + TypeScript) to maintain consistency and leverage shared components. The admin application will communicate with both backend-node and backend-java services through a dedicated admin API layer with enhanced security and authentication.

### Key Design Principles

1. **Security First**: All admin operations require authentication, authorization, and audit logging
2. **Separation of Concerns**: Admin functionality is isolated from public-facing applications
3. **Reusability**: Leverage existing shared components and utilities from the monorepo
4. **Scalability**: Design for future expansion of admin features
5. **User Experience**: Intuitive interface for non-technical content managers

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Admin Dashboard (SPA)                    │
│                  apps/admin (React + Vite)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Module  │  │  CMS Module  │  │ System Module│      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Admin API      │
                    │  Gateway        │
                    │  (backend-node) │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────┐  ┌─────────────┐  ┌─────────────┐
│ Auth Service    │  │ CMS Service │  │ Monitoring  │
│ (backend-node)  │  │(backend-node)│  │   Service   │
└─────────────────┘  └─────────────┘  └─────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Database      │
                    │  (PostgreSQL)   │
                    └─────────────────┘
```

### Directory Structure

```
/smilefactory
├─ /apps
│   ├─ /admin                      # New admin dashboard application
│   │   ├─ /src
│   │   │   ├─ /components         # Admin-specific components
│   │   │   │   ├─ /auth           # Authentication components
│   │   │   │   ├─ /cms            # CMS components
│   │   │   │   ├─ /users          # User management components
│   │   │   │   ├─ /monitoring     # System monitoring components
│   │   │   │   └─ /layout         # Layout components (sidebar, header)
│   │   │   ├─ /pages              # Page components
│   │   │   │   ├─ /dashboard      # Dashboard home
│   │   │   │   ├─ /content        # Content management pages
│   │   │   │   ├─ /users          # User management pages
│   │   │   │   ├─ /media          # Media library pages
│   │   │   │   ├─ /settings       # System settings pages
│   │   │   │   └─ /audit          # Audit log pages
│   │   │   ├─ /hooks              # Custom React hooks
│   │   │   ├─ /services           # API service layer
│   │   │   ├─ /stores             # State management (Zustand)
│   │   │   ├─ /types              # TypeScript types
│   │   │   ├─ /utils              # Utility functions
│   │   │   ├─ App.tsx             # Main app component
│   │   │   └─ main.tsx            # Entry point
│   │   ├─ package.json
│   │   ├─ vite.config.ts
│   │   └─ tsconfig.json
│   ├─ /frontend                   # Existing public frontend
│   ├─ /backend-node
│   │   └─ /services
│   │       ├─ /admin-api-gateway  # New admin API gateway
│   │       ├─ /cms-service        # New CMS service
│   │       └─ /monitoring-service # New monitoring service
│   └─ /backend-java
├─ /shared
│   ├─ /types
│   │   └─ /admin                  # Shared admin types
│   └─ /utils
│       └─ /admin                  # Shared admin utilities
└─ /deployment
    └─ /compose
        └─ /admin                  # Admin deployment configs
```

## Components and Interfaces

### Frontend Components

#### 1. Authentication Module

**Components:**
- `LoginForm`: Multi-factor authentication login
- `MFASetup`: MFA configuration for new users
- `SessionManager`: Handles session timeout and renewal
- `ProtectedRoute`: Route guard for authenticated pages

**State Management:**
```typescript
interface AuthState {
  user: AdminUser | null;
  token: string | null;
  mfaRequired: boolean;
  sessionExpiry: Date | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  verifyMFA: (code: string) => Promise<void>;
  refreshSession: () => Promise<void>;
}
```

#### 2. CMS Module

**Components:**
- `ContentEditor`: Rich text WYSIWYG editor (using TipTap or similar)
- `ContentList`: Paginated list with filters and search
- `ContentVersionHistory`: Version comparison and restore
- `MediaUploader`: Drag-and-drop file upload with progress
- `MediaLibrary`: Grid view of media assets with search
- `CategoryManager`: Tree view for hierarchical categories
- `TagManager`: Tag creation and assignment
- `PublishScheduler`: Date/time picker for scheduled publishing

**State Management:**
```typescript
interface CMSState {
  currentContent: ContentEntity | null;
  contentList: ContentEntity[];
  categories: Category[];
  tags: Tag[];
  mediaLibrary: MediaAsset[];
  saveContent: (content: ContentEntity) => Promise<void>;
  publishContent: (id: string) => Promise<void>;
  scheduleContent: (id: string, publishDate: Date) => Promise<void>;
  uploadMedia: (files: File[]) => Promise<MediaAsset[]>;
}
```

#### 3. User Management Module

**Components:**
- `UserList`: Searchable, filterable user table
- `UserForm`: Create/edit user with role assignment
- `RoleManager`: RBAC role configuration
- `PermissionMatrix`: Visual permission assignment grid
- `UserActivityLog`: User-specific audit trail

**State Management:**
```typescript
interface UserManagementState {
  users: User[];
  roles: Role[];
  permissions: Permission[];
  createUser: (user: CreateUserDto) => Promise<User>;
  updateUser: (id: string, updates: Partial<User>) => Promise<User>;
  assignRole: (userId: string, roleId: string) => Promise<void>;
  deactivateUser: (userId: string) => Promise<void>;
}
```

#### 4. System Monitoring Module

**Components:**
- `ServiceHealthDashboard`: Real-time service status cards
- `MetricsChart`: Time-series charts using Recharts
- `AlertPanel`: Active alerts and warnings
- `LogViewer`: Searchable log viewer with filters
- `PerformanceMetrics`: CPU, memory, and latency graphs

**State Management:**
```typescript
interface MonitoringState {
  services: ServiceStatus[];
  metrics: SystemMetrics;
  alerts: Alert[];
  logs: LogEntry[];
  refreshMetrics: () => Promise<void>;
  acknowledgeAlert: (alertId: string) => Promise<void>;
}
```

#### 5. Layout Components

**Components:**
- `AdminLayout`: Main layout with sidebar and header
- `Sidebar`: Navigation menu with role-based visibility
- `Header`: User menu, notifications, and search
- `Breadcrumbs`: Navigation breadcrumb trail
- `NotificationCenter`: Real-time notification dropdown

### Backend Services

#### 1. Admin API Gateway

**Purpose**: Single entry point for all admin operations with authentication and rate limiting

**Endpoints:**
```
POST   /admin/auth/login
POST   /admin/auth/mfa/verify
POST   /admin/auth/refresh
POST   /admin/auth/logout

GET    /admin/users
POST   /admin/users
PUT    /admin/users/:id
DELETE /admin/users/:id
GET    /admin/users/:id/activity

GET    /admin/content
POST   /admin/content
PUT    /admin/content/:id
DELETE /admin/content/:id
POST   /admin/content/:id/publish
POST   /admin/content/:id/schedule
GET    /admin/content/:id/versions

POST   /admin/media/upload
GET    /admin/media
DELETE /admin/media/:id

GET    /admin/monitoring/services
GET    /admin/monitoring/metrics
GET    /admin/monitoring/alerts
GET    /admin/monitoring/logs

GET    /admin/audit
GET    /admin/settings
PUT    /admin/settings/:key
```

**Middleware:**
- JWT authentication with admin role verification
- Rate limiting (100 requests per minute per user)
- Request logging for audit trail
- CORS configuration for admin domain only

#### 2. CMS Service

**Responsibilities:**
- Content CRUD operations
- Version control and history
- Publishing workflow
- Scheduled publishing (cron job)
- Media asset management
- Category and tag management

**Database Schema:**
```sql
-- Content table
CREATE TABLE content (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  body TEXT,
  status VARCHAR(20) NOT NULL, -- draft, published, scheduled, archived
  author_id UUID NOT NULL,
  published_at TIMESTAMP,
  scheduled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  version INT DEFAULT 1
);

-- Content versions table
CREATE TABLE content_versions (
  id UUID PRIMARY KEY,
  content_id UUID REFERENCES content(id),
  version INT NOT NULL,
  title VARCHAR(255),
  body TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Content-Category junction
CREATE TABLE content_categories (
  content_id UUID REFERENCES content(id),
  category_id UUID REFERENCES categories(id),
  PRIMARY KEY (content_id, category_id)
);

-- Content-Tag junction
CREATE TABLE content_tags (
  content_id UUID REFERENCES content(id),
  tag_id UUID REFERENCES tags(id),
  PRIMARY KEY (content_id, tag_id)
);

-- Media assets table
CREATE TABLE media_assets (
  id UUID PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes BIGINT NOT NULL,
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. Monitoring Service

**Responsibilities:**
- Collect metrics from all platform services
- Health check polling
- Alert generation based on thresholds
- Log aggregation
- Performance metrics calculation

**Metrics Collection:**
- Service health status (HTTP health endpoints)
- CPU and memory usage (Docker stats API)
- Request latency (from API gateway logs)
- Error rates (from application logs)
- Database connection pool stats

**Alert Rules:**
```typescript
interface AlertRule {
  id: string;
  name: string;
  condition: string; // e.g., "cpu_usage > 80"
  duration: number; // seconds
  severity: 'warning' | 'critical';
  notificationChannels: string[]; // email, webhook, in-app
}
```

## Data Models

### Core Types

```typescript
// User and Authentication
interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  mfaEnabled: boolean;
  lastLogin: Date;
  createdAt: Date;
  status: 'active' | 'inactive' | 'locked';
}

interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  description: string;
}

interface Permission {
  id: string;
  resource: string; // e.g., 'content', 'users', 'settings'
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

// Content Management
interface ContentEntity {
  id: string;
  title: string;
  slug: string;
  body: string;
  excerpt?: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  authorId: string;
  author?: AdminUser;
  categories: Category[];
  tags: Tag[];
  featuredImage?: MediaAsset;
  publishedAt?: Date;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

interface ContentVersion {
  id: string;
  contentId: string;
  version: number;
  title: string;
  body: string;
  createdBy: string;
  createdAt: Date;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  children?: Category[];
  contentCount: number;
}

interface Tag {
  id: string;
  name: string;
  contentCount: number;
}

interface MediaAsset {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  thumbnailUrl?: string;
  uploadedBy: string;
  createdAt: Date;
}

// Monitoring
interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'offline';
  uptime: number; // percentage
  lastChecked: Date;
  responseTime: number; // milliseconds
}

interface SystemMetrics {
  timestamp: Date;
  services: {
    [serviceName: string]: {
      cpuUsage: number; // percentage
      memoryUsage: number; // percentage
      requestCount: number;
      errorRate: number; // percentage
      avgLatency: number; // milliseconds
    };
  };
}

interface Alert {
  id: string;
  severity: 'warning' | 'critical';
  title: string;
  message: string;
  service: string;
  createdAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolved: boolean;
}

// Audit Logging
interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string; // e.g., 'user.create', 'content.publish'
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  changes?: Record<string, any>;
  outcome: 'success' | 'failure';
  errorMessage?: string;
}

// System Configuration
interface SystemSetting {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json';
  description: string;
  lastModified: Date;
  modifiedBy: string;
}
```

## Error Handling

### Frontend Error Handling

**Strategy:**
- Global error boundary for React component errors
- API error interceptor in Axios/Fetch client
- Toast notifications for user-facing errors
- Error logging to monitoring service

**Error Types:**
```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode: number;
}

// Error codes
const ERROR_CODES = {
  UNAUTHORIZED: 'AUTH_001',
  FORBIDDEN: 'AUTH_002',
  SESSION_EXPIRED: 'AUTH_003',
  VALIDATION_ERROR: 'VAL_001',
  NOT_FOUND: 'RES_001',
  CONFLICT: 'RES_002',
  SERVER_ERROR: 'SYS_001',
  SERVICE_UNAVAILABLE: 'SYS_002',
};
```

### Backend Error Handling

**Strategy:**
- Centralized error handler middleware
- Structured error responses
- Error logging with context
- Automatic retry for transient failures

**Error Response Format:**
```json
{
  "error": {
    "code": "VAL_001",
    "message": "Validation failed",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  },
  "timestamp": "2025-11-15T10:30:00Z",
  "path": "/admin/users",
  "requestId": "req_abc123"
}
```

## Testing Strategy

### Frontend Testing

**Unit Tests:**
- Component rendering tests (React Testing Library)
- Hook logic tests
- Utility function tests
- State management tests

**Integration Tests:**
- User flow tests (login, content creation, publishing)
- API integration tests with mock server
- Form validation tests

**E2E Tests:**
- Critical path testing (Playwright or Cypress)
- Authentication flow
- Content publishing workflow
- User management workflow

### Backend Testing

**Unit Tests:**
- Service method tests
- Validation logic tests
- Utility function tests

**Integration Tests:**
- API endpoint tests with test database
- Database query tests
- Authentication middleware tests
- Rate limiting tests

**Performance Tests:**
- Load testing for API endpoints
- Database query performance
- Concurrent user simulation

## Security Considerations

### Authentication and Authorization

1. **JWT Tokens:**
   - Short-lived access tokens (15 minutes)
   - Refresh tokens (7 days) stored in httpOnly cookies
   - Token rotation on refresh

2. **Multi-Factor Authentication:**
   - TOTP-based (Time-based One-Time Password)
   - QR code generation for setup
   - Backup codes for recovery

3. **Role-Based Access Control:**
   - Granular permissions per resource
   - Permission checks at API gateway and service level
   - UI elements hidden based on permissions

### Data Security

1. **Input Validation:**
   - Schema validation using Zod
   - SQL injection prevention (parameterized queries)
   - XSS prevention (content sanitization)

2. **File Upload Security:**
   - File type validation (whitelist)
   - File size limits
   - Virus scanning (ClamAV integration)
   - Secure file storage (S3 or local with restricted access)

3. **Audit Logging:**
   - All admin actions logged
   - Immutable audit trail
   - Regular audit log reviews

### Network Security

1. **CORS Configuration:**
   - Whitelist admin domain only
   - Credentials allowed for authenticated requests

2. **Rate Limiting:**
   - Per-user rate limits
   - IP-based rate limits for login attempts
   - Exponential backoff for failed attempts

3. **HTTPS Only:**
   - Force HTTPS in production
   - Secure cookie flags
   - HSTS headers

## Performance Optimization

### Frontend Optimization

1. **Code Splitting:**
   - Route-based code splitting
   - Lazy loading for heavy components (editor, charts)
   - Dynamic imports for admin modules

2. **Caching:**
   - React Query for API response caching
   - Service worker for static assets
   - LocalStorage for user preferences

3. **Rendering Optimization:**
   - Virtual scrolling for large lists
   - Debounced search inputs
   - Optimistic UI updates

### Backend Optimization

1. **Database Optimization:**
   - Indexed columns for frequent queries
   - Connection pooling
   - Query result caching (Redis)

2. **API Optimization:**
   - Pagination for list endpoints
   - Field selection (GraphQL-style)
   - Response compression (gzip)

3. **Monitoring Optimization:**
   - Batch metric collection
   - Aggregated metrics storage
   - Efficient log querying (Elasticsearch)

## Deployment Strategy

### Docker Configuration

**Admin Frontend Container:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

**Admin Services Container:**
- Separate containers for admin-api-gateway, cms-service, monitoring-service
- Shared network with existing backend services
- Environment-based configuration

### Nginx Configuration

```nginx
server {
  listen 80;
  server_name admin.smilefactory.com;

  location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
  }

  location /admin/api {
    proxy_pass http://admin-api-gateway:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

### Environment Variables

```env
# Admin Frontend
VITE_ADMIN_API_URL=http://localhost:3001
VITE_APP_NAME=SmileFactory Admin
VITE_SESSION_TIMEOUT=1800000

# Admin API Gateway
PORT=3001
JWT_SECRET=<secret>
JWT_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
MFA_ISSUER=SmileFactory
DATABASE_URL=postgresql://user:pass@db:5432/smilefactory
REDIS_URL=redis://redis:6379

# CMS Service
PORT=3002
DATABASE_URL=postgresql://user:pass@db:5432/smilefactory
MEDIA_STORAGE_PATH=/app/media
MAX_FILE_SIZE=10485760

# Monitoring Service
PORT=3003
METRICS_INTERVAL=30000
ALERT_CHECK_INTERVAL=60000
LOG_RETENTION_DAYS=90
```

## Migration and Integration

### Integration with Existing Services

1. **Shared Authentication:**
   - Extend existing auth-service for admin authentication
   - Add admin role and permissions to user model
   - Reuse JWT infrastructure

2. **Shared Database:**
   - Add admin tables to existing PostgreSQL database
   - Use separate schema for admin data
   - Implement database migrations

3. **Shared Components:**
   - Import UI components from shared library
   - Reuse utility functions and types
   - Maintain consistent styling with main frontend

### Data Migration

1. **Initial Setup:**
   - Create default admin user
   - Seed default roles and permissions
   - Initialize system settings

2. **Content Migration:**
   - Import existing content (if any)
   - Generate slugs and metadata
   - Assign default categories

## Future Enhancements

1. **Advanced CMS Features:**
   - Multi-language content support
   - Content workflow (draft → review → publish)
   - Content templates and blocks
   - SEO optimization tools

2. **Enhanced Monitoring:**
   - Custom dashboard builder
   - Advanced alerting rules
   - Integration with external monitoring tools (Datadog, New Relic)

3. **Collaboration Features:**
   - Real-time collaborative editing
   - Comment system for content review
   - Activity feed for team members

4. **API Management:**
   - API key management
   - Rate limit configuration per client
   - API usage analytics

5. **Backup and Recovery:**
   - Automated database backups
   - Point-in-time recovery
   - Content export/import tools
