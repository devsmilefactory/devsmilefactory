# Design Document: Authentication & Account Management

## Overview

The Authentication & Account Management service is a NestJS microservice that wraps Supabase Auth to provide passwordless authentication for the social collaboration platform. Built with hexagonal/ports-and-adapters architecture and Spring Boot-like patterns (DI, modules, controllers, services), this service is designed for future migration to Java/Spring Boot.

The service handles:
- OTP-based sign-in/sign-up flows
- Session and token management via Supabase
- Account synchronization between Supabase and platform database
- Rate limiting and security controls
- Token validation and caching

**Architecture Philosophy**: 
- Business logic is framework-agnostic (no NestJS/Express dependencies in domain layer)
- Clear separation: Controllers → Services → Repositories → External Adapters
- OpenAPI/Swagger contracts that Java can reuse
- Standard SQL schema compatible with JPA/Hibernate

## Architecture

### High-Level Architecture

```
┌─────────────┐         ┌──────────────────────────────────┐         ┌─────────────┐
│   React     │────────▶│   Auth Service (NestJS)          │────────▶│  Supabase   │
│  Frontend   │◀────────│   Hexagonal Architecture         │◀────────│    Auth     │
└─────────────┘         └──────────────────────────────────┘         └─────────────┘
                               │      │
                               │      │
                        ┌──────▼──┐ ┌─▼──────┐
                        │  Redis  │ │ Postgres│
                        │  Cache  │ │   DB    │
                        └─────────┘ └─────────┘
```

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
│  Repositories, External Adapters (Supabase, Redis, DB)     │
└─────────────────────────────────────────────────────────────┘
```

### NestJS Module Structure (Spring Boot-like)

```
src/
├── main.ts                          # Bootstrap (like Spring Boot Application.java)
├── app.module.ts                    # Root module
├── auth/
│   ├── auth.module.ts               # Feature module (like @Configuration)
│   ├── presentation/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts   # REST endpoints (@Controller)
│   │   │   └── webhook.controller.ts
│   │   └── dto/
│   │       ├── request-otp.dto.ts   # Request DTOs
│   │       ├── verify-otp.dto.ts
│   │       └── auth-response.dto.ts # Response DTOs
│   ├── application/
│   │   └── services/
│   │       ├── auth.service.ts      # Use case orchestration (@Service)
│   │       ├── token-validation.service.ts
│   │       └── account-sync.service.ts
│   ├── domain/
│   │   ├── entities/
│   │   │   └── account.entity.ts    # Domain model (like JPA @Entity)
│   │   ├── ports/                   # Interfaces (like Spring repositories)
│   │   │   ├── auth-provider.port.ts
│   │   │   ├── account-repository.port.ts
│   │   │   └── cache.port.ts
│   │   └── value-objects/
│   │       └── identifier.vo.ts
│   └── infrastructure/
│       ├── adapters/
│       │   ├── supabase-auth.adapter.ts    # Implements auth-provider.port
│       │   ├── redis-cache.adapter.ts      # Implements cache.port
│       │   └── typeorm-account.repository.ts # Implements account-repository.port
│       └── config/
│           └── supabase.config.ts
├── shared/
│   ├── filters/
│   │   └── http-exception.filter.ts # Global exception handler
│   ├── interceptors/
│   │   └── logging.interceptor.ts   # Request/response logging
│   └── guards/
│       └── auth.guard.ts            # JWT validation guard
└── config/
    ├── database.config.ts           # TypeORM config (JPA-like)
    └── redis.config.ts
