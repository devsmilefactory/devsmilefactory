# Implementation Plan

## Phase 1: Project Setup and Infrastructure

- [ ] 1. Set up admin frontend application structure
  - Create `apps/admin` directory with Vite + React + TypeScript configuration
  - Configure Tailwind CSS and shadcn/ui components
  - Set up routing with React Router
  - Configure environment variables and build scripts
  - Add admin workspace to root package.json
  - _Requirements: All requirements depend on this foundation_

- [ ] 2. Set up backend services structure
  - [ ] 2.1 Create admin-api-gateway service
    - Initialize Node.js service in `apps/backend-node/services/admin-api-gateway`
    - Configure Express server with TypeScript
    - Set up middleware (CORS, body-parser, error handling)
    - Configure environment variables
    - _Requirements: 1.1, 1.5, 2.1, 6.1_

  - [ ] 2.2 Create cms-service
    - Initialize Node.js service in `apps/backend-node/services/cms-service`
    - Configure Express server with TypeScript
    - Set up database connection (PostgreSQL)
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 8.1, 9.1_

  - [ ] 2.3 Create monitoring-service
    - Initialize Node.js service in `apps/backend-node/services/monitoring-service`
    - Configure Express server with TypeScript
    - Set up metrics collection infrastructure
    - _Requirements: 5.1, 5.2, 5.3, 10.1_

- [ ] 3. Set up shared types and utilities
  - Create `shared/types/admin` directory with TypeScript interfaces
  - Define core types: AdminUser, Role, Permission, ContentEntity, MediaAsset
  - Create `shared/utils/admin` with validation and helper functions
  - _Requirements: All requirements use shared types_

- [ ] 4. Configure database schema
  - [ ] 4.1 Create database migration files
    - Write migration for users and roles tables
    - Write migration for content and content_versions tables
    - Write migration for categories and tags tables
    - Write migration for media_assets table
    - Write migration for audit_logs table
    - Write migration for system_settings table
    - _Requirements: 2.1, 3.1, 6.1, 7.1, 8.1, 9.1_

  - [ ] 4.2 Create database seed files
    - Seed default admin user
    - Seed default roles (Administrator, Content Manager, Viewer)
    - Seed default permissions
    - Seed initial system settings
    - _Requirements: 2.2, 7.1_

  - [ ] 4.3 Set up database migration tooling
    - Configure migration runner (node-pg-migrate or similar)
    - Add migration scripts to package.json
    - _Requirements: All database-dependent requirements_

## Phase 2: Authentication and Authorization

- [ ] 5. Implement authentication service
  - [ ] 5.1 Create JWT authentication
    - Implement JWT token generation and validation
    - Create access token and refresh token logic
    - Implement token refresh endpoint
    - Store refresh tokens securely
    - _Requirements: 1.1, 1.4_

  - [ ] 5.2 Implement login endpoint
    - Create POST /admin/auth/login endpoint
    - Validate credentials against database
    - Implement account lockout after failed attempts
    - Log authentication attempts
    - _Requirements: 1.1, 1.2, 1.5_

  - [ ] 5.3 Implement MFA functionality
    - Generate TOTP secrets for users
    - Create QR code generation for MFA setup
    - Implement MFA verification endpoint
    - Generate and store backup codes
    - _Requirements: 1.3_

  - [ ] 5.4 Implement session management
    - Create session timeout logic
    - Implement automatic session termination
    - Create session refresh mechanism
    - _Requirements: 1.4_

