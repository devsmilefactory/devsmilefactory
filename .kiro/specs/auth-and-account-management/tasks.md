# Implementation Plan

- [ ] 1. Set up Auth Service project structure with NestJS
  - Create auth-service directory in services/
  - Initialize NestJS project with CLI: `nest new auth-service`
  - Install dependencies: @supabase/supabase-js, @nestjs/typeorm, typeorm, pg, @nestjs-modules/ioredis, ioredis
  - Install additional: class-validator, class-transformer, @nestjs/swagger, @nestjs/config
  - Configure hexagonal architecture folder structure (presentation, application, domain, infrastructure)
  - Create .env.example with required environment variables
  - Configure TypeScript with strict mode and path aliases
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 2. Define domain layer (framework-agnostic)
  - [ ] 2.1 Create domain entities
    - Create Account entity class with validation logic
    - Create Identifier value object for email/phone validation
    - _Requirements: 8.1, 8.5_
  
  - [ ] 2.2 Define domain ports (interfaces)
    - Create IAuthProvider port interface with signInWithOtp, verifyOtp, refreshSession, signOut, getUser methods
    - Create IAccountRepository port interface with CRUD methods
    - Create ICacheService port interface with get, set, delete, incr, expire, ttl methods
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 3.1, 3.2, 4.1, 4.4, 5.1, 5.3, 6.1, 6.2_

- [ ] 3. Implement infrastructure adapters
  - [ ] 3.1 Create SupabaseAuthAdapter implementing IAuthProvider
    - Inject ConfigService for Supabase credentials
    - Implement signInWithOtp for email and phone
    - Implement verifyOtp for email and phone
    - Implement refreshSession method
    - Implement signOut method
    - Implement getUser method for token validation
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 3.1, 3.2, 4.1, 4.4, 6.1, 6.2_

  - [ ] 3.2 Create TypeORM entities and repository
    - Create AccountEntity with TypeORM decorators (@Entity, @Column, @Index)
    - Add supabase_user_id, email, phone columns with proper types
    - Add created_at and updated_at timestamp columns
    - Create TypeOrmAccountRepository implementing IAccountRepository
    - Implement findBySupabaseUserId, create, update, delete methods
    - Add domain-to-entity and entity-to-domain mapping methods
    - _Requirements: 8.1, 8.2, 8.4, 8.5_

  - [ ] 3.3 Create RedisCacheAdapter implementing ICacheService
    - Inject Redis client from @nestjs-modules/ioredis
    - Implement get, set, delete methods
    - Implement incr, expire, ttl methods for rate limiting
    - _Requirements: 5.1, 5.3, 6.5_

- [ ] 4. Create database migrations
  - Configure TypeORM migrations in data source configuration
  - Generate migration for accounts table with all columns and indexes
  - Add CHECK constraint ensuring email OR phone is present
  - Create migration script commands in package.json
  - _Requirements: 8.1, 8.5_

- [ ] 5. Build application services (use case layer)
  - [ ] 5.1 Create RateLimiterService
    - Inject ICacheService
    - Implement checkOtpRequestLimit with 5 attempts per 15 minutes
    - Implement getRemainingTime method
    - Implement identifier hashing for privacy
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

  - [ ] 5.2 Create AccountSyncService
    - Inject IAccountRepository
    - Implement createPlatformAccount method
    - Implement updatePlatformAccount method
    - Implement deletePlatformAccount method
    - _Requirements: 8.1, 8.2, 8.4_

  - [ ] 5.3 Create WebhookHandlerService
    - Inject AccountSyncService and ConfigService
    - Implement verifySignature using HMAC SHA256
    - Implement handleWebhook for user.created, user.updated, user.deleted events
    - _Requirements: 8.2_

  - [ ] 5.4 Create AuthService (main orchestration service)
    - Inject IAuthProvider, IAccountRepository, ICacheService, RateLimiterService, AccountSyncService
    - Implement requestOtp method with rate limiting
    - Implement verifyOtp method with account creation for new users
    - Implement refreshToken method
    - Implement logout method with cache invalidation
    - Implement getCurrentUser method with token validation and caching
    - Add private helper methods for token hashing and DTO mapping
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 4.4, 4.5, 6.1, 6.2, 6.3, 6.4, 6.5, 8.1, 8.3_