```

## Components and Interfaces

### 1. Controllers (Presentation Layer)

#### AuthController

```typescript
import { Controller, Post, Body, Get, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../application/services/auth.service';
import { RequestOtpDto, VerifyOtpDto, RefreshTokenDto } from '../presentation/dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request OTP for sign-in/sign-up' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async requestOtp(@Body() dto: RequestOtpDto): Promise<OtpRequestResponse> {
    return this.authService.requestOtp(dto.identifier);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and get access tokens' })
  @ApiResponse({ status: 200, description: 'OTP verified, tokens issued' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<AuthResponse> {
    return this.authService.verifyOtp(dto.identifier, dto.otp, dto.clientMetadata);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refreshToken(@Body() dto: RefreshTokenDto): Promise<TokenResponse> {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and invalidate session' })
  async logout(@Headers('authorization') auth: string): Promise<LogoutResponse> {
    const token = auth?.replace('Bearer ', '');
    return this.authService.logout(token);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getCurrentUser(@Headers('authorization') auth: string): Promise<UserProfileResponse> {
    const token = auth?.replace('Bearer ', '');
    return this.authService.getCurrentUser(token);
  }
}
```

### 2. DTOs (Data Transfer Objects)

```typescript
// request-otp.dto.ts
import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestOtpDto {
  @ApiProperty({ 
    description: 'Email or phone number',
    example: 'user@example.com'
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;
}

// verify-otp.dto.ts
export class VerifyOtpDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'OTP must be 6 digits' })
  otp: string;

  @ApiProperty({ required: false })
  clientMetadata?: Record<string, any>;
}

// auth-response.dto.ts
export class AuthResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expiresIn: number;

  @ApiProperty()
  tokenType: string;

  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  isNewUser: boolean;

  @ApiProperty()
  platformAccountId: string;
}
```

### 3. API Endpoints (OpenAPI Spec)

#### POST /auth/request-otp
```typescript
Request:
{
  "identifier": "user@example.com" | "+1234567890"
}

Response (200):
{
  "message": "If an account exists or has been created, an OTP has been sent to your contact",
  "timestamp": "2025-11-15T10:30:00Z"
}

Response (429 - Rate Limited):
{
  "error_code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Please try again in 15 minutes",
  "timestamp": "2025-11-15T10:30:00Z"
}
```

#### POST /auth/verify-otp
```typescript
Request:
{
  "identifier": "user@example.com",
  "otp": "123456",
  "client_metadata": {
    "device": "web",
    "app_version": "1.0.0"
  }
}

Response (200 - Success):
{
  "access_token": "eyJhbGc...",
  "refresh_token": "v1.MR5m...",
  "expires_in": 3600,
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "phone": null
  },
  "is_new_user": true,
  "platform_account_id": "uuid"
}

Response (400 - Invalid OTP):
{
  "error_code": "INVALID_OTP",
  "message": "Invalid or expired code. Please request a new code",
  "timestamp": "2025-11-15T10:30:00Z"
}
```

#### POST /auth/refresh
```typescript
Request:
{
  "refresh_token": "v1.MR5m..."
}

Response (200):
{
  "access_token": "eyJhbGc...",
  "refresh_token": "v1.MR5m...",
  "expires_in": 3600,
  "token_type": "bearer"
}
```

#### POST /auth/logout
```typescript
Request Headers:
Authorization: Bearer eyJhbGc...

Response (200):
{
  "message": "Successfully logged out",
  "timestamp": "2025-11-15T10:30:00Z"
}
```

#### GET /auth/me
```typescript
Request Headers:
Authorization: Bearer eyJhbGc...

Response (200):
{
  "supabase_user": {
    "id": "uuid",
    "email": "user@example.com",
    "phone": null,
    "created_at": "2025-11-15T10:00:00Z"
  },
  "platform_account": {
    "id": "uuid",
    "supabase_user_id": "uuid",
    "email": "user@example.com",
    "phone": null,
    "created_at": "2025-11-15T10:00:00Z",
    "updated_at": "2025-11-15T10:00:00Z"
  }
}
```

#### POST /auth/webhooks/supabase
```typescript
// Webhook endpoint for Supabase auth events
Request Headers:
X-Supabase-Signature: sha256=...

Request:
{
  "type": "user.updated",
  "user": {
    "id": "uuid",
    "email": "newemail@example.com",
    "phone": "+1234567890"
  }
}

Response (200):
{
  "received": true
}
```

### 4. Application Services (Use Case Layer)

```typescript
// auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { IAuthProvider } from '../../domain/ports/auth-provider.port';
import { IAccountRepository } from '../../domain/ports/account-repository.port';
import { ICacheService } from '../../domain/ports/cache.port';
import { RateLimiterService } from './rate-limiter.service';
import { AccountSyncService } from './account-sync.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authProvider: IAuthProvider,
    private readonly accountRepository: IAccountRepository,
    private readonly cacheService: ICacheService,
    private readonly rateLimiter: RateLimiterService,
    private readonly accountSync: AccountSyncService,
  ) {}

  async requestOtp(identifier: string): Promise<OtpRequestResponse> {
    // Check rate limit
    const allowed = await this.rateLimiter.checkOtpRequestLimit(identifier);
    if (!allowed) {
      const remainingTime = await this.rateLimiter.getRemainingTime(identifier);
      throw new BadRequestException(
        `Too many requests. Please try again in ${remainingTime} seconds`
      );
    }

    // Request OTP from Supabase (never reveals if account exists)
    await this.authProvider.signInWithOtp(identifier);

    return {
      message: 'If an account exists or has been created, an OTP has been sent to your contact',
      timestamp: new Date().toISOString(),
    };
  }

  async verifyOtp(
    identifier: string,
    otp: string,
    clientMetadata?: Record<string, any>
  ): Promise<AuthResponse> {
    // Verify OTP with Supabase
    const authResult = await this.authProvider.verifyOtp(identifier, otp);
    
    if (!authResult.user) {
      throw new UnauthorizedException('Invalid or expired code. Please request a new code');
    }

    // Check if platform account exists
    let platformAccount = await this.accountRepository.findBySupabaseUserId(authResult.user.id);
    let isNewUser = false;

    if (!platformAccount) {
      // Create platform account for new user
      platformAccount = await this.accountSync.createPlatformAccount(authResult.user);
      isNewUser = true;
    }

    return {
      accessToken: authResult.session.access_token,
      refreshToken: authResult.session.refresh_token,
      expiresIn: authResult.session.expires_in,
      tokenType: 'bearer',
      user: this.mapToUserDto(authResult.user),
      isNewUser,
      platformAccountId: platformAccount.id,
    };
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const result = await this.authProvider.refreshSession(refreshToken);
    
    return {
      accessToken: result.session.access_token,
      refreshToken: result.session.refresh_token,
      expiresIn: result.session.expires_in,
      tokenType: 'bearer',
    };
  }

  async logout(accessToken: string): Promise<LogoutResponse> {
    await this.authProvider.signOut(accessToken);
    
    // Invalidate cached token
    await this.cacheService.delete(`token:${this.hashToken(accessToken)}`);
    
    return {
      message: 'Successfully logged out',
      timestamp: new Date().toISOString(),
    };
  }

  async getCurrentUser(accessToken: string): Promise<UserProfileResponse> {
    // Validate token (with caching)
    const user = await this.validateToken(accessToken);
    
    // Get platform account
    const platformAccount = await this.accountRepository.findBySupabaseUserId(user.id);
    
    if (!platformAccount) {
      throw new UnauthorizedException('Account not found');
    }

    return {
      supabaseUser: this.mapToUserDto(user),
      platformAccount: this.mapToAccountDto(platformAccount),
    };
  }

  private async validateToken(accessToken: string): Promise<User> {
    const cacheKey = `token:${this.hashToken(accessToken)}`;
    
    // Check cache
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Validate with Supabase
    const user = await this.authProvider.getUser(accessToken);
    
    // Cache for 5 minutes
    await this.cacheService.set(cacheKey, JSON.stringify(user), 300);
    
    return user;
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private mapToUserDto(user: any): UserDto {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      createdAt: user.created_at,
    };
  }

  private mapToAccountDto(account: any): AccountDto {
    return {
      id: account.id,
      supabaseUserId: account.supabase_user_id,
      email: account.email,
      phone: account.phone,
      createdAt: account.created_at,
      updatedAt: account.updated_at,
    };
  }
}
```

### 5. Domain Ports (Interfaces)

```typescript
// domain/ports/auth-provider.port.ts
export interface IAuthProvider {
  signInWithOtp(identifier: string): Promise<OtpResponse>;
  verifyOtp(identifier: string, token: string): Promise<AuthResult>;
  refreshSession(refreshToken: string): Promise<AuthResult>;
  signOut(accessToken: string): Promise<void>;
  getUser(accessToken: string): Promise<User>;
}

// domain/ports/account-repository.port.ts
export interface IAccountRepository {
  findBySupabaseUserId(supabaseUserId: string): Promise<Account | null>;
  create(account: CreateAccountDto): Promise<Account>;
  update(id: string, updates: Partial<Account>): Promise<Account>;
  delete(id: string): Promise<void>;
}

// domain/ports/cache.port.ts
export interface ICacheService {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl: number): Promise<void>;
  delete(key: string): Promise<void>;
  incr(key: string): Promise<number>;
  expire(key: string, ttl: number): Promise<void>;
  ttl(key: string): Promise<number>;
}
```

### 6. Domain Entities

```typescript
// domain/entities/account.entity.ts
export class Account {
  id: string;
  supabaseUserId: string;
  email: string | null;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Account>) {
    Object.assign(this, data);
  }

  validate(): void {
    if (!this.email && !this.phone) {
      throw new Error('Account must have either email or phone');
    }
  }
}
```

### 7. Infrastructure Adapters

#### Supabase Auth Adapter

```typescript
// infrastructure/adapters/supabase-auth.adapter.ts
import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IAuthProvider } from '../../domain/ports/auth-provider.port';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseAuthAdapter implements IAuthProvider {
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async signInWithOtp(identifier: string): Promise<any> {
    const isEmail = identifier.includes('@');
    
    if (isEmail) {
      return await this.supabase.auth.signInWithOtp({
        email: identifier,
        options: {
          shouldCreateUser: true
        }
      });
    } else {
      return await this.supabase.auth.signInWithOtp({
        phone: identifier,
        options: {
          shouldCreateUser: true
        }
      });
    }
  }

  async verifyOtp(identifier: string, token: string): Promise<any> {
    const isEmail = identifier.includes('@');
    
    if (isEmail) {
      return await this.supabase.auth.verifyOtp({
        email: identifier,
        token,
        type: 'email'
      });
    } else {
      return await this.supabase.auth.verifyOtp({
        phone: identifier,
        token,
        type: 'sms'
      });
    }
  }

  async refreshSession(refreshToken: string): Promise<any> {
    return await this.supabase.auth.refreshSession({
      refresh_token: refreshToken
    });
  }

  async signOut(accessToken: string): Promise<void> {
    await this.supabase.auth.signOut();
  }

  async getUser(accessToken: string): Promise<any> {
    const { data, error } = await this.supabase.auth.getUser(accessToken);
    if (error) throw error;
    return data.user;
  }
}
```

#### TypeORM Account Repository

```typescript
// infrastructure/adapters/typeorm-account.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAccountRepository } from '../../domain/ports/account-repository.port';
import { Account } from '../../domain/entities/account.entity';
import { AccountEntity } from '../entities/account.entity';

