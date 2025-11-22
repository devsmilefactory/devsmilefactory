# Requirements Document

## Introduction

This document defines the requirements for the Authentication and Account Management system of the social collaboration platform. The system leverages Supabase Auth for passwordless authentication using One-Time Passwords (OTP) sent via email or SMS. The Auth Service acts as a wrapper around Supabase Auth, providing additional business logic, account management, and integration with the platform's microservices architecture. The system manages user accounts, session tokens, and provides secure access to the platform.

## Glossary

- **Auth_Service**: The authentication wrapper service that integrates Supabase Auth with the platform
- **Supabase_Auth**: The Supabase authentication service providing OTP and session management
- **Account**: A user's base account record in the platform database, linked to Supabase user
- **OTP**: One-Time Password, a temporary code sent via Supabase to verify identity
- **Session_Token**: A JWT token issued by Supabase representing an authenticated session
- **Refresh_Token**: A long-lived token issued by Supabase to obtain new access tokens
- **Identifier**: Email address or phone number used for authentication
- **Supabase_User**: The user record managed by Supabase Auth
- **Platform_Account**: The extended account record in the platform database containing additional user data

## Requirements

### Requirement 1

**User Story:** As a new user, I want to sign up using only my email or phone number without creating a password, so that I can quickly access the platform with minimal friction.

#### Acceptance Criteria

1. WHEN a user submits an identifier (email or phone), THE Auth_Service SHALL call Supabase_Auth signInWithOtp method
2. WHEN Supabase_Auth generates an OTP, THE Auth_Service SHALL receive confirmation and return a success response
3. THE Auth_Service SHALL configure Supabase_Auth to send OTP via email for email identifiers or SMS for phone identifiers
4. THE Auth_Service SHALL respond with the message "If an account exists or has been created, an OTP has been sent to your contact" regardless of account existence
5. WHEN a new Supabase_User is created, THE Auth_Service SHALL create a corresponding Platform_Account record with the Supabase user ID

### Requirement 2

**User Story:** As an existing user, I want to sign in using my email or phone number without the system revealing whether my account exists, so that my privacy is protected from enumeration attacks.

#### Acceptance Criteria

1. WHEN a user submits an identifier for an existing Supabase_User, THE Auth_Service SHALL call Supabase_Auth signInWithOtp method
2. WHEN Supabase_Auth sends an OTP for an existing account, THE Auth_Service SHALL receive confirmation
3. THE Auth_Service SHALL respond with the identical message "If an account exists or has been created, an OTP has been sent to your contact" for both existing and non-existing accounts
4. THE Auth_Service SHALL complete the OTP request process within 3 seconds for 95% of requests
5. IF Supabase_Auth returns an error, THEN THE Auth_Service SHALL log the error and return the same generic success message to prevent enumeration

### Requirement 3

**User Story:** As a user who received an OTP, I want to verify my code and gain access to the platform, so that I can use the system securely.

#### Acceptance Criteria

1. WHEN a user submits an OTP, THE Auth_Service SHALL call Supabase_Auth verifyOtp method with the token and identifier
2. WHEN Supabase_Auth verification succeeds, THE Auth_Service SHALL receive a Session_Token and Refresh_Token from Supabase
3. WHEN verification succeeds for a new Supabase_User, THE Auth_Service SHALL create a Platform_Account record and return is_new_user as true
4. WHEN verification succeeds for an existing Supabase_User, THE Auth_Service SHALL return the Session_Token with is_new_user as false
5. WHEN Supabase_Auth returns an invalid or expired OTP error, THE Auth_Service SHALL respond with "Invalid or expired code. Please request a new code"

### Requirement 4

**User Story:** As an authenticated user, I want my session to remain active without frequent re-authentication, so that I have a seamless experience while maintaining security.

#### Acceptance Criteria

1. WHEN Supabase_Auth verifies an OTP successfully, THE Auth_Service SHALL receive a short-lived access token with 60-minute expiry
2. WHEN Supabase_Auth verifies an OTP successfully, THE Auth_Service SHALL receive a long-lived Refresh_Token
3. THE Auth_Service SHALL return both Session_Token and Refresh_Token to the client for storage
4. WHEN a valid Refresh_Token is presented, THE Auth_Service SHALL call Supabase_Auth refreshSession to issue a new access token
5. WHEN a user logs out, THE Auth_Service SHALL call Supabase_Auth signOut to invalidate the session

### Requirement 5

**User Story:** As a system administrator, I want OTP attempts to be rate-limited, so that the system is protected from brute force attacks.

#### Acceptance Criteria

1. THE Auth_Service SHALL implement rate limiting for OTP requests at 5 attempts per identifier within a 15-minute window
2. WHEN the rate limit is exceeded, THE Auth_Service SHALL respond with "Too many requests. Please try again in 15 minutes" before calling Supabase_Auth
3. THE Auth_Service SHALL store rate limit counters in Redis with automatic expiry matching the rate limit window
4. THE Auth_Service SHALL rely on Supabase_Auth built-in rate limiting for OTP verification attempts
5. THE Auth_Service SHALL log all rate limit violations with identifier hash and timestamp for security monitoring

### Requirement 6

**User Story:** As a security-conscious user, I want my session tokens to be securely validated on every request, so that unauthorized access is prevented.

#### Acceptance Criteria

1. THE Auth_Service SHALL validate Session_Tokens by calling Supabase_Auth getUser method with the token
2. WHEN Supabase_Auth validates a Session_Token successfully, THE Auth_Service SHALL retrieve the Supabase_User details
3. WHEN a Session_Token has expired, THE Auth_Service SHALL return HTTP 401 status with error message "Token expired"
4. THE Auth_Service SHALL verify that a Platform_Account exists for the Supabase_User ID
5. THE Auth_Service SHALL cache valid token validations in Redis for 5 minutes to reduce Supabase API calls

### Requirement 7

**User Story:** As a developer integrating with the Auth Service, I want clear API endpoints and error responses, so that I can build reliable client applications.

#### Acceptance Criteria

1. THE Auth_Service SHALL expose POST /auth/request-otp endpoint accepting identifier in JSON payload
2. THE Auth_Service SHALL expose POST /auth/verify-otp endpoint accepting identifier, otp, and optional client_metadata in JSON payload
3. THE Auth_Service SHALL expose POST /auth/refresh endpoint accepting refresh_token in JSON payload
4. THE Auth_Service SHALL expose POST /auth/logout endpoint accepting access_token in Authorization header
5. THE Auth_Service SHALL return standardized JSON error responses with error_code, message, and timestamp fields for all error conditions

### Requirement 8

**User Story:** As a platform user, I want my account data synchronized between Supabase and the platform database, so that my profile information is consistent across services.

#### Acceptance Criteria

1. WHEN a new Supabase_User is created via OTP verification, THE Auth_Service SHALL create a Platform_Account with supabase_user_id, email, phone, and created_at fields
2. WHEN a Supabase_User updates their email or phone, THE Auth_Service SHALL listen to Supabase webhooks and update the Platform_Account
3. THE Auth_Service SHALL expose GET /auth/me endpoint that returns both Supabase_User data and Platform_Account data
4. WHEN a user deletes their account, THE Auth_Service SHALL delete both the Supabase_User and Platform_Account records
5. THE Auth_Service SHALL maintain referential integrity between Supabase_User ID and Platform_Account supabase_user_id field
