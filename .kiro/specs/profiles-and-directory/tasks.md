# Implementation Plan

- [ ] 1. Set up Profile Service project structure with NestJS
  - Create profile-service directory in services/
  - Initialize NestJS project with CLI
  - Install dependencies: @nestjs/typeorm, typeorm, pg, @nestjs-modules/ioredis, ioredis, class-validator, class-transformer, @nestjs/swagger, @nestjs/config
  - Configure hexagonal architecture folder structure
  - Create .env.example with required environment variables
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 2. Define domain layer
  - [ ] 2.1 Create domain entities and enums
    - Create ProfileType enum with all profile types
    - Create Profile entity class with all fields and validation logic
    - Implement validate() method checking display_name, bio, tags constraints
    - Implement addTag() and removeTag() methods with normalization
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.5, 3.1, 3.2, 3.4, 3.5, 11.1, 11.2, 11.4_

  - [ ] 2.2 Define domain ports
    - Create IProfileRepository port with CRUD and search methods
    - Create IEventPublisher port for domain events
    - Create ICacheService port for caching
    - _Requirements: All_

- [ ] 3. Implement infrastructure layer
  - [ ] 3.1 Create TypeORM entities
    - Create ProfileEntity with all columns and TypeORM decorators
    - Add indexes on account_id, profile_type, location, visibility, created_at
    - Add GIN index on tags array for efficient searching
    - Add CHECK constraints for display_name length, bio length, visibility values
    - _Requirements: 2.1, 2.2, 11.1, 11.2_

  - [ ] 3.2 Create TypeORM repository adapter
    - Create TypeOrmProfileRepository implementing IProfileRepository
    - Implement create, findById, findByAccountId, update, delete methods
    - Implement searchDirectory with query builder for filters
    - Implement fullTextSearch with ILIKE queries on display_name, bio, tags
    - Implement getFilterCounts for directory filters
    - Implement incrementViewCount method
    - Add domain-to-entity and entity-to-domain mapping methods
    - _Requirements: 2.1, 2.2, 4.1, 5.1, 5.2, 5.3, 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.3, 8.4, 9.1, 9.2, 9.3, 9.4, 10.1, 10.5_

  - [ ] 3.3 Create Redis event publisher adapter
    - Create RedisEventPublisher implementing IEventPublisher
    - Implement publish method using Redis pub/sub
    - Emit events: profiles.created, profile.updated
    - _Requirements: 5.5_

  - [ ] 3.4 Create Redis cache adapter
    - Create RedisCacheAdapter implementing ICacheService
    - Implement get, set, delete methods for filter counts caching
    - _Requirements: 8.5_

- [ ] 4. Create database migrations
  - Configure TypeORM migrations
  - Generate migration for profiles table with all columns, indexes, and constraints
  - Add GIN index creation for tags array
  - Create migration script commands in package.json
  - _Requirements: 2.1, 2.2, 11.1, 11.2_

- [ ] 5. Build application services
  - [ ] 5.1 Create ProfileService
    - Inject IProfileRepository and IEventPublisher
    - Implement bulkCreateProfiles for onboarding with validation
    - Implement getProfilesByAccount returning all user profiles
    - Implement switchProfile with ownership validation
    - Implement updateProfile with ownership check, tag normalization, and event emission
    - Implement getProfileById with visibility check and view count increment
    - Add private mapping methods: mapToDto, mapToDetailDto
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5, 10.1, 10.2, 10.3, 10.4, 10.5, 11.5_

  - [ ] 5.2 Create DirectoryService
    - Inject IProfileRepository and ICacheService
    - Implement searchDirectory with pagination, filters, and visibility enforcement
    - Implement fullTextSearch with minimum query length validation
    - Implement getFilterCounts with caching (5 minute TTL)
    - Add private mapping method: mapToCardDto
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 8.3, 8.4, 8.5, 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 6. Create DTOs with validation
  - [ ] 6.1 Create request DTOs
    - Create BulkCreateProfilesDto with profileTypes array
    - Create UpdateProfileDto with all optional profile fields
    - Create SwitchProfileDto with profileId
    - Create DirectoryQueryDto with profileTypes, location, tags, page, pageSize
    - Create SearchQueryDto with q, page, pageSize
    - Add class-validator decorators for all fields
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.1, 4.1, 5.1, 7.3, 8.1, 8.2, 8.3, 9.5, 11.1, 11.2, 11.3_

  - [ ] 6.2 Create response DTOs
    - Create ProfileDto with core profile fields
    - Create ProfileDetailDto extending ProfileDto with additional fields
    - Create ProfileCardDto for directory listings
    - Create ProfilesResponse with profiles array and defaultProfileId
    - Create DirectoryResponse with profiles, pagination, filters
    - Create SearchResponse with profiles, pagination, query
    - Add Swagger @ApiProperty decorators for OpenAPI documentation
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

