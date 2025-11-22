# Feature Specification: Phase 1 Backend Foundation

**Feature Branch**: `001-build-backend-phase1`  
**Created**: 2025-11-20  
**Status**: Ready for implementation  
**Input**: Build Phase 1 backend for SmileFactory: deliver passwordless OTP auth, multi-profile access, public discovery, category-aware posting, events, marketplace listings, direct messaging, notifications, search, connections, and migrations. Follow the defined data model while addressing rate limiting, file safety, visibility controls, reliability, and security hardening.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Public browsing of published content (Priority: P1)

As an anonymous visitor, I can browse published posts, events, marketplace listings, and profiles marked public so I can discover the ecosystem without creating an account.

**Why this priority**: Public visibility drives acquisition; browsing must work even before authentication.

**Independent Test**: With only feed/read endpoints enabled, request public content without a session and verify access is granted except for items explicitly marked private.

**Acceptance Scenarios**:

1. **Given** published content with public visibility, **When** an unauthenticated visitor loads feeds or item detail, **Then** full public fields are returned without requiring login.
2. **Given** content marked private, **When** an unauthenticated visitor requests it, **Then** access is denied with a clear message.
3. **Given** an unauthenticated visitor, **When** they attempt to create, like, comment, bookmark, or message, **Then** the action is blocked with a prompt to authenticate.

---

### User Story 2 - Passwordless login & profile access (Priority: P1)

As a registered user, I can sign in with a one-time passcode and select any of my profiles so I can access personalized content and actions tied to that profile.

**Why this priority**: No other capability is usable until identity and profile context are established.

**Independent Test**: Issue OTP to a known email/phone, redeem within expiry, enforce attempt limits, and return a session bound to the chosen profile without calling other feature APIs.

**Acceptance Scenarios**:

1. **Given** a verified account exists, **When** the user requests an OTP, **Then** a single-use code is issued, rate-limited, and expires after the configured time.
2. **Given** an unexpired OTP and multiple profiles (including base and specialized/staff profiles), **When** the user redeems the OTP and selects a profile, **Then** they receive a session token bound to that profile with correct roles and RLS context.
3. **Given** three failed OTP attempts, **When** the user retries, **Then** issuance is blocked until the cooldown period elapses.

---

### User Story 3 - Create and consume content feeds (Priority: P1)

As an authenticated profile, I can create and browse posts across supported categories (general, opportunity, update, blog, event, marketplace, admin) so I can share and consume ecosystem content.

**Why this priority**: Content creation/consumption is the core value prop and must work across categories from day one.

**Independent Test**: With only auth and feed services running, create category-specific posts, fetch paginated feeds, and verify category behaviors without needing messaging or notifications.

**Acceptance Scenarios**:

1. **Given** a signed-in profile (base or specialized/staff), **When** they submit a post with category-specific metadata (e.g., price for marketplace, date/location for events), **Then** the post is persisted with validation for that category and attributed to the selected profile.
2. **Given** multiple posts across categories, **When** the profile requests the feed with filters (category, tags), **Then** results are ranked for relevance using profile type/interests and viewing context while being paginated and keeping engagement counters.
3. **Given** a published post, **When** another profile views details, **Then** they see the full metadata and CTAs appropriate to that category (e.g., contact seller, join event) and only if the post visibility permits it.

---

### User Story 4 - Network interactions and messaging (Priority: P2)

As an authenticated profile, I can manage connections and exchange direct messages so I can build relationships within the ecosystem.

**Why this priority**: Relationships drive retention and platform value after content availability.

**Independent Test**: With auth + connection + messaging services, send/accept requests and exchange messages without relying on feed or marketplace.

**Acceptance Scenarios**:

1. **Given** two profiles, **When** one sends a connection request, **Then** the request is stored, deduplicated, and the recipient can accept or reject.
2. **Given** an accepted connection, **When** one user sends a message, **Then** the message is stored, marked unread for the recipient, and retrievable with timestamps and read flags.
3. **Given** an unread message, **When** the recipient reads the conversation, **Then** unread counts decrement and the sender can see delivered/read status in subsequent fetches.

---

### User Story 5 - Events and marketplace participation (Priority: P3)

As an authenticated profile, I can register for events and contact marketplace sellers so I can act on opportunities surfaced in the platform.

