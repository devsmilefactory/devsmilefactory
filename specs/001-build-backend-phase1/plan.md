# Implementation Plan: Phase 1 Backend Foundation

**Branch**: `001-build-backend-phase1` | **Date**: 2025-11-20 | **Spec**: specs/001-build-backend-phase1/spec.md  
**Input**: Feature specification from `/specs/001-build-backend-phase1/spec.md`

## Summary

Deliver Phase 1 backend in `apps/backend-node` with public-read discovery and authenticated interactions. Implement OTP auth with profile selection (base/specialized/staff), RLS-backed access, public vs private/targeted visibility for posts, feed ranking by profile/interests, connection suggestions from profile questions, messaging, events, marketplace, notifications, rate limiting, audit logging, file upload validation, and health/error instrumentation. Use Supabase/PostgreSQL + Redis; enforce visibility and profile attribution on every endpoint; keep repo structure unchanged (additive only).

## Technical Context

**Language/Version**: Node.js 18+ (TypeScript)  
**Primary Dependencies**: NestJS, Supabase/PostgreSQL client, Redis client, JWT/OTP libs, file upload adapter (object storage), rate limiting middleware, Zod/class-validator  
**Storage**: Supabase/PostgreSQL (RLS), Redis (OTP/session/cache), object storage for media references  
**Testing**: Jest + Supertest for backend unit/integration; contract/e2e via Chrome DevTools MCP pipeline when triggered  
**Target Platform**: Linux containers (CI/CD + deployment)  
**Project Type**: Web backend services (API gateway + services) in monorepo  
**Performance Goals**: 90% of feed queries < 1s first byte for first 20 items; OTP flow completes/blocks within 30s; messaging/connection persistence within 2s; zero overbooking for events in tests  
**Constraints**: Enforce public vs private/targeted visibility (profile-type + tags/interests eligibility), RLS per profile, rate limiting on auth/messaging/feed, structured errors + health endpoints, in-app notifications only (no outbound email/SMS), Supabase storage for files with validation, repo layout unchanged (additive only)  
**Scale/Scope**: Phase 1 MVP covering auth, feed/posts, connections, messaging, events, marketplace, search, notifications, migrations

## Constitution Check

- Public-read discovery allowed; all mutations/interactions require authentication.  
- Profile selection required post-auth; all actions attributed to active profile (base/specialized/staff) with RLS.  
- Visibility enforcement: private/targeted items must never surface to ineligible viewers (feed/search/notifications).  
- Rate limiting and audit/event logging on auth, messaging, feed, and mutations.  
- Feed ranking incorporates profile type/interests (profile questions + declared interests/tags) while honoring visibility.  
- Connection suggestions use profile-question signals plus declared interests/tags and exclude existing/blocked/irrelevant profiles.  
- Backend in `apps/backend-node`; repo structure fixed (only additive files/configs in existing directories).  
- Health/status endpoints and structured error responses required.  
- File uploads validated for size/type; store references in Supabase storage, not binaries.  
- Migration endpoints/jobs must include integrity checks and retries, scoped to accounts + profiles for Phase 1.

## Project Structure

### Documentation (this feature)

```text
specs/001-build-backend-phase1/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
apps/
├── backend-node/
│   ├── src/
│   │   ├── modules/            # auth, profiles, feed, messaging, connections, events, marketplace, search, notifications, migrations
│   │   ├── common/             # rate limiting, logging, filters, guards, interceptors
│   │   ├── config/             # env, Supabase/Postgres, Redis, storage config
│   │   ├── dto/                # request/response schemas with validation
│   │   └── main.ts             # bootstrap/gateway
│   └── test/                   # unit/integration (Jest/Supertest)
├── frontend/                   # existing web app (read-only for this plan)
└── shared/                     # shared libs if needed

specs/001-build-backend-phase1/ # design docs for this feature
.github/workflows/              # ci.yml, ai-*.yml orchestrator/review/security/e2e/executor
.codex/                         # MCP configs for executor/review/security/test
mcp/                            # MCP servers (sequential, github, postgres, redis, semgrep, chrome-devtools, context7)
deployment/                     # Docker/infra scripts
config/                         # repo-level config
tools/                          # local dev scripts
```

**Structure Decision**: Work lives in `apps/backend-node` with supporting configs under `.github/`, `.codex/`, `mcp/`, `deployment/`, `config/`; no reorganization, only additive changes.

## Complexity Tracking

No constitution violations anticipated; if new structure or principles are impacted, document justification here.
