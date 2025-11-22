# Design Document: Profiles & Directory Service

## Overview

The Profiles & Directory service is a NestJS microservice that manages user profiles and provides directory/discovery functionality. Built with hexagonal architecture and Spring Boot-like patterns, this service enables users to create multiple role-based profiles, manage profile information, and discover other users through a searchable directory.

**Architecture Philosophy**: 
- Business logic is framework-agnostic (no NestJS dependencies in domain layer)
- Clear separation: Controllers → Services → Repositories → External Adapters
- OpenAPI/Swagger contracts compatible with Java/Spring Boot
- Standard SQL schema compatible with JPA/Hibernate

## Architecture

### Hexagonal Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  Controllers (REST endpoints) + DTOs + OpenAPI decorators   │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  Services (Use Cases) - Framework-agnostic business logic   │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      Domain Layer                            │
│  Entities, Value Objects, Domain Services                   │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                        │
│  Repositories, Event Publishers, Cache Adapters             │
└─────────────────────────────────────────────────────────────┘
```

### NestJS Module Structure

```
src/
├── profiles/
│   ├── profiles.module.ts
│   ├── presentation/
│   │   ├── controllers/
│   │   │   ├── profiles.controller.ts
│   │   │   └── directory.controller.ts
│   │   └── dto/
│   │       ├── create-profile.dto.ts
│   │       ├── update-profile.dto.ts
│   │       ├── profile-response.dto.ts
│   │       └── directory-query.dto.ts
│   ├── application/
│   │   └── services/
│   │       ├── profile.service.ts
│   │       ├── directory.service.ts
│   │       └── profile-validation.service.ts
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── profile.entity.ts
│   │   │   └── profile-tag.entity.ts
│   │   ├── ports/
│   │   │   ├── profile-repository.port.ts
│   │   │   ├── event-publisher.port.ts
│   │   │   └── cache.port.ts
│   │   ├── value-objects/
│   │   │   ├── profile-type.vo.ts
│   │   │   └── visibility.vo.ts
│   │   └── enums/
│   │       └── profile-type.enum.ts
│   └── infrastructure/
│       ├── adapters/
│       │   ├── typeorm-profile.repository.ts
│       │   ├── redis-event-publisher.adapter.ts
│       │   └── redis-cache.adapter.ts
│       └── entities/
│           ├── profile.entity.ts (TypeORM)
│           └── profile-tag.entity.ts (TypeORM)
```

## Components and Interfaces

### 1. Controllers (Presentation Layer)

```typescript
// profiles.controller.ts
import { Controller, Post, Get, Patch, Body, Param, Headers, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProfileService } from '../application/services/profile.service';