- [ ] 6. Implement authorization middleware
  - Create role-based access control middleware
  - Implement permission checking logic
  - Create route protection based on roles and permissions
  - Add authorization checks to all admin endpoints
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 7. Build authentication UI components
  - [ ] 7.1 Create login page
    - Build login form with email and password fields
    - Implement form validation
    - Add error handling and display
    - Implement loading states
    - _Requirements: 1.1, 1.2_

  - [ ] 7.2 Create MFA setup and verification
    - Build MFA setup page with QR code display
    - Create MFA verification form
    - Implement backup code display and storage
    - _Requirements: 1.3_

  - [ ] 7.3 Create session management UI
    - Implement session timeout warning modal
    - Create session refresh logic
    - Add automatic logout on session expiry
    - _Requirements: 1.4_

  - [ ] 7.4 Create protected route wrapper
    - Implement ProtectedRoute component
    - Add authentication checks
    - Redirect to login if not authenticated
    - _Requirements: 1.1_

## Phase 3: User Management

- [ ] 8. Implement user management backend
  - [ ] 8.1 Create user CRUD endpoints
    - Implement GET /admin/users (list with pagination, search, filters)
    - Implement POST /admin/users (create user)
    - Implement PUT /admin/users/:id (update user)
    - Implement DELETE /admin/users/:id (deactivate user)
    - _Requirements: 2.1, 2.4, 2.5_

  - [ ] 8.2 Implement role management endpoints
    - Implement GET /admin/roles (list roles)
    - Implement POST /admin/roles (create custom role)
    - Implement PUT /admin/roles/:id (update role)
    - Implement POST /admin/users/:id/roles (assign role to user)
    - _Requirements: 2.2, 2.3_

  - [ ] 8.3 Implement user activity logging
    - Create GET /admin/users/:id/activity endpoint
    - Query audit logs for user-specific actions
    - Return paginated activity history
    - _Requirements: 6.1, 6.2_

- [ ] 9. Build user management UI
  - [ ] 9.1 Create user list page
    - Build user table with pagination
    - Implement search functionality
    - Add filters (role, status, date)
    - Display user information (name, email, role, status, last login)
    - _Requirements: 2.4_

  - [ ] 9.2 Create user form (create/edit)
    - Build form with fields: name, email, role, status
    - Implement form validation
    - Add role selection dropdown
    - Handle create and update operations
    - _Requirements: 2.1, 2.3_

  - [ ] 9.3 Create role management interface
    - Build role list view
    - Create role creation/edit form
    - Implement permission matrix for role configuration
    - _Requirements: 2.2_

  - [ ] 9.4 Create user activity view
    - Build activity log table for specific user
    - Display timestamp, action, resource, outcome
    - Add filtering and search
    - _Requirements: 6.1, 6.2_

## Phase 4: Content Management System

- [ ] 10. Implement CMS backend
  - [ ] 10.1 Create content CRUD endpoints
    - Implement GET /admin/content (list with pagination, filters)
    - Implement POST /admin/content (create content)
    - Implement PUT /admin/content/:id (update content)
    - Implement DELETE /admin/content/:id (delete content)
    - _Requirements: 3.1, 3.2_

  - [ ] 10.2 Implement content publishing workflow
    - Create POST /admin/content/:id/publish endpoint
    - Implement status transitions (draft → published)
    - Update published_at timestamp
    - _Requirements: 3.3_

  - [ ] 10.3 Implement content scheduling
    - Create POST /admin/content/:id/schedule endpoint
    - Store scheduled_at timestamp
    - Implement cron job for scheduled publishing
    - Send notification on successful publish
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 10.4 Implement content versioning
    - Create version snapshot on content update
    - Implement GET /admin/content/:id/versions endpoint
    - Create POST /admin/content/:id/restore/:version endpoint
    - _Requirements: 3.4_

  - [ ] 10.5 Implement category management
    - Create GET /admin/categories endpoint
    - Create POST /admin/categories endpoint
    - Create PUT /admin/categories/:id endpoint
    - Create DELETE /admin/categories/:id endpoint with reassignment
    - Support hierarchical parent-child relationships
    - _Requirements: 8.1, 8.3, 8.4, 8.5_

  - [ ] 10.6 Implement tag management
    - Create GET /admin/tags endpoint
    - Create POST /admin/tags endpoint
    - Implement tag autocomplete suggestions
    - Support multiple tags per content
    - _Requirements: 8.2_