- [ ] 6. Create DTOs with validation
  - [ ] 6.1 Create request DTOs
    - Create RequestOtpDto with identifier field and validation decorators
    - Create VerifyOtpDto with identifier, otp, clientMetadata fields
    - Create RefreshTokenDto with refreshToken field
    - Add class-validator decorators (@IsString, @IsNotEmpty, @Matches)
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ] 6.2 Create response DTOs
    - Create OtpRequestResponse DTO
    - Create AuthResponse DTO with tokens, user, isNewUser, platformAccountId
    - Create TokenResponse DTO
    - Create LogoutResponse DTO
    - Create UserProfileResponse DTO
    - Add Swagger decorators (@ApiProperty) for OpenAPI documentation
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.3_

- [ ] 7. Implement controllers (presentation layer)
  - [ ] 7.1 Create AuthController
    - Add @Controller('auth') and @ApiTags decorators
    - Inject AuthService
    - Implement POST /auth/request-otp endpoint with @Post, @HttpCode, @ApiOperation decorators
    - Implement POST /auth/verify-otp endpoint
    - Implement POST /auth/refresh endpoint
    - Implement POST /auth/logout endpoint with @ApiBearerAuth
    - Implement GET /auth/me endpoint with @ApiBearerAuth
    - Add proper HTTP status codes and Swagger documentation
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 4.4, 4.5, 5.1, 5.2, 6.4, 7.1, 7.2, 7.3, 7.4, 8.3_

  - [ ] 7.2 Create WebhookController
    - Add @Controller('auth/webhooks') decorator
    - Inject WebhookHandlerService
    - Implement POST /auth/webhooks/supabase endpoint
    - Extract signature from X-Supabase-Signature header
    - Verify signature and handle webhook events
    - Return 200 acknowledgment
    - _Requirements: 8.2_

- [ ] 8. Configure NestJS modules
  - [ ] 8.1 Create AuthModule
    - Import ConfigModule, TypeOrmModule.forFeature([AccountEntity]), RedisModule
    - Register all controllers (AuthController, WebhookController)
    - Register all services (AuthService, RateLimiterService, AccountSyncService, WebhookHandlerService)
    - Bind infrastructure adapters to domain ports using provider tokens
    - Export AuthService for use in other modules
    - _Requirements: All_

  - [ ] 8.2 Configure AppModule
    - Import ConfigModule.forRoot() for environment variables
    - Import TypeOrmModule.forRoot() with PostgreSQL configuration
    - Import RedisModule.forRoot() with Redis configuration
    - Import AuthModule
    - Configure global validation pipe
    - Configure Swagger documentation
    - _Requirements: All_

- [ ] 9. Add global error handling and logging
  - [ ] 9.1 Create HttpExceptionFilter
    - Implement catch() method for exception handling
    - Map Supabase errors to standardized error responses
    - Return error_code, message, timestamp in response
    - Log errors without exposing sensitive data
    - _Requirements: 7.5_

  - [ ] 9.2 Create LoggingInterceptor
    - Implement intercept() method for request/response logging
    - Log request method, URL, correlation ID
    - Log response status and duration
    - Mask sensitive data (tokens, OTPs, passwords)
    - _Requirements: 7.5_

- [ ] 10. Add health check endpoint
  - Install @nestjs/terminus package
  - Create HealthController with GET /health endpoint
  - Add TypeOrmHealthIndicator for PostgreSQL check
  - Add custom health indicator for Redis connectivity
  - Add custom health indicator for Supabase connectivity
  - Return service status and dependency health

- [ ] 11. Configure Swagger/OpenAPI documentation
  - Configure SwaggerModule in main.ts bootstrap
  - Set API title, description, version
  - Add bearer auth security scheme
  - Generate OpenAPI JSON spec at /api-docs
  - Ensure all DTOs have @ApiProperty decorators
  - Document all error responses

- [ ] 12. Create Docker configuration
  - Write multi-stage Dockerfile for auth-service (build and production stages)
  - Create docker-compose.yml for local development with Redis and PostgreSQL services
  - Add health check configuration in Dockerfile
  - Create .dockerignore file
  - Document environment variables in README

- [ ] 13. Add configuration management
  - Create configuration files in src/config/
  - Create database.config.ts for TypeORM configuration
  - Create redis.config.ts for Redis configuration
  - Create supabase.config.ts for Supabase configuration
  - Use ConfigService to load environment variables
  - Add validation schema for required environment variables