**Why this priority**: These actions monetize and validate the ecosystem but can trail core auth and feed.

**Independent Test**: With auth + events + marketplace services, register for an event and send a seller contact request without using messaging or notifications.

**Acceptance Scenarios**:

1. **Given** a published event with available capacity, **When** a profile registers, **Then** they are added with status tracked and capacity decremented atomically.
2. **Given** a marketplace listing, **When** a profile taps contact seller, **Then** a contact intent is recorded and delivered to the seller’s inbox or messaging channel.

### Edge Cases

- OTP requests exceed rate limits or are repeatedly requested for non-existent emails/phones.
- Session token is used after profile deletion or deactivation.
- Posts submitted with unsupported category metadata or oversized payloads.
- Event registration attempts when capacity is full or after cutoff time.
- Duplicate connection requests between the same two profiles.
- Message send attempts to blocked users or non-participants in a conversation.
- File uploads for posts/listings exceeding size/type limits.
- Search queries with abusive patterns (regex/special chars) or extremely high result counts.
- Background jobs interrupted mid-migration or notification dispatch.
- Public-content requests for items restricted to private visibility.
- Posting attempts while authenticated to a profile type that lacks posting privileges (e.g., staff-only or disabled role).
- Private posts targeting a specific audience incorrectly surfacing to unintended profiles or anonymous users.
- Recommendation outputs returning empty sets when interests are sparse; fallback ordering must still be deterministic.
- Feed ranking over-emphasizes one category and starves others; need balancing or caps.
- Connection suggestions repeatedly show already connected or blocked profiles.
- Targeted posts with type + tag criteria misapply logic (e.g., AND vs OR) leading to wrong eligibility sets.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Provide passwordless OTP issuance and verification with configurable expiry, attempt limits, and cooldowns; block brute-force and resend abuse.
- **FR-002**: Support multiple profiles per account (including base and specialized profiles such as staff) with a required profile selection step that scopes all subsequent actions and permissions.
- **FR-003**: Enforce role- and profile-aware access controls with row-level data filtering so profiles only access their own or permitted records.
- **FR-004**: Enable creation, retrieval, update, and soft deletion of posts across all categories with category-specific validation of metadata and CTAs, ensuring posts are attributed to the active profile.
- **FR-005**: Deliver paginated feed queries with filters (category, tags, profile) and include engagement counters (likes, comments, shares, bookmarks, views).
- **FR-006**: Allow public read access to published content by default while respecting per-item visibility flags (public vs private/targeted); block creation or interactions (post, comment, like, bookmark, message) without authentication.
- **FR-007**: Apply feed ranking that prioritizes relevance based on viewer profile type, declared interests, and recent engagement while ensuring private/targeted posts only surface to eligible audiences.
- **FR-008**: Generate connection suggestions using profile questions/interests and interaction signals to recommend relevant profiles; exclude already connected, blocked, or clearly irrelevant matches.
- **FR-009**: Allow profile-to-profile connection requests with idempotency, accept/reject flows, and prevention of duplicates and self-connections.
- **FR-010**: Provide direct messaging with conversation membership checks, unread counts, read/delivery markers, and ordered history retrieval.
- **FR-011**: Support event creation, updates, and registrations with capacity enforcement, waitlisting or rejection on overflow, and attendee status tracking.
- **FR-012**: Support marketplace listings with pricing, media attachments, and a captured “contact seller” intent routed to the seller.
- **FR-013**: Provide global search across posts, profiles, events, and marketplace items with basic filters and safe handling of abusive queries.
- **FR-014**: Generate in-app notification records for key triggers (new connection request/accept, message received, event registration status, seller contact).
- **FR-015**: Accept file uploads (images/docs) for posts, profiles, events, and listings with validation on type/size and storage of references.
- **FR-016**: Implement API rate limiting and request throttling per account/profile to protect auth, messaging, and feed endpoints.
- **FR-017**: Log security- and audit-relevant events (auth attempts, permission denials, data mutations) with timestamps and actor/profile context.
- **FR-018**: Provide migration endpoints/jobs to import legacy user accounts and profiles into the defined schema with integrity checks and retryable batches.
- **FR-019**: Expose health/status endpoints and structured error responses that distinguish client validation errors from server faults.

