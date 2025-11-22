<!--
Sync Impact Report
Version change: 1.0.2 -> 1.0.3
Modified principles: none (expanded workflow detail, reaffirmed repo structure protection)
Added sections: Development Workflow expansion (stage-by-stage actors/tools)
Removed sections: none
Templates requiring updates: ✓ plan-template.md, spec-template.md, tasks-template.md already aligned with principles above
Follow-up TODOs: none
-->

# SmileFactory Phase 1 Constitution

## Core Principles

### I. Public-first discovery with explicit visibility controls
Content defaults to public read access to drive discovery, but private/targeted visibility must be enforced per item; anonymous users may browse but all content creation and interactions (post, comment, like, bookmark, message, register) require authentication.

### II. Profile-scoped accountability (base, specialized, staff)
All actions are bound to the active profile (base or specialized, including staff); profile selection is mandatory post-auth; row-level controls and attribution must reflect that profile, with staff able to operate only within approved moderation/ops permissions.

### III. Spec-first, independently testable slices
Every feature begins with Spec Kit user stories that are independently implementable and testable; stories must deliver standalone value, acceptance scenarios, and measurable outcomes before aggregation.

### IV. Safety, integrity, and privacy by default
Rate limiting, audit/event logging, and data isolation (public vs private/targeted) are mandatory; file upload validation, input abuse handling, and migration integrity checks are required in Phase 1.

### V. Orchestrated delivery with observable quality gates
Work is routed via the Orchestrator agent: low-risk items go IDE-first (Copilot/Cursor), complex work may run Codex in CI with MCPs; all paths require health endpoints, structured errors, and observable checks (tests, security when applicable) before merge.

## Phase 1 Architectural Constraints

- Backend lives in `apps/backend-node` (Node.js/NestJS target) with Supabase/PostgreSQL (RLS) and Redis for OTP/session/cache; file/object storage references are persisted, not binaries. Repository layout under `smilefactory/` (apps/, specs/, .specify/, shared/, config/, deployment/, tools/, .github/, .codex/, mcp/, etc.) must not be reorganized; only additive files/configs belong in their respective directories.
- Feed ranking must incorporate profile type and declared interests (profile questions in `apps/frontend/profile-questions`) while respecting visibility (public vs private/targeted audiences).
- Connection suggestions must use profile-question responses, interests, and interaction signals, excluding existing/blocked/irrelevant profiles.
- Private/targeted posts must never surface in feeds, search, or notifications for ineligible audiences.
- Multi-profile support (including staff) is mandatory for all auth, posting, and attribution flows.

## Development Workflow & Quality Gates

- Specs: Use Spec Kit (`specs/`) with prioritized, independently testable user stories; capture visibility rules, profile scope, and privacy constraints explicitly.
- Plans: `/speckit.plan` must pass a Constitution Check covering: public-read/auth-required actions; profile selection and RLS; visibility enforcement (private/targeted); rate limiting and audit logging; feed ranking inputs; connection suggestion inputs; `apps/backend-node` as backend location.
- Tasks: `/speckit.tasks` organizes work by user story; each story must be testable independently and include validation for visibility, RLS, and profile attribution where applicable.
- Execution routes: Orchestrator labels/decisions document whether work is IDE-first, hybrid, or agentic (CI Codex) exactly as specified in the workflow. Agentic runs must attach the relevant MCPs (GitHub, Postgres, Redis, Semgrep, Playwright/Chrome as needed) and respect the fixed repo layout. Copilot, Cursor, and Codex are available in both IDE and GitHub Actions; folder structure remains unchanged beyond additive files in designated directories.
- Workflow stages (do not alter repo structure): Stage 0 spec creation (PO/Tech Lead), Stage 1 routing/labeling (Orchestrator + labels), Stage 2 design/plan, Stage 3 implementation via IDE/hybrid/agentic paths, Stage 4 testing/QA (ci.yml baseline; optional ai-security, ai-e2e), Stage 5 review/merge (ai-review, ai-orchestrator), Stage 6 release/post-merge. Orchestrator operates exactly per defined workflow while preserving existing layout under `apps/`, `specs/`, `.specify/`, `shared/`, `config/`, `deployment/`, `tools/`, `.github/`, `.codex/`, `mcp/`.
- Reviews/merges: PRs must evidence adherence to principles (public-read vs private enforcement, profile attribution, rate limits/logs); health/status endpoints and structured errors are required for backend changes; private content leakage is a release blocker.

## Governance

The Constitution supersedes local preferences. Amendments require documenting rationale, updating version and dates below, and ensuring plan/spec/task templates stay in sync. Versioning: MAJOR for breaking/removing principles; MINOR for new principles/sections; PATCH for clarifications. Ratification is the initial adoption date; Last Amended updates on every change. All PRs and plans must confirm Constitution compliance at review/merge time.

**Version**: 1.0.3 | **Ratified**: 2025-11-20 | **Last Amended**: 2025-11-20
