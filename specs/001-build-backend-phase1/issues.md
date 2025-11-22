# GitHub Issue Drafts -- Phase 1 Backend Foundation

Remote: https://github.com/devsmilefactory/devsmilefactory.git  
Scope: Additive changes only under `apps/backend-node` and supporting config directories.

## Phase 1: Setup (Shared Infrastructure)
- [X] T001: Preserve repo layout; add-only under `apps/backend-node`, `.github/`, `.codex/`, `mcp/`, `config/`, `deployment/`.
- [X] T002: Initialize env config for Supabase/PostgreSQL, Redis, storage, JWT/OTP in `apps/backend-node/src/config/`.
- [X] T003: Add logging, error filter, structured error format, and health/status scaffold in `apps/backend-node/src/common/`.
- [X] T004: Wire Nest app bootstrap in `apps/backend-node/src/main.ts` with global pipes/filters/guards and rate-limiting hooks.

## Phase 2: Foundational (Blocking Prerequisites)
- [X] T005: Configure RLS-aware DB client + Redis client + storage adapter in `apps/backend-node/src/config/clients.ts`.
- [X] T006: Implement rate limiting middleware/guard for auth, messaging, feed endpoints in `apps/backend-node/src/common/rate-limit.guard.ts`.
- [X] T007: Implement audit/event logging utility with actor profile/action/entity/outcome in `apps/backend-node/src/common/audit.ts`.
- [X] T008: Define shared DTO/validators for pagination, visibility, profile context in `apps/backend-node/src/dto/common.ts`.
- [X] T009: Add file validation (type/size) and storage reference helper for uploads in `apps/backend-node/src/common/files.ts`.
- [X] T010: Apply profile-context guard middleware globally to scope RLS intent across modules.

## Phase 3: User Story 1 - Public browsing (P1)
- [X] T011: Visibility enforcement helper (public/private/targeted) in `apps/backend-node/src/common/visibility.ts`.
- [X] T012: Read-only feed/query endpoints for public browsing in `apps/backend-node/src/modules/feed/feed.controller.ts`.
- [X] T013: Read-only detail endpoints with visibility checks in `apps/backend-node/src/modules/feed/feed.service.ts`.
- [X] T014: Guard unauthenticated users from mutations (post/comment/like/bookmark/message/register).
- [X] T015: Enforce visibility/eligibility for targeted/private items on all read surfaces.
- [ ] T016: Integration test: anonymous feed returns only public items (`apps/backend-node/test/feed.public.e2e-spec.ts`).

## Phase 4: User Story 2 - Passwordless login & profile access (P1)
- [ ] T020: OTP issuance with rate limit/attempt tracking in `apps/backend-node/src/modules/auth/auth.service.ts`.
- [ ] T021: OTP verify + session/token issuing bound to selected profile in `apps/backend-node/src/modules/auth/auth.controller.ts`.
- [ ] T022: Profile selection endpoint and guard enforcing active profile in `apps/backend-node/src/modules/profiles/profile.guard.ts`.
- [ ] T023: Wire audit logging for auth attempts and profile selection.
- [ ] T024: Apply profile guard to all module routes in `apps/backend-node/src/main.ts`.
- [ ] T025: Integration test: OTP issuance limits and expiry (`apps/backend-node/test/auth.otp.e2e-spec.ts`).
- [ ] T026: Integration test: profile context required (`apps/backend-node/test/auth.profile-context.e2e-spec.ts`).

## Phase 5: User Story 3 - Create/consume content feeds (P1)
- [ ] T030: Define post DTOs with category validations in `apps/backend-node/src/modules/feed/dto/`.
- [ ] T031: Post create/update/soft-delete with profile attribution in `apps/backend-node/src/modules/feed/feed.service.ts`.
- [ ] T032: Feed ranking using profile type + interests/tags + engagement in `apps/backend-node/src/modules/feed/feed.ranker.ts`.
- [ ] T033: Visibility filter enforcement in feed queries and detail retrieval.
- [ ] T034: Engagement counters with safe increments in `apps/backend-node/src/modules/feed/engagement.service.ts`.
- [ ] T035: Validate uploads for posts; store Supabase storage references only.
- [ ] T036: Exclude targeted/private posts from notifications for ineligible profiles.
- [ ] T037: Integration test: create posts per category with visibility respected (`apps/backend-node/test/feed.create.e2e-spec.ts`).
- [ ] T038: Integration test: ranking uses profile type + interests; targeted posts hidden (`apps/backend-node/test/feed.rank.visibility.e2e-spec.ts`).