- [ ] 11. Build CMS UI components
  - [ ] 11.1 Create content list page
    - Build content table with pagination
    - Display title, status, author, published date
    - Add filters (status, category, author, date range)
    - Implement search functionality
    - _Requirements: 3.1, 4.2_

  - [ ] 11.2 Create content editor
    - Integrate WYSIWYG editor (TipTap or similar)
    - Add formatting toolbar (bold, italic, headings, lists, links)
    - Implement image insertion
    - Add embedded media support
    - Implement auto-save to draft
    - _Requirements: 3.1, 3.2_

  - [ ] 11.3 Create content metadata form
    - Build form for title, slug, excerpt
    - Add category selection (with validation)
    - Add tag input with autocomplete
    - Add featured image selector
    - _Requirements: 8.1, 8.2, 8.4_

  - [ ] 11.4 Create publish and schedule controls
    - Add "Save Draft" button
    - Add "Publish Now" button
    - Create schedule picker (date and time)
    - Display scheduled content status with countdown
    - Add cancel schedule option
    - _Requirements: 3.2, 3.3, 4.1, 4.2, 4.5_

  - [ ] 11.5 Create version history viewer
    - Build version list with timestamps and authors
    - Implement version comparison view
    - Add restore version functionality
    - _Requirements: 3.4_

  - [ ] 11.6 Create category management UI
    - Build category tree view
    - Implement drag-and-drop reordering
    - Create category form (name, slug, parent)
    - Add delete with reassignment prompt
    - _Requirements: 8.1, 8.3, 8.5_

## Phase 5: Media Management

- [ ] 12. Implement media backend
  - [ ] 12.1 Create media upload endpoint
    - Implement POST /admin/media/upload with multipart form data
    - Validate file types (whitelist: images, PDFs, videos)
    - Enforce file size limit (10MB)
    - Generate unique filenames
    - Store files in designated directory or S3
    - _Requirements: 3.5, 9.2_

  - [ ] 12.2 Implement image processing
    - Generate thumbnail variant (150x150)
    - Generate medium variant (600x600)
    - Generate large variant (1200x1200)
    - Store variant URLs in database
    - _Requirements: 9.3_

  - [ ] 12.3 Create media library endpoints
    - Implement GET /admin/media (list with pagination, filters)
    - Add filters by file type and upload date
    - Implement search by filename
    - Create DELETE /admin/media/:id with usage check
    - _Requirements: 9.1, 9.4, 9.5_

- [ ] 13. Build media management UI
  - [ ] 13.1 Create media library page
    - Build grid view with thumbnail previews
    - Display filename, size, upload date
    - Implement search and filters
    - Add pagination
    - _Requirements: 9.1_

  - [ ] 13.2 Create media uploader
    - Build drag-and-drop upload zone
    - Support bulk upload (up to 20 files)
    - Display upload progress bars
    - Show success/error messages
    - _Requirements: 9.2_

  - [ ] 13.3 Create media selector modal
    - Build modal for selecting media in content editor
    - Display media library grid
    - Add search and filter
    - Implement media selection and insertion
    - _Requirements: 3.1, 9.1_

  - [ ] 13.4 Create storage usage display
    - Show total storage used and available
    - Display warning at 80% capacity
    - Show storage breakdown by file type
    - _Requirements: 9.4_

## Phase 6: System Monitoring