- [ ] 7. Implement controllers
  - [ ] 7.1 Create ProfilesController
    - Add @Controller('profiles'), @ApiTags, @ApiBearerAuth decorators
    - Inject ProfileService
    - Implement POST /profiles/bulk-create endpoint
    - Implement GET /profiles/me endpoint
    - Implement POST /profiles/switch endpoint
    - Implement PATCH /profiles/:id endpoint
    - Implement GET /profiles/:id endpoint
    - Extract account_id from X-Account-Id header (set by API Gateway)
    - Add Swagger documentation for all endpoints
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 10.1, 10.2, 10.3, 10.4, 12.1, 12.2, 12.3, 12.4, 12.6_

  - [ ] 7.2 Create DirectoryController
    - Add @Controller('profiles/directory') and @ApiTags decorators
    - Inject DirectoryService
    - Implement GET /profiles/directory endpoint with query parameters
    - Implement GET /profiles/directory/search endpoint
    - Add Swagger documentation
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 8.3, 8.4, 8.5, 9.1, 9.2, 9.3, 9.4, 9.5, 12.5_

- [ ] 8. Configure NestJS modules
  - [ ] 8.1 Create ProfilesModule
    - Import ConfigModule, TypeOrmModule.forFeature([ProfileEntity]), RedisModule
    - Register controllers: ProfilesController, DirectoryController
    - Register services: ProfileService, DirectoryService
    - Bind infrastructure adapters to domain ports
    - Export ProfileService for use in other modules
    - _Requirements: All_

  - [ ] 8.2 Configure AppModule
    - Import ConfigModule.forRoot()
    - Import TypeOrmModule.forRoot() with PostgreSQL configuration
    - Import RedisModule.forRoot()
    - Import ProfilesModule
    - Configure global validation pipe
    - Configure Swagger documentation
    - _Requirements: All_

- [ ] 9. Add global error handling
  - Create HttpExceptionFilter for standardized error responses
  - Map validation errors to user-friendly messages
  - Log errors without exposing sensitive data
  - _Requirements: 11.5, 12.7_

- [ ] 10. Add health check endpoint
  - Install @nestjs/terminus
  - Create HealthController with GET /health endpoint
  - Add TypeOrmHealthIndicator for PostgreSQL
  - Add custom health indicator for Redis
  - Return service status and dependency health

- [ ] 11. Configure Swagger/OpenAPI documentation
  - Configure SwaggerModule in main.ts
  - Set API title, description, version
  - Add bearer auth security scheme
  - Generate OpenAPI JSON spec at /api-docs
  - Document all error responses
  - _Requirements: 12.7_

- [ ] 12. Create Docker configuration
  - Write multi-stage Dockerfile for profile-service
  - Create docker-compose.yml for local development
  - Add health check configuration
  - Create .dockerignore file
  - Document environment variables in README

- [ ] 13. Add configuration management
  - Create database.config.ts for TypeORM
  - Create redis.config.ts for Redis
  - Use ConfigService for environment variables
  - Add validation schema for required variables