@Injectable()
export class TypeOrmAccountRepository implements IAccountRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly repository: Repository<AccountEntity>,
  ) {}

  async findBySupabaseUserId(supabaseUserId: string): Promise<Account | null> {
    const entity = await this.repository.findOne({
      where: { supabaseUserId },
    });
    
    return entity ? this.toDomain(entity) : null;
  }

  async create(data: CreateAccountDto): Promise<Account> {
    const entity = this.repository.create(data);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: string, updates: Partial<Account>): Promise<Account> {
    await this.repository.update(id, updates);
    const updated = await this.repository.findOne({ where: { id } });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: AccountEntity): Account {
    return new Account({
      id: entity.id,
      supabaseUserId: entity.supabaseUserId,
      email: entity.email,
      phone: entity.phone,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}

// infrastructure/entities/account.entity.ts (TypeORM Entity)
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'supabase_user_id', type: 'uuid', unique: true })
  @Index()
  supabaseUserId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Index()
  email: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @Index()
  phone: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

#### Redis Cache Adapter

```typescript
// infrastructure/adapters/redis-cache.adapter.ts
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { ICacheService } from '../../domain/ports/cache.port';

@Injectable()
export class RedisCacheAdapter implements ICacheService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.redis.setex(key, ttl, value);
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async incr(key: string): Promise<number> {
    return await this.redis.incr(key);
  }

  async expire(key: string, ttl: number): Promise<void> {
    await this.redis.expire(key, ttl);
  }

  async ttl(key: string): Promise<number> {
    return await this.redis.ttl(key);
  }
}
```