## Phase 6: User Story 4 - Network interactions and messaging (P2)
- [ ] T040: Connection request/accept/reject with dedupe/block checks in `apps/backend-node/src/modules/connections/connections.service.ts`.
- [ ] T041: Messaging send/list/read with membership enforcement in `apps/backend-node/src/modules/messaging/messaging.service.ts`.
- [ ] T042: Notification updates for connection and messaging events in `apps/backend-node/src/modules/notifications/notifications.service.ts`.
- [ ] T043: Integration test: connection dedupe/block enforcement (`apps/backend-node/test/connections.e2e-spec.ts`).
- [ ] T044: Integration test: messaging unread/read markers and membership (`apps/backend-node/test/messaging.e2e-spec.ts`).
- [ ] T045: Integration test: suggestions exclude existing/blocked and respect profile-type + interests (`apps/backend-node/test/connections.suggestions.e2e-spec.ts`).

## Phase 7: Events and marketplace (P3)
- [ ] T050: Event create/update/registration with capacity checks in `apps/backend-node/src/modules/events/events.service.ts`.
- [ ] T051: Marketplace listings CRUD with pricing/media and contact-seller intent in `apps/backend-node/src/modules/marketplace/marketplace.service.ts`.
- [ ] T052: Enforce visibility on event/listing reads for private/targeted cases.
- [ ] T052a: Ensure mutation endpoints for connections/events/marketplace/migrations include rate limiting where applicable.
- [ ] T053: Integration test: event registration capacity/waitlist (`apps/backend-node/test/events.capacity.e2e-spec.ts`).
- [ ] T054: Integration test: marketplace contact intent recorded (`apps/backend-node/test/marketplace.contact.e2e-spec.ts`).

## Phase 8: Search/Discovery and Suggestions
- [ ] T060: Search endpoints across posts/profiles/events/listings with safe query handling in `apps/backend-node/src/modules/search/search.service.ts`.
- [ ] T061: Connection suggestions using profile questions + interests/tags excluding existing/blocked in `apps/backend-node/src/modules/connections/suggestions.service.ts`.
- [ ] T062: Prevent private/targeted items from search results.

## Phase 9: Notifications (in-app only)
- [ ] T070: In-app notification records for key triggers in `apps/backend-node/src/modules/notifications/notifications.service.ts`.
- [ ] T071: Notification read/unread endpoints with profile enforcement.
- [ ] T072: Assert no outbound email/SMS paths; document in notifications module.

## Phase 10: Migrations (accounts + profiles only)
- [ ] T080: Import jobs/endpoints with integrity checks and retryable batches in `apps/backend-node/src/modules/migrations/migrations.service.ts`.
- [ ] T081: Audit logging for migration operations; scope to accounts/profiles.
- [ ] T082: Guard/validate to reject non-account/profile entities; log attempts.

## Phase 11: Cross-Cutting Hardening & Docs
- [ ] T090: Structured health/status endpoints and error responses across modules in `apps/backend-node/src/main.ts` and common filters.
- [ ] T091: Validate rate limiting/audit logging on auth, messaging, feed, and applicable mutations.
- [ ] T092: Update `specs/001-build-backend-phase1/quickstart.md` with env/run/test instructions.
- [ ] T093: Update `specs/001-build-backend-phase1/contracts/` with endpoint shapes.
- [ ] T094: Ensure file validation + storage references documented/enforced.
- [ ] T095: Final review against constitution gates: visibility, profile attribution/RLS, rate limits, audit logging, additive-only repo layout.
