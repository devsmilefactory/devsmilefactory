# Tasks: Phase 1 Backend Foundation

**Input**: Spec + plan at `specs/001-build-backend-phase1/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md/data-model.md/quickstart.md/contracts/ as produced during planning

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 [P] Ensure repo layout remains unchanged; add-only under `apps/backend-node`, `.github/`, `.codex/`, `mcp/`, `config/`, `deployment/`
- [X] T002 [P] Initialize env config for Supabase/PostgreSQL, Redis, storage, JWT/OTP in `apps/backend-node/src/config/`
- [X] T003 [P] Add common logging, error filter, structured error format, and health/status endpoint scaffold in `apps/backend-node/src/common/`
- [X] T004 [P] Wire base Nest app bootstrap in `apps/backend-node/src/main.ts` with global pipes/filters/guards for validation and rate limiting hooks

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T005 Configure RLS-aware database client + Redis client + storage adapter (Supabase storage) in `apps/backend-node/src/config/clients.ts`
- [X] T006 Implement rate limiting middleware/guard for auth, messaging, feed endpoints in `apps/backend-node/src/common/rate-limit.guard.ts`
- [X] T007 Implement audit/event logging utility capturing actor profile, action, entity, outcome in `apps/backend-node/src/common/audit.ts`
- [X] T008 Define shared DTO/validators for pagination, visibility (public/private/targeted), profile context in `apps/backend-node/src/dto/common.ts`
- [X] T009 [P] Add file validation (type/size) and storage reference helper for uploads in `apps/backend-node/src/common/files.ts`
- [X] T010 Apply profile-context guard middleware globally to scope requests to active profile and RLS intent across modules

## Phase 3: User Story 1 - Public browsing of published content (P1)

**Goal**: Anonymous visitors can browse public content; private/targeted content is blocked; mutations require auth.  
**Independent Test**: Fetch feeds/item detail without auth; verify public items load and private/targeted are denied.

### Implementation

- [X] T011 [P] Implement visibility enforcement helper (public/private/targeted with profile-type + tags/interests) in `apps/backend-node/src/common/visibility.ts`
- [X] T012 [P] Add read-only feed/query endpoints for public browsing in `apps/backend-node/src/modules/feed/feed.controller.ts` (public route guards)
- [X] T013 Add read-only detail endpoints for posts/events/listings with visibility checks in `apps/backend-node/src/modules/feed/feed.service.ts`
- [X] T014 Ensure unauthenticated requests are blocked from mutations (post/comment/like/bookmark/message/register) via guards/interceptors
- [X] T015 Enforce visibility/eligibility for targeted/private items on all read surfaces (feed, search, notifications enqueue/delivery) using common helper

### Tests (optional but recommended)

- [ ] T016 [P] Integration test: anonymous feed returns only public items; targeted/private are excluded in `apps/backend-node/test/feed.public.e2e-spec.ts`

## Phase 4: User Story 2 - Passwordless login & profile access (P1)

**Goal**: OTP auth with profile selection (base/specialized/staff); enforce RLS and session binding to active profile.  
**Independent Test**: Issue OTP, redeem, select profile, receive session with correct scope; enforce attempt/cooldown limits.

### Implementation

- [ ] T020 Implement OTP issuance with rate limit/attempt tracking in `apps/backend-node/src/modules/auth/auth.service.ts`
- [ ] T021 Implement OTP verify + session/token issuance bound to selected profile in `apps/backend-node/src/modules/auth/auth.controller.ts`
- [ ] T022 Add profile selection endpoint and guard to enforce active profile on all requests in `apps/backend-node/src/modules/profiles/profile.guard.ts`
- [ ] T023 Wire audit logging for auth attempts and profile selection
- [ ] T024 Verify profile guard is applied on all module routes (feed, messaging, connections, events, marketplace, search, notifications, migrations) in `apps/backend-node/src/main.ts`

### Tests (optional but recommended)

- [ ] T025 Integration test: OTP issuance limits and expiry in `apps/backend-node/test/auth.otp.e2e-spec.ts`
- [ ] T026 Integration test: profile selection required; requests without profile context are rejected in `apps/backend-node/test/auth.profile-context.e2e-spec.ts`

## Phase 5: User Story 3 - Create and consume content feeds (P1)

**Goal**: Authenticated profiles create posts across categories; feeds are ranked by profile type/interests; visibility honored.  
**Independent Test**: Create posts with category metadata, fetch ranked feed respecting visibility and engagement counters.

### Implementation

- [ ] T030 Define post DTOs with category-specific validation (marketplace price, event date/location, etc.) in `apps/backend-node/src/modules/feed/dto/`
- [ ] T031 Implement post create/update/soft-delete with profile attribution and metadata validation in `apps/backend-node/src/modules/feed/feed.service.ts`
- [ ] T032 Implement feed ranking using profile type + declared interests/tags + recent engagement in `apps/backend-node/src/modules/feed/feed.ranker.ts`
- [ ] T033 Enforce visibility filter (public/private/targeted) in feed queries and detail retrieval
- [ ] T034 Persist engagement counters (likes/comments/shares/bookmarks/views) with safe increments in `apps/backend-node/src/modules/feed/engagement.service.ts`
- [ ] T035 Accept and validate file uploads for posts; store Supabase storage references only
- [ ] T036 Ensure targeted/private posts excluded from notification enqueue/delivery for ineligible profiles

### Tests (optional but recommended)

- [ ] T037 Integration test: create posts per category with validation; visibility respected in feeds in `apps/backend-node/test/feed.create.e2e-spec.ts`
- [ ] T038 Integration test: ranking uses profile type + interests; targeted posts hidden from ineligible profiles in `apps/backend-node/test/feed.rank.visibility.e2e-spec.ts`

## Phase 6: User Story 4 - Network interactions and messaging (P2)

**Goal**: Connection requests (idempotent, accept/reject) and DMs with unread/read markers, membership checks.  
**Independent Test**: Send/accept requests; send/receive messages with unread counts and delivery/read flags.

### Implementation

- [ ] T040 Implement connection request/accept/reject with dedupe and block checks in `apps/backend-node/src/modules/connections/connections.service.ts`
- [ ] T041 Implement messaging send/list/read with conversation membership enforcement in `apps/backend-node/src/modules/messaging/messaging.service.ts`
- [ ] T042 Update notification records for connection and messaging events in `apps/backend-node/src/modules/notifications/notifications.service.ts`

### Tests (optional but recommended)

- [ ] T043 Integration test: connection request/accept dedupe and block enforcement in `apps/backend-node/test/connections.e2e-spec.ts`
- [ ] T044 Integration test: messaging unread/read markers and membership enforcement in `apps/backend-node/test/messaging.e2e-spec.ts`
- [ ] T045 Integration test: suggestions exclude existing/blocked and respect profile-type + interests in `apps/backend-node/test/connections.suggestions.e2e-spec.ts`

## Phase 7: User Story 5 - Events and marketplace participation (P3)

**Goal**: Register for events with capacity enforcement; contact seller intent recorded for marketplace listings.  
**Independent Test**: Register until capacity; verify waitlist/reject; contact seller recorded.

### Implementation

- [ ] T050 Implement event create/update and registration with atomic capacity checks in `apps/backend-node/src/modules/events/events.service.ts`
- [ ] T051 Implement marketplace listings CRUD with pricing/media references and contact-seller intent capture in `apps/backend-node/src/modules/marketplace/marketplace.service.ts`
- [ ] T052 Ensure visibility enforcement on event/listing reads for private/targeted cases
- [ ] T052a Ensure mutation endpoints for connections, events, marketplace, and migrations include rate limiting where applicable

### Tests (optional but recommended)

- [ ] T053 Integration test: event registration capacity/waitlist in `apps/backend-node/test/events.capacity.e2e-spec.ts`
- [ ] T054 Integration test: marketplace contact intent recorded and visible to seller in `apps/backend-node/test/marketplace.contact.e2e-spec.ts`

## Phase 8: Search/Discovery and Suggestions (cross-story)

- [ ] T060 Implement search endpoints across posts/profiles/events/listings with safe query handling in `apps/backend-node/src/modules/search/search.service.ts`
- [ ] T061 Generate connection suggestions using profile questions + declared interests/tags, excluding existing/blocked in `apps/backend-node/src/modules/connections/suggestions.service.ts`
- [ ] T062 Ensure private/targeted items never appear in search results

## Phase 9: Notifications (in-app only, Phase 1)

- [ ] T070 Implement in-app notification records for key triggers (connection request/accept, message received, event registration status, seller contact) in `apps/backend-node/src/modules/notifications/notifications.service.ts`
- [ ] T071 Add notification read/unread endpoints with profile enforcement
- [ ] T072 Assert no outbound email/SMS code paths are wired; document in notifications module that Phase 1 is in-app only

## Phase 10: Migrations (accounts + profiles only)

- [ ] T080 Implement import jobs/endpoints for legacy accounts + profiles with integrity checks and retryable batches in `apps/backend-node/src/modules/migrations/migrations.service.ts`
- [ ] T081 Add audit logging for migration operations; ensure no other entities are migrated in Phase 1
- [ ] T082 Add guard/validation to reject non-account/profile entities in migration inputs; log any attempts

## Phase 11: Cross-Cutting Hardening & Docs

- [ ] T090 Add structured health/status endpoints and error responses covering all modules in `apps/backend-node/src/main.ts` and common filters
- [ ] T091 Validate rate limiting/audit logging are applied to auth, messaging, feed, and other mutations (and applicable connections/events/marketplace/migrations mutations)
- [ ] T092 Update quickstart.md with env, run, and test instructions for backend in `specs/001-build-backend-phase1/quickstart.md`
- [ ] T093 Update contracts/ with endpoint shapes for auth, feed, connections, messaging, events, marketplace, search, notifications, migrations
- [ ] T094 Ensure file validation + Supabase storage references documented and enforced
- [ ] T095 Final review against Constitution gates (visibility, profile attribution/RLS, rate limits, audit logging, repo layout additive-only)