### 8. Rate Limiter Service

```typescript
// application/services/rate-limiter.service.ts
import { Injectable } from '@nestjs/common';
import { ICacheService } from '../../domain/ports/cache.port';
import * as crypto from 'crypto';

@Injectable()
export class RateLimiterService {
  private readonly OTP_REQUEST_LIMIT = 5;
  private readonly OTP_REQUEST_WINDOW = 15 * 60; // 15 minutes in seconds

  constructor(private readonly cacheService: ICacheService) {}

  async checkOtpRequestLimit(identifier: string): Promise<boolean> {
    const key = `rate_limit:otp_request:${this.hashIdentifier(identifier)}`;
    const current = await this.cacheService.incr(key);
    
    if (current === 1) {
      await this.cacheService.expire(key, this.OTP_REQUEST_WINDOW);
    }
    
    return current <= this.OTP_REQUEST_LIMIT;
  }

  async getRemainingTime(identifier: string): Promise<number> {
    const key = `rate_limit:otp_request:${this.hashIdentifier(identifier)}`;
    return await this.cacheService.ttl(key);
  }

  private hashIdentifier(identifier: string): string {
    return crypto.createHash('sha256').update(identifier).digest('hex');
  }
}
```

### 9. Account Sync Service

```typescript
// application/services/account-sync.service.ts
import { Injectable } from '@nestjs/common';
import { IAccountRepository } from '../../domain/ports/account-repository.port';
import { Account } from '../../domain/entities/account.entity';

@Injectable()
export class AccountSyncService {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async createPlatformAccount(supabaseUser: any): Promise<Account> {
    const account = await this.accountRepository.create({
      supabaseUserId: supabaseUser.id,
      email: supabaseUser.email,
      phone: supabaseUser.phone,
    });
    
    return account;
  }

  async updatePlatformAccount(supabaseUserId: string, updates: Partial<Account>): Promise<void> {
    const account = await this.accountRepository.findBySupabaseUserId(supabaseUserId);
    
    if (account) {
      await this.accountRepository.update(account.id, updates);
    }
  }

  async deletePlatformAccount(supabaseUserId: string): Promise<void> {
    const account = await this.accountRepository.findBySupabaseUserId(supabaseUserId);
    
    if (account) {
      await this.accountRepository.delete(account.id);
    }
  }
}
```