@ApiTags('Profiles')
@Controller('profiles')
@ApiBearerAuth()
export class ProfilesController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('bulk-create')
  @ApiOperation({ summary: 'Create multiple profiles during onboarding' })
  async bulkCreateProfiles(
    @Headers('x-account-id') accountId: string,
    @Body() dto: BulkCreateProfilesDto,
  ): Promise<ProfilesResponse> {
    return this.profileService.bulkCreateProfiles(accountId, dto.profileTypes);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get all profiles for authenticated user' })
  async getMyProfiles(
    @Headers('x-account-id') accountId: string,
  ): Promise<ProfilesResponse> {
    return this.profileService.getProfilesByAccount(accountId);
  }

  @Post('switch')
  @ApiOperation({ summary: 'Switch active profile' })
  async switchProfile(
    @Headers('x-account-id') accountId: string,
    @Body() dto: SwitchProfileDto,
  ): Promise<ProfileResponse> {
    return this.profileService.switchProfile(accountId, dto.profileId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update profile information' })
  async updateProfile(
    @Headers('x-account-id') accountId: string,
    @Param('id') profileId: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<ProfileResponse> {
    return this.profileService.updateProfile(accountId, profileId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get profile details by ID' })
  async getProfile(
    @Param('id') profileId: string,
    @Headers('x-account-id') accountId: string,
  ): Promise<ProfileDetailResponse> {
    return this.profileService.getProfileById(profileId, accountId);
  }
}

// directory.controller.ts
@ApiTags('Directory')
@Controller('profiles/directory')
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) {}

  @Get()
  @ApiOperation({ summary: 'Browse profile directory with filters' })
  async getDirectory(
    @Query() query: DirectoryQueryDto,
  ): Promise<DirectoryResponse> {
    return this.directoryService.searchDirectory(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Full-text search profiles' })
  async searchProfiles(
    @Query() query: SearchQueryDto,
  ): Promise<SearchResponse> {
    return this.directoryService.fullTextSearch(query);
  }
}
```

### 2. DTOs (Data Transfer Objects)

```typescript
// create-profile.dto.ts
import { IsEnum, IsString, IsOptional, IsUrl, IsArray, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProfileType } from '../domain/enums/profile-type.enum';

export class BulkCreateProfilesDto {
  @ApiProperty({ 
    type: [String],
    enum: ProfileType,
    example: ['innovator', 'mentor']
  })
  @IsArray()
  @IsEnum(ProfileType, { each: true })
  profileTypes: ProfileType[];
}

export class UpdateProfileDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  displayName?: string;

  @ApiProperty({ example: 'Passionate about climate tech innovation', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiProperty({ example: 'San Francisco, CA', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiProperty({ example: 'https://example.com/cover.jpg', required: false })
  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @ApiProperty({ example: 'https://example.com', required: false })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ type: Object, required: false })
  @IsOptional()
  socialLinks?: Record<string, string>;

  @ApiProperty({ type: [String], example: ['climate-tech', 'ai', 'sustainability'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  typeSpecificData?: Record<string, any>;

  @ApiProperty({ enum: ['public', 'private'], required: false })
  @IsOptional()
  @IsEnum(['public', 'private'])
  visibility?: string;
}

// directory-query.dto.ts
export class DirectoryQueryDto {
  @ApiProperty({ required: false, type: [String], enum: ProfileType })
  @IsOptional()
  @IsArray()
  profileTypes?: ProfileType[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  pageSize?: number;
}
```

### 3. Application Services

```typescript
// profile.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IProfileRepository } from '../../domain/ports/profile-repository.port';
import { IEventPublisher } from '../../domain/ports/event-publisher.port';
import { Profile } from '../../domain/entities/profile.entity';
import { ProfileType } from '../../domain/enums/profile-type.enum';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: IProfileRepository,
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async bulkCreateProfiles(
    accountId: string,
    profileTypes: ProfileType[],
  ): Promise<ProfilesResponse> {
    if (!profileTypes || profileTypes.length === 0) {
      throw new BadRequestException('At least one profile type is required');
    }

    const profiles: Profile[] = [];
    let isFirst = true;

    for (const type of profileTypes) {
      const profile = new Profile({
        accountId,
        profileType: type,
        displayName: '', // User will fill this later
        visibility: 'public',
        isDefault: isFirst,
      });

      profile.validate();
      const created = await this.profileRepository.create(profile);
      profiles.push(created);
      
      isFirst = false;
    }

    // Emit event
    await this.eventPublisher.publish('profiles.created', {
      accountId,
      profileIds: profiles.map(p => p.id),
    });

    return {
      profiles: profiles.map(p => this.mapToDto(p)),
      defaultProfileId: profiles[0].id,
    };
  }

  async getProfilesByAccount(accountId: string): Promise<ProfilesResponse> {
    const profiles = await this.profileRepository.findByAccountId(accountId);
    
    return {
      profiles: profiles.map(p => this.mapToDto(p)),
      defaultProfileId: profiles.find(p => p.isDefault)?.id,
    };
  }

  async switchProfile(
    accountId: string,
    profileId: string,
  ): Promise<ProfileResponse> {
    const profile = await this.profileRepository.findById(profileId);
    
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (profile.accountId !== accountId) {
      throw new ForbiddenException('You do not own this profile');
    }

    return { profile: this.mapToDto(profile) };
  }

  async updateProfile(
    accountId: string,
    profileId: string,
    updates: UpdateProfileDto,
  ): Promise<ProfileResponse> {
    const profile = await this.profileRepository.findById(profileId);
    
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (profile.accountId !== accountId) {
      throw new ForbiddenException('You do not own this profile');
    }

    // Update fields
    Object.assign(profile, updates);
    
    // Normalize tags
    if (updates.tags) {
      profile.tags = updates.tags.map(t => t.toLowerCase());
    }

    profile.validate();
    profile.updatedAt = new Date();

    const updated = await this.profileRepository.update(profile);

    // Emit event for search index
    await this.eventPublisher.publish('profile.updated', {
      profileId: updated.id,
      accountId: updated.accountId,
    });

    return { profile: this.mapToDto(updated) };
  }

  async getProfileById(
    profileId: string,
    viewerAccountId?: string,
  ): Promise<ProfileDetailResponse> {
    const profile = await this.profileRepository.findById(profileId);
    
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Check visibility
    if (profile.visibility === 'private' && profile.accountId !== viewerAccountId) {
      throw new NotFoundException('Profile not found');
    }

    // Increment view count
    await this.profileRepository.incrementViewCount(profileId);

    // Get connection status (will integrate with Interaction Service later)
    const connectionStatus = 'none'; // TODO: Call Interaction Service

    return {
      profile: this.mapToDetailDto(profile),
      connectionStatus,
    };
  }

  private mapToDto(profile: Profile): ProfileDto {
    return {
      id: profile.id,
      accountId: profile.accountId,
      profileType: profile.profileType,
      displayName: profile.displayName,
      bio: profile.bio,
      location: profile.location,
      avatarUrl: profile.avatarUrl,
      tags: profile.tags,
      visibility: profile.visibility,
      isDefault: profile.isDefault,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  private mapToDetailDto(profile: Profile): ProfileDetailDto {
    return {
      ...this.mapToDto(profile),
      coverImageUrl: profile.coverImageUrl,
      website: profile.website,
      socialLinks: profile.socialLinks,
      typeSpecificData: profile.typeSpecificData,
      viewCount: profile.viewCount,
    };
  }
}

// directory.service.ts
@Injectable()
export class DirectoryService {
  constructor(
    private readonly profileRepository: IProfileRepository,
    private readonly cacheService: ICacheService,
  ) {}

  async searchDirectory(query: DirectoryQueryDto): Promise<DirectoryResponse> {
    const { profileTypes, location, tags, page = 1, pageSize = 20 } = query;

    // Validate page size
    const validPageSize = Math.min(Math.max(pageSize, 10), 50);

    const result = await this.profileRepository.searchDirectory({
      profileTypes,
      location,
      tags,
      visibility: 'public',
      page,
      pageSize: validPageSize,
    });

    return {
      profiles: result.profiles.map(p => this.mapToCardDto(p)),
      pagination: {
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
      },
      filters: await this.getFilterCounts(query),
    };
  }

  async fullTextSearch(query: SearchQueryDto): Promise<SearchResponse> {
    const { q, page = 1, pageSize = 20 } = query;

    if (!q || q.length < 2) {
      throw new BadRequestException('Search query must be at least 2 characters');
    }

    const result = await this.profileRepository.fullTextSearch(q, page, pageSize);

    return {
      profiles: result.profiles.map(p => this.mapToCardDto(p)),
      pagination: {
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
      },
      query: q,
    };
  }

  private async getFilterCounts(query: DirectoryQueryDto): Promise<FilterCounts> {
    // Cache filter counts for 5 minutes
    const cacheKey = `filter_counts:${JSON.stringify(query)}`;
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const counts = await this.profileRepository.getFilterCounts(query);
    await this.cacheService.set(cacheKey, JSON.stringify(counts), 300);
    
    return counts;
  }

  private mapToCardDto(profile: Profile): ProfileCardDto {
    return {
      id: profile.id,
      profileType: profile.profileType,
      displayName: profile.displayName,
      bio: profile.bio,
      location: profile.location,
      avatarUrl: profile.avatarUrl,
      tags: profile.tags.slice(0, 5), // Show max 5 tags in card
    };
  }
}
```

### 4. Domain Layer

```typescript
// domain/entities/profile.entity.ts
export class Profile {
  id: string;
  accountId: string;
  profileType: ProfileType;
  displayName: string;
  bio: string;
  location: string;
  avatarUrl: string;
  coverImageUrl: string;
  website: string;
  socialLinks: Record<string, string>;
  tags: string[];
  typeSpecificData: Record<string, any>;
  visibility: 'public' | 'private';
  isDefault: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Profile>) {
    Object.assign(this, data);
    this.tags = this.tags || [];
    this.socialLinks = this.socialLinks || {};
    this.typeSpecificData = this.typeSpecificData || {};
    this.viewCount = this.viewCount || 0;
  }

  validate(): void {
    if (!this.displayName || this.displayName.length < 2) {
      throw new Error('Display name must be at least 2 characters');
    }

    if (this.displayName.length > 100) {
      throw new Error('Display name must not exceed 100 characters');
    }

    if (this.bio && this.bio.length > 500) {
      throw new Error('Bio must not exceed 500 characters');
    }

    if (this.tags.length > 20) {
      throw new Error('Maximum 20 tags allowed per profile');
    }

    if (!Object.values(ProfileType).includes(this.profileType)) {
      throw new Error('Invalid profile type');
    }
  }

  addTag(tag: string): void {
    const normalized = tag.toLowerCase().trim();
    
    if (!this.tags.includes(normalized)) {
      if (this.tags.length >= 20) {
        throw new Error('Maximum 20 tags allowed');
      }
      this.tags.push(normalized);
    }
  }

  removeTag(tag: string): void {
    const normalized = tag.toLowerCase().trim();
    this.tags = this.tags.filter(t => t !== normalized);
  }
}

// domain/enums/profile-type.enum.ts
export enum ProfileType {
  INNOVATOR = 'innovator',
  INVESTOR = 'investor',
  MENTOR = 'mentor',
  PROFESSIONAL = 'professional',
  STUDENT = 'student',
  INSTITUTION = 'institution',
  ORGANIZATION = 'organization',
}

// domain/ports/profile-repository.port.ts
export interface IProfileRepository {
  create(profile: Profile): Promise<Profile>;
  findById(id: string): Promise<Profile | null>;
  findByAccountId(accountId: string): Promise<Profile[]>;
  update(profile: Profile): Promise<Profile>;
  delete(id: string): Promise<void>;
  searchDirectory(query: DirectorySearchQuery): Promise<DirectorySearchResult>;
  fullTextSearch(query: string, page: number, pageSize: number): Promise<SearchResult>;
  getFilterCounts(query: DirectoryQueryDto): Promise<FilterCounts>;
  incrementViewCount(profileId: string): Promise<void>;
}
```

### 5. Infrastructure Layer

```typescript
// infrastructure/entities/profile.entity.ts (TypeORM)
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('profiles')
export class ProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_id', type: 'uuid' })
  @Index()
  accountId: string;

  @Column({ name: 'profile_type', type: 'varchar', length: 50 })
  @Index()
  profileType: string;

  @Column({ name: 'display_name', type: 'varchar', length: 100 })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Index()
  location: string;

  @Column({ name: 'avatar_url', type: 'varchar', length: 500, nullable: true })
  avatarUrl: string;

  @Column({ name: 'cover_image_url', type: 'varchar', length: 500, nullable: true })
  coverImageUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  website: string;

  @Column({ name: 'social_links', type: 'jsonb', nullable: true })
  socialLinks: Record<string, string>;

  @Column({ type: 'text', array: true, default: '{}' })
  @Index('idx_profiles_tags', { synchronize: false }) // GIN index for array
  tags: string[];

  @Column({ name: 'type_specific_data', type: 'jsonb', nullable: true })
  typeSpecificData: Record<string, any>;

  @Column({ type: 'varchar', length: 20, default: 'public' })
  @Index()
  visibility: string;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ name: 'view_count', type: 'integer', default: 0 })
  viewCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

// infrastructure/adapters/typeorm-profile.repository.ts
@Injectable()
export class TypeOrmProfileRepository implements IProfileRepository {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly repository: Repository<ProfileEntity>,
  ) {}

  async create(profile: Profile): Promise<Profile> {
    const entity = this.repository.create(this.toEntity(profile));
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Profile | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByAccountId(accountId: string): Promise<Profile[]> {
    const entities = await this.repository.find({
      where: { accountId },
      order: { isDefault: 'DESC', createdAt: 'ASC' },
    });
    return entities.map(e => this.toDomain(e));
  }

  async update(profile: Profile): Promise<Profile> {
    await this.repository.update(profile.id, this.toEntity(profile));
    const updated = await this.repository.findOne({ where: { id: profile.id } });
    return this.toDomain(updated);
  }

  async searchDirectory(query: DirectorySearchQuery): Promise<DirectorySearchResult> {
    const qb = this.repository.createQueryBuilder('profile');
    
    qb.where('profile.visibility = :visibility', { visibility: 'public' });

    if (query.profileTypes && query.profileTypes.length > 0) {
      qb.andWhere('profile.profile_type IN (:...types)', { types: query.profileTypes });
    }

    if (query.location) {
      qb.andWhere('profile.location ILIKE :location', { location: `%${query.location}%` });
    }

    if (query.tags && query.tags.length > 0) {
      qb.andWhere('profile.tags @> :tags', { tags: query.tags });
    }

    const totalCount = await qb.getCount();
    const totalPages = Math.ceil(totalCount / query.pageSize);

    const entities = await qb
      .orderBy('profile.created_at', 'DESC')
      .skip((query.page - 1) * query.pageSize)
      .take(query.pageSize)
      .getMany();

    return {
      profiles: entities.map(e => this.toDomain(e)),
      page: query.page,
      pageSize: query.pageSize,
      totalPages,
      totalCount,
    };
  }

  async fullTextSearch(query: string, page: number, pageSize: number): Promise<SearchResult> {
    const qb = this.repository.createQueryBuilder('profile');
    
    qb.where('profile.visibility = :visibility', { visibility: 'public' })
      .andWhere(
        '(profile.display_name ILIKE :query OR profile.bio ILIKE :query OR :query = ANY(profile.tags))',
        { query: `%${query}%` }
      );

    const totalCount = await qb.getCount();
    const totalPages = Math.ceil(totalCount / pageSize);

    const entities = await qb
      .orderBy('profile.created_at', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    return {
      profiles: entities.map(e => this.toDomain(e)),
      page,
      pageSize,
      totalPages,
      totalCount,
    };
  }

  async incrementViewCount(profileId: string): Promise<void> {
    await this.repository.increment({ id: profileId }, 'viewCount', 1);
  }

  private toDomain(entity: ProfileEntity): Profile {
    return new Profile({
      id: entity.id,
      accountId: entity.accountId,
      profileType: entity.profileType as ProfileType,
      displayName: entity.displayName,
      bio: entity.bio,
      location: entity.location,
      avatarUrl: entity.avatarUrl,
      coverImageUrl: entity.coverImageUrl,
      website: entity.website,
      socialLinks: entity.socialLinks,
      tags: entity.tags,
      typeSpecificData: entity.typeSpecificData,
      visibility: entity.visibility as 'public' | 'private',
      isDefault: entity.isDefault,
      viewCount: entity.viewCount,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private toEntity(profile: Profile): Partial<ProfileEntity> {
    return {
      id: profile.id,
      accountId: profile.accountId,
      profileType: profile.profileType,
      displayName: profile.displayName,
      bio: profile.bio,
      location: profile.location,
      avatarUrl: profile.avatarUrl,
      coverImageUrl: profile.coverImageUrl,
      website: profile.website,
      socialLinks: profile.socialLinks,
      tags: profile.tags,
      typeSpecificData: profile.typeSpecificData,
      visibility: profile.visibility,
      isDefault: profile.isDefault,
      viewCount: profile.viewCount,
    };
  }
}
```

## Data Models

### Database Schema (PostgreSQL)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL,
  profile_type VARCHAR(50) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  bio TEXT,
  location VARCHAR(255),
  avatar_url VARCHAR(500),
  cover_image_url VARCHAR(500),
  website VARCHAR(500),
  social_links JSONB,
  tags TEXT[] DEFAULT '{}',
  type_specific_data JSONB,
  visibility VARCHAR(20) DEFAULT 'public',
  is_default BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT chk_display_name_length CHECK (LENGTH(display_name) >= 2 AND LENGTH(display_name) <= 100),
  CONSTRAINT chk_bio_length CHECK (bio IS NULL OR LENGTH(bio) <= 500),
  CONSTRAINT chk_visibility CHECK (visibility IN ('public', 'private'))
);

CREATE INDEX idx_profiles_account_id ON profiles(account_id);
CREATE INDEX idx_profiles_profile_type ON profiles(profile_type);
CREATE INDEX idx_profiles_location ON profiles(location);
CREATE INDEX idx_profiles_visibility ON profiles(visibility);
CREATE INDEX idx_profiles_tags ON profiles USING GIN(tags);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);
```

## Testing Strategy

### Unit Tests
1. Profile entity validation logic
2. Tag normalization and deduplication
3. Service business logic (profile creation, updates, switching)
4. Repository query building

### Integration Tests
1. Full profile CRUD flow
2. Directory search with various filters
3. Full-text search functionality
4. Profile visibility enforcement

## Security Considerations

1. **Authorization**: Verify profile ownership before updates
2. **Visibility**: Enforce public/private access controls
3. **Input Validation**: Sanitize all text inputs to prevent XSS
4. **URL Validation**: Validate avatar, cover, and website URLs
5. **Rate Limiting**: Limit profile updates and searches per user

## Configuration

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/platform

# Redis
REDIS_URL=redis://localhost:6379

# Service
PORT=3002
NODE_ENV=production
```