- [ ] 14. Implement monitoring backend
  - [ ] 14.1 Create service health checking
    - Implement health check polling for all services
    - Poll health endpoints every 30 seconds
    - Calculate uptime percentage
    - Measure response time
    - _Requirements: 5.1, 5.5_

  - [ ] 14.2 Implement metrics collection
    - Collect CPU and memory usage from Docker stats
    - Aggregate request counts from API gateway logs
    - Calculate error rates from logs
    - Measure average latency
    - Store metrics in time-series format
    - _Requirements: 5.1, 5.4_

  - [ ] 14.3 Create metrics endpoints
    - Implement GET /admin/monitoring/services (current status)
    - Implement GET /admin/monitoring/metrics (time-series data)
    - Support time range queries (24h, 7d, 30d)
    - _Requirements: 5.1, 5.2, 5.4_

  - [ ] 14.4 Implement alerting system
    - Define alert rules (CPU > 80% for 5 minutes)
    - Check alert conditions every minute
    - Generate alerts when thresholds exceeded
    - Create GET /admin/monitoring/alerts endpoint
    - Implement alert acknowledgment
    - _Requirements: 5.3, 10.1, 10.3_

  - [ ] 14.5 Implement notification delivery
    - Send in-app notifications for alerts
    - Implement email notification delivery
    - Support webhook notifications
    - Deliver notifications within 60 seconds
    - _Requirements: 10.1, 10.2, 10.3_

- [ ] 15. Build monitoring UI
  - [ ] 15.1 Create service health dashboard
    - Build service status cards (operational, degraded, offline)
    - Display uptime percentage
    - Show last checked timestamp
    - Display response time
    - _Requirements: 5.5_

  - [ ] 15.2 Create metrics charts
    - Build time-series charts using Recharts
    - Display CPU usage graph
    - Display memory usage graph
    - Display request latency graph
    - Add time range selector (24h, 7d, 30d)
    - Implement auto-refresh every 30 seconds
    - _Requirements: 5.1, 5.2, 5.4_

  - [ ] 15.3 Create alert panel
    - Build alert list with severity indicators
    - Display warning and critical alerts
    - Show alert timestamp and message
    - Add acknowledge button
    - Filter by severity and status
    - _Requirements: 5.3, 10.1_

  - [ ] 15.4 Create notification center
    - Build notification dropdown in header
    - Display recent notifications
    - Show unread count badge
    - Add mark as read functionality
    - Link to full notification history
    - _Requirements: 10.1, 10.5_

## Phase 7: Audit Logging and Settings

- [ ] 16. Implement audit logging
  - [ ] 16.1 Create audit log middleware
    - Capture all admin API requests
    - Log user, action, resource, timestamp, IP, user agent
    - Store outcome (success/failure)
    - Capture request/response changes
    - _Requirements: 1.5, 6.1_

  - [ ] 16.2 Create audit log endpoints
    - Implement GET /admin/audit (list with pagination)
    - Add filters (date range, user, action type, resource)
    - Implement search functionality
    - Return results within 2 seconds for 90-day queries
    - _Requirements: 6.2, 6.3, 6.4_

  - [ ] 16.3 Implement log retention
    - Create cleanup job for logs older than 365 days
    - Schedule daily cleanup
    - _Requirements: 6.5_

- [ ] 17. Build audit log UI
  - Build audit log table with pagination
  - Display timestamp, user, action, resource, outcome
  - Add filters (date range, user, action type, resource)
  - Implement search functionality
  - Add detail view for log entries
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 18. Implement system settings
  - [ ] 18.1 Create settings endpoints
    - Implement GET /admin/settings (list all settings)
    - Implement PUT /admin/settings/:key (update setting)
    - Validate setting values based on type
    - Apply changes to services within 30 seconds
    - Log all setting changes
    - _Requirements: 7.1, 7.2, 7.4_

  - [ ] 18.2 Implement settings rollback
    - Store setting history
    - Create GET /admin/settings/:key/history endpoint
    - Implement rollback to previous value
    - Support rollback within 30 days
    - _Requirements: 7.5_

- [ ] 19. Build system settings UI
  - Build settings page with grouped sections
  - Create setting input fields based on type (string, number, boolean, JSON)
  - Display current value and last modified info
  - Add confirmation modal for critical settings
  - Implement setting update with validation
  - Show setting history and rollback option
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

## Phase 8: Layout and Navigation