### 10. Webhook Handler

```typescript
// application/services/webhook-handler.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountSyncService } from './account-sync.service';
import * as crypto from 'crypto';

@Injectable()
export class WebhookHandlerService {
  private readonly webhookSecret: string;

  constructor(
    private readonly accountSync: AccountSyncService,
    private readonly configService: ConfigService,
  ) {
    this.webhookSecret = this.configService.get<string>('SUPABASE_WEBHOOK_SECRET');
  }

  verifySignature(payload: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex');
    
    return `sha256=${expectedSignature}` === signature;
  }

  async handleWebhook(event: SupabaseWebhookEvent): Promise<void> {
    switch (event.type) {
      case 'user.created':
        // Account creation is handled in verify-otp endpoint
        break;
        
      case 'user.updated':
        await this.accountSync.updatePlatformAccount(event.user.id, {
          email: event.user.email,
          phone: event.user.phone,
        });
        break;
        
      case 'user.deleted':
        await this.accountSync.deletePlatformAccount(event.user.id);
        break;
    }
  }
}

// presentation/controllers/webhook.controller.ts
@Controller('auth/webhooks')
export class WebhookController {
  constructor(private readonly webhookHandler: WebhookHandlerService) {}

  @Post('supabase')
  @HttpCode(HttpStatus.OK)
  async handleSupabaseWebhook(
    @Headers('x-supabase-signature') signature: string,
    @Body() payload: any,
    @Req() req: Request,
  ): Promise<{ received: boolean }> {
    const rawBody = JSON.stringify(payload);
    
    if (!this.webhookHandler.verifySignature(rawBody, signature)) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    await this.webhookHandler.handleWebhook(payload);
    
    return { received: true };
  }
}
```

