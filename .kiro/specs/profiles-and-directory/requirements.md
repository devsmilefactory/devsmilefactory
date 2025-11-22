# Requirements Document

## Introduction

This document defines the requirements for the Profiles & Directory service of the social collaboration platform. The system enables users to create and manage multiple profiles (roles) per account, such as Innovator, Investor, Mentor, Student, Institution, or Organization. Users can switch between profiles, maintain rich profile information, and discover other users through a searchable directory with filtering capabilities.

## Glossary

- **Profile_Service**: The microservice managing user profiles and directory functionality
- **Account**: The base user account from the Auth Service, identified by account_id
- **Profile**: A role-based identity linked to an account (e.g., Innovator, Investor, Mentor)
- **Profile_Type**: The category of profile (innovator, investor, mentor, professional, student, institution, organization)
- **Active_Profile**: The currently selected profile for a user session
- **Default_Profile**: The primary profile set during onboarding
- **Profile_Directory**: The searchable listing of all public profiles
- **Profile_Visibility**: Setting controlling whether a profile appears in directory (public/private)

## Requirements

### Requirement 1

**User Story:** As a new user who just verified my OTP, I want to select one or more profile types during onboarding, so that I can represent my different roles in the ecosystem.

#### Acceptance Criteria

1. WHEN a new user completes OTP verification with is_new_user=true, THE Profile_Service SHALL present a profile type selection interface
2. THE Profile_Service SHALL offer profile types: innovator, investor, mentor, professional, student, institution, organization
3. WHEN a user selects one or more profile types, THE Profile_Service SHALL create profile records for each selected type
4. THE Profile_Service SHALL set the first selected profile as the Default_Profile
5. THE Profile_Service SHALL require at least one profile type selection before proceeding

### Requirement 2

**User Story:** As a user with multiple profiles, I want to provide detailed information for each profile type, so that others can understand my background and expertise.

#### Acceptance Criteria

1. THE Profile_Service SHALL store profile fields: display_name, bio, location, avatar_url, cover_image_url, website, social_links
2. WHEN profile_type is innovator, THE Profile_Service SHALL support additional fields: startup_name, industry, stage, founding_date
3. WHEN profile_type is investor, THE Profile_Service SHALL support additional fields: investment_focus, ticket_size, portfolio_companies
4. WHEN profile_type is mentor, THE Profile_Service SHALL support additional fields: expertise_areas, years_experience, mentorship_capacity
5. THE Profile_Service SHALL validate required fields: display_name (minimum 2 characters), profile_type

### Requirement 3

**User Story:** As a user, I want to add tags and skills to my profiles, so that I can be discovered by others with similar interests or needs.

#### Acceptance Criteria

1. THE Profile_Service SHALL allow users to add up to 20 tags per profile
2. THE Profile_Service SHALL store tags with lowercase normalization for consistent searching
3. THE Profile_Service SHALL support predefined tag categories: industries, technologies, interests, skills
4. WHEN a user adds a tag, THE Profile_Service SHALL suggest existing tags matching the input
5. THE Profile_Service SHALL prevent duplicate tags on the same profile

### Requirement 4

**User Story:** As a user with multiple profiles, I want to switch between my profiles easily, so that I can interact with the platform in different capacities.

#### Acceptance Criteria

1. THE Profile_Service SHALL expose an endpoint to list all profiles for the authenticated account
2. WHEN a user requests to switch profiles, THE Profile_Service SHALL validate the profile belongs to their account
3. WHEN profile switch is successful, THE Profile_Service SHALL update the active_profile_id in the session context
4. THE Profile_Service SHALL return the full profile data after switching
5. THE Profile_Service SHALL complete profile switching within 500 milliseconds for 95% of requests

### Requirement 5

**User Story:** As a user, I want to update my profile information at any time, so that my profile stays current and accurate.

#### Acceptance Criteria

1. THE Profile_Service SHALL allow users to update any profile field they own
2. WHEN a profile is updated, THE Profile_Service SHALL validate all field constraints
3. WHEN a profile is updated, THE Profile_Service SHALL update the updated_at timestamp
4. THE Profile_Service SHALL prevent users from updating profiles they do not own
5. THE Profile_Service SHALL emit a ProfileUpdated event for search index synchronization