- [ ] 20. Build admin layout components
  - [ ] 20.1 Create main layout
    - Build AdminLayout component with sidebar and header
    - Implement responsive design
    - Add mobile menu toggle
    - _Requirements: All UI requirements_

  - [ ] 20.2 Create sidebar navigation
    - Build sidebar with navigation menu
    - Implement role-based menu item visibility
    - Add active route highlighting
    - Create collapsible menu sections
    - _Requirements: 2.2, 2.3_

  - [ ] 20.3 Create header component
    - Build header with user menu
    - Add notification center dropdown
    - Implement global search
    - Add logout functionality
    - _Requirements: 10.1, 10.5_

  - [ ] 20.4 Create breadcrumb navigation
    - Build breadcrumb component
    - Auto-generate breadcrumbs from route
    - Add clickable navigation
    - _Requirements: All UI requirements_

## Phase 9: Integration and Testing

- [ ] 21. Write backend tests
  - [ ] 21.1 Write authentication tests
    - Test login endpoint with valid/invalid credentials
    - Test MFA verification
    - Test session management
    - Test JWT token generation and validation
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ] 21.2 Write authorization tests
    - Test role-based access control
    - Test permission checking
    - Test unauthorized access attempts
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ] 21.3 Write CMS tests
    - Test content CRUD operations
    - Test publishing workflow
    - Test scheduling functionality
    - Test versioning
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1_

  - [ ] 21.4 Write media tests
    - Test file upload with validation
    - Test image processing
    - Test media library queries
    - _Requirements: 9.1, 9.2, 9.3_

- [ ] 22. Write frontend tests
  - [ ] 22.1 Write authentication flow tests
    - Test login form submission
    - Test MFA setup and verification
    - Test session timeout handling
    - _Requirements: 1.1, 1.3, 1.4_

  - [ ] 22.2 Write content management tests
    - Test content creation and editing
    - Test publishing and scheduling
    - Test version history
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ] 22.3 Write user management tests
    - Test user creation and editing
    - Test role assignment
    - Test user deactivation
    - _Requirements: 2.1, 2.3, 2.5_

- [ ] 23. Set up deployment configuration
  - [ ] 23.1 Create Docker configurations
    - Create Dockerfile for admin frontend
    - Create Dockerfile for admin services
    - Configure docker-compose for admin stack
    - _Requirements: All requirements_

  - [ ] 23.2 Configure Nginx
    - Set up Nginx config for admin subdomain
    - Configure proxy to admin API gateway
    - Set up SSL/TLS certificates
    - _Requirements: All requirements_

  - [ ] 23.3 Create deployment scripts
    - Write deployment script for admin frontend
    - Write deployment script for admin services
    - Add health check verification
    - Update main deploy-all script
    - _Requirements: All requirements_

  - [ ] 23.4 Configure environment variables
    - Create .env.example for admin frontend
    - Create .env.example for admin services
    - Document all required variables
    - _Requirements: All requirements_

## Phase 10: Documentation and Polish

- [ ] 24. Create documentation
  - Write admin dashboard user guide
  - Document API endpoints
  - Create deployment guide for admin stack
  - Write troubleshooting guide
  - _Requirements: All requirements_

- [ ] 25. Implement error handling and validation
  - Add comprehensive error messages
  - Implement form validation across all forms
  - Add loading states to all async operations
  - Implement optimistic UI updates where appropriate
  - _Requirements: All requirements_

- [ ] 26. Performance optimization
  - Implement code splitting for admin routes
  - Add lazy loading for heavy components
  - Optimize database queries with indexes
  - Implement caching for frequently accessed data
  - _Requirements: 5.2, 6.3_

- [ ] 27. Security hardening
  - Implement rate limiting on all endpoints
  - Add CSRF protection
  - Configure secure headers
  - Implement input sanitization
  - Set up security scanning
  - _Requirements: 1.2, 3.5, 9.2_