### 11. NestJS Module Configuration

```typescript
// auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule } from '@nestjs/config';

// Controllers
import { AuthController } from './presentation/controllers/auth.controller';
import { WebhookController } from './presentation/controllers/webhook.controller';

// Services
import { AuthService } from './application/services/auth.service';
import { RateLimiterService } from './application/services/rate-limiter.service';
import { AccountSyncService } from './application/services/account-sync.service';
import { WebhookHandlerService } from './application/services/webhook-handler.service';

// Adapters
import { SupabaseAuthAdapter } from './infrastructure/adapters/supabase-auth.adapter';
import { TypeOrmAccountRepository } from './infrastructure/adapters/typeorm-account.repository';
import { RedisCacheAdapter } from './infrastructure/adapters/redis-cache.adapter';

// Entities
import { AccountEntity } from './infrastructure/entities/account.entity';

// Ports (provide tokens)
import { IAuthProvider } from './domain/ports/auth-provider.port';
import { IAccountRepository } from './domain/ports/account-repository.port';
import { ICacheService } from './domain/ports/cache.port';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([AccountEntity]),
    RedisModule,
  ],
  controllers: [AuthController, WebhookController],
  providers: [
    // Application Services
    AuthService,
    RateLimiterService,
    AccountSyncService,
    WebhookHandlerService,
    
    // Infrastructure Adapters (bound to ports)
    {
      provide: 'IAuthProvider',
      useClass: SupabaseAuthAdapter,
    },
    {
      provide: 'IAccountRepository',
      useClass: TypeOrmAccountRepository,
    },
    {
      provide: 'ICacheService',
      useClass: RedisCacheAdapter,
    },
  ],
  exports: [AuthService], // Export for use in other modules
})
export class AuthModule {}
```

## Data Models

### Platform Database Schema (PostgreSQL)

```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_user_id UUID NOT NULL UNIQUE,
  email VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT email_or_phone_required CHECK (
    email IS NOT NULL OR phone IS NOT NULL
  )
);

CREATE INDEX idx_accounts_supabase_user_id ON accounts(supabase_user_id);
CREATE INDEX idx_accounts_email ON accounts(email);
CREATE INDEX idx_accounts_phone ON accounts(phone);
```

### Redis Data Structures

```
# Rate limiting
rate_limit:otp_request:<hashed_identifier> -> counter (TTL: 15 minutes)

# Token validation cache
token:<hashed_token> -> JSON(User) (TTL: 5 minutes)
```

### Supabase Auth Schema

Supabase manages the following internally:
- `auth.users` - User records with email/phone
- `auth.sessions` - Active sessions
- `auth.refresh_tokens` - Refresh tokens

## Error Handling

### Error Response Format

```typescript
interface ErrorResponse {
  error_code: string;
  message: string;
  timestamp: string;
  details?: any;
}
```

### Error Codes