### Key Entities *(include if feature involves data)*

- **Account**: Authentication identity; links to one or more profiles; stores contact for OTP delivery and verification status/timestamps.
- **Profile**: Role-specific persona tied to an account; includes display info, verification flags, and completion progress; scopes permissions.
- **Post**: Content record with type, title/body, metadata by category, tags, engagement counters, and publication status.
- **Connection**: Directed request between two profiles with status (pending/accepted/rejected/blocked) and timestamps.
- **Conversation/Message**: Conversations with participant membership; messages hold sender profile, content, read/delivery markers, and ordering metadata.
- **Event & Registration**: Event details (title, timing, location/virtual link, capacity, tags) and per-profile registration state with capacity enforcement.
- **Marketplace Listing**: Product/service listing with pricing, media references, tags, and seller profile linkage.
- **Notification**: Delivery record that references a triggering entity (connection, message, event, marketplace contact) and read status.
- **Search Index Entry**: Representations of posts/profiles/events/listings for discoverability with filters and relevance scores.
- **Migration Batch**: Imported dataset chunk with source identifiers, status, error logs, and retry pointers.
- **Recommendation Signal**: Aggregated interests, profile-question responses, engagement, and exclusions supporting feed ranking and connection suggestions.
- **In-App Notification Payload**: On-platform notification content with type, target profile, source entity, delivery/read status; no outbound email/SMS in Phase 1.
- **Storage Object Reference**: URL/key + metadata for uploaded files stored in object storage; includes type/size validation results.

### Assumptions

- Phase 1 backend services are delivered in the existing backend workspace at `apps/backend-node` without altering the directory structure.
- Public browsing covers read-only access to published items unless explicitly marked private by the author or system.
- Profile types include the existing set plus an internal staff member type; staff profiles obey the same auth model but may carry elevated moderation/operational permissions.
- Users may post as either their base profile or any specialized profile they own, subject to each profile's permissions.
- Recommendation inputs include profile-question responses already collected in the frontend plus declared interests and on-platform engagement.
- Repository layout under `smilefactory/` (apps/, specs/, .specify/, shared/, config/, deployment/, tools/, .github/, .codex/, mcp/, etc.) stays fixed; only additive files/configs in those locations.
- OTP delivery uses the contact channels already collected at signup (email and/or phone).
- Phase 1 delivers in-app notifications; outbound email/SMS for events or messaging may be deferred if not already provisioned.
- File storage location is available via managed object storage; URLs/keys are persisted, not the binary content itself.
- Staff profiles have no additional moderation/ops powers in Phase 1 beyond standard profile capabilities.
- Targeting for private posts uses profile-type + tag/interest criteria; eligibility logic must correctly enforce both dimensions.
- In-app notifications only for Phase 1; no outbound email/SMS sending. Optionally persist nothing for email; keep payloads in-app only.
- File storage uses the existing object storage service; enforce size/type validation before persisting references.
- Migration scope for Phase 1 is accounts + profiles only; broader content migration can be deferred.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of OTP login attempts either succeed or correctly block within 30 seconds end-to-end, with error messaging for failures.
- **SC-002**: 90% of feed queries (public or authenticated) return first byte in under 1 second for the first 20 items under normal load.
- **SC-003**: 90% of post submissions with valid data succeed without correction on the first attempt across all categories.
- **SC-004**: 95% of connection requests and messages are persisted and retrievable in order with correct unread counts within 2 seconds of submission.
- **SC-005**: Event registrations enforce capacity with 0 overbooking incidents in load testing scenarios at target scale.
- **SC-006**: Notifications for new messages and connection events are generated within 2 seconds of the triggering action in 95% of cases.
- **SC-007**: No more than 1% of search queries are rejected for abusive patterns while legitimate queries return results or a clear empty-state message.
- **SC-008**: Critical operations (auth, post create, message send, event registration) are rate limited with observable blocks when exceeding configured thresholds in test runs.
- **SC-009**: Connection suggestion refresh yields at least 5 relevant candidates for 90% of active profiles with completed questions/interests, excluding existing/blocked connections.
- **SC-010**: Private/targeted posts do not appear in feeds or searches for ineligible profiles in 100% of sampled test cases.