### Requirement 6

**User Story:** As a user, I want to control the visibility of my profiles, so that I can choose whether to appear in the public directory.

#### Acceptance Criteria

1. THE Profile_Service SHALL support visibility settings: public, private
2. WHEN visibility is set to public, THE Profile_Service SHALL include the profile in directory searches
3. WHEN visibility is set to private, THE Profile_Service SHALL exclude the profile from directory searches
4. THE Profile_Service SHALL default new profiles to public visibility
5. THE Profile_Service SHALL allow users to change visibility settings at any time

### Requirement 7

**User Story:** As a user, I want to browse a directory of profiles, so that I can discover innovators, investors, mentors, and other ecosystem participants.

#### Acceptance Criteria

1. THE Profile_Service SHALL expose a directory endpoint returning paginated profile listings
2. THE Profile_Service SHALL return only profiles with visibility set to public
3. THE Profile_Service SHALL support pagination with page size between 10 and 50 results
4. THE Profile_Service SHALL return profile cards with: display_name, bio, avatar_url, profile_type, location, tags
5. THE Profile_Service SHALL order results by created_at descending by default

### Requirement 8

**User Story:** As a user browsing the directory, I want to filter profiles by type, location, and tags, so that I can find relevant people quickly.

#### Acceptance Criteria

1. THE Profile_Service SHALL support filtering by profile_type with multiple selections
2. THE Profile_Service SHALL support filtering by location with partial text matching
3. THE Profile_Service SHALL support filtering by tags with multiple selections (AND logic)
4. THE Profile_Service SHALL support combining multiple filters simultaneously
5. THE Profile_Service SHALL return filter counts showing how many profiles match each filter option

### Requirement 9

**User Story:** As a user, I want to search for profiles by name or keywords, so that I can find specific people or expertise.

#### Acceptance Criteria

1. THE Profile_Service SHALL support full-text search across display_name, bio, and tags
2. THE Profile_Service SHALL return search results ranked by relevance
3. THE Profile_Service SHALL highlight matching terms in search results
4. THE Profile_Service SHALL complete searches within 1 second for 95% of queries
5. THE Profile_Service SHALL support search queries with minimum 2 characters

### Requirement 10

**User Story:** As a user, I want to view detailed profile pages for other users, so that I can learn more about them before connecting.

#### Acceptance Criteria

1. THE Profile_Service SHALL expose an endpoint to retrieve full profile details by profile_id
2. WHEN a profile is public, THE Profile_Service SHALL return all profile information
3. WHEN a profile is private, THE Profile_Service SHALL return HTTP 404 status
4. THE Profile_Service SHALL include connection status in profile response (connected, pending, none)
5. THE Profile_Service SHALL increment a view_count metric when profiles are viewed

### Requirement 11

**User Story:** As a platform administrator, I want profile data to be consistent and validated, so that the directory maintains high quality.

#### Acceptance Criteria

1. THE Profile_Service SHALL validate display_name length between 2 and 100 characters
2. THE Profile_Service SHALL validate bio length maximum 500 characters
3. THE Profile_Service SHALL validate URL formats for website, avatar_url, cover_image_url, social_links
4. THE Profile_Service SHALL sanitize all text inputs to prevent XSS attacks
5. THE Profile_Service SHALL reject profile updates with invalid data and return clear error messages

### Requirement 12

**User Story:** As a developer integrating with the Profile Service, I want clear API contracts, so that I can build reliable client applications.

#### Acceptance Criteria

1. THE Profile_Service SHALL expose POST /profiles/bulk-create endpoint for onboarding
2. THE Profile_Service SHALL expose GET /profiles/me endpoint returning all profiles for authenticated user
3. THE Profile_Service SHALL expose POST /profiles/switch endpoint to change active profile
4. THE Profile_Service SHALL expose PATCH /profiles/:id endpoint to update profile
5. THE Profile_Service SHALL expose GET /profiles/directory endpoint with filtering and pagination
6. THE Profile_Service SHALL expose GET /profiles/:id endpoint to view profile details
7. THE Profile_Service SHALL return standardized JSON responses with proper HTTP status codes