- `RATE_LIMIT_EXCEEDED` - Too many OTP requests
- `INVALID_OTP` - OTP verification failed
- `TOKEN_EXPIRED` - Access token has expired
- `INVALID_TOKEN` - Token is malformed or invalid
- `ACCOUNT_NOT_FOUND` - Platform account doesn't exist
- `SUPABASE_ERROR` - Error from Supabase service
- `INTERNAL_ERROR` - Unexpected server error

### Error Handling Strategy

1. **Supabase Errors**: Catch and transform Supabase errors into standardized format
2. **Rate Limiting**: Return 429 status with retry-after information
3. **Validation Errors**: Return 400 status with clear error messages
4. **Authentication Errors**: Return 401 status for invalid/expired tokens
5. **Server Errors**: Log full error, return generic 500 response to client

```typescript
class ErrorHandler {
  static handle(error: any): ErrorResponse {
    if (error.code === 'PGRST301') {
      // Supabase rate limit
      return {
        error_code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later',
        timestamp: new Date().toISOString()
      };
    }
    
    if (error.message?.includes('Invalid OTP')) {
      return {
        error_code: 'INVALID_OTP',
        message: 'Invalid or expired code. Please request a new code',
        timestamp: new Date().toISOString()
      };
    }
    
    // Default error
    logger.error('Unhandled error:', error);
    return {
      error_code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    };
  }
}
```

## Testing Strategy

### Unit Tests

1. **SupabaseAuthClient**
   - Mock Supabase client responses
   - Test OTP request for email and phone
   - Test OTP verification success and failure
   - Test token refresh and logout

2. **RateLimiter**
   - Test rate limit enforcement
   - Test TTL expiry
   - Test identifier hashing

3. **TokenValidator**
   - Test cache hit and miss scenarios
   - Test token validation with Supabase
   - Test invalid token handling

4. **AccountSyncService**
   - Test account creation
   - Test account updates
   - Test account deletion
   - Test database constraints

5. **WebhookHandler**
   - Test signature verification
   - Test event handling for each event type
   - Test invalid signature rejection

### Integration Tests

1. **Full OTP Flow**
   - Request OTP → Verify OTP → Get tokens
   - Test new user account creation
   - Test existing user login

2. **Token Refresh Flow**
   - Verify OTP → Use access token → Refresh → Use new token

3. **Rate Limiting**
   - Make multiple OTP requests
   - Verify rate limit enforcement
   - Wait for TTL expiry and retry

4. **Webhook Processing**
   - Send user.updated webhook
   - Verify platform account is updated
   - Send user.deleted webhook
   - Verify platform account is deleted

### End-to-End Tests

1. Complete authentication flow from React frontend
2. Token validation across multiple services
3. Session persistence and refresh
4. Logout and token invalidation

## Security Considerations

1. **No User Enumeration**: Always return same message for OTP requests
2. **Rate Limiting**: Prevent brute force attacks on OTP
3. **Token Caching**: Limited TTL to balance performance and security
4. **Webhook Verification**: Validate Supabase webhook signatures
5. **Identifier Hashing**: Hash identifiers in Redis keys for privacy
6. **HTTPS Only**: All communication over TLS
7. **Environment Variables**: Store Supabase credentials securely
8. **Logging**: Log security events without exposing sensitive data

## Configuration

### Environment Variables

```bash
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SUPABASE_WEBHOOK_SECRET=whsec_...

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/platform

# Redis
REDIS_URL=redis://localhost:6379

# Service
PORT=3001
NODE_ENV=production
LOG_LEVEL=info

# Rate Limiting
OTP_REQUEST_LIMIT=5
OTP_REQUEST_WINDOW=900
```

## Deployment Considerations

1. **Horizontal Scaling**: Service is stateless, can scale horizontally
2. **Redis Availability**: Use Redis cluster or managed Redis for HA
3. **Database Connection Pooling**: Use pg pool with appropriate limits
4. **Health Checks**: Implement /health endpoint checking Supabase, Redis, and DB
5. **Monitoring**: Track OTP success rates, token validation latency, rate limit hits
6. **Logging**: Structured JSON logs with correlation IDs
