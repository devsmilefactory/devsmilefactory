# CI/CD Guide

## Branching Strategy
- `main`: production releases (protected, requires MR + approval)
- `develop`: staging integration (protected, fast-forward from feature branches)
- `feature/*`: short-lived branches merged via MR into `develop`

## Pipeline Stages
1. **lint**  
   - `lint:frontend`, `lint:backend` ensure code style consistency.
2. **test**  
   - `test:backend` runs Jest suites for all Nest workspaces.
3. **build**  
   - `build:frontend`: Vite production build.  
   - `build:backend`: Compiles Nest dist output.
4. **docker**  
   - `docker:build`: Produces four images (frontend + three services) tagged with SHA and branch slug.
5. **deploy**  
   - `deploy:staging-backend` / `deploy:staging-frontend`: Manual jobs on `develop`.  
   - `deploy:production-backend` / `deploy:production-frontend`: Manual jobs on semantic tags (`v*`).
6. **verify**  
   - `smoke:staging` / `smoke:production`: Optional post-deploy health checks.

## Key Variables (GitLab CI/CD Settings)
- `CI_REGISTRY_USER` / `CI_REGISTRY_PASSWORD`: Provided by GitLab.
- `DEPLOY_SSH_PRIVATE_KEY`: Base64/PEM private key for SSH.
- Backend targets: `DEPLOY_BACKEND_STAGING_HOST`, `DEPLOY_BACKEND_STAGING_USER`, `DEPLOY_BACKEND_STAGING_PATH`, `DEPLOY_BACKEND_STAGING_ENV_FILE`
- Frontend targets: `DEPLOY_FRONTEND_STAGING_HOST`, `DEPLOY_FRONTEND_STAGING_USER`, `DEPLOY_FRONTEND_STAGING_PATH`, `DEPLOY_FRONTEND_STAGING_ENV_FILE`
- Production counterparts (`DEPLOY_BACKEND_PRODUCTION_*`, `DEPLOY_FRONTEND_PRODUCTION_*`)
- `APP_DOMAIN_STAGING`, `API_DOMAIN_STAGING`, `APP_DOMAIN_PRODUCTION`, `API_DOMAIN_PRODUCTION`
- `SMOKE_BASE_URL_STAGING`, `SMOKE_BASE_URL_PRODUCTION` (or rely on domain vars)
- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `JWT_SECRET`, `SENDGRID_API_KEY`, etc.

Mark secrets as **Protected** and **Masked**. Scope staging-only keys to the staging environment.

## Docker Layer Caching
- The `docker:build` job uses dind; enable GitLab runner cache to speed up builds.
- Consider configuring a [GitLab shared runner cache volume](https://docs.gitlab.com/runner/configuration/docker.html#use-docker-in-docker) for more aggressive reuse.

## Approvals & Quality Gates
- Require successful pipeline status before merging.
- Enable code owner approvals for sensitive folders (`backend/services/*`, `.gitlab-ci.yml`).
- (Optional) Integrate SAST/Dependency Scanning templates provided by GitLab.

## Release Flow
1. Developers merge feature branches → `develop`
2. QA validates staging
3. Tag release from `main` (`git checkout main && git merge --ff-only develop && git tag vX.Y.Z`)
4. `deploy:production-*` jobs use the tag SHA across both servers; smoke tests verify rollout

## Rollbacks
- Trigger `deployment/scripts/rollback.sh production backend <image-tag>` and/or `... frontend ...`
- Alternatively, re-run the previous successful `deploy:production-*` pipeline with the same tag

