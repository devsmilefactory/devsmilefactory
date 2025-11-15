# GitLab Repository Setup

## Repository Initialization
1. Create a new GitLab project (or import existing repository).
2. Push the codebase:
   ```bash
   git remote add origin git@gitlab.com:your-group/smilefactory.git
   git push -u origin main
   ```

## Branch Protection
Navigate to **Settings → Repository → Protected Branches** and configure:
- `main`: Allow merge via Merge Request only, require approval (min 1 reviewer), disallow force pushes.
- `develop`: Allow merges via MR, allow developers/maintainers to push, disallow force pushes.
- `feature/*`: No protection (created locally), but enforce MR pipelines via project settings.

Enable **Merge checks**:
- Require successful pipeline
- Prevent merge unless all discussions are resolved

## GitLab Container Registry
1. Under **Settings → General → Visibility**, ensure Container Registry is enabled.
2. Optionally set cleanup policies (keep last 10 tags per image, keep tags matching `v*`).
3. Use `${CI_REGISTRY_IMAGE}` in `.gitlab-ci.yml` (already configured).

## Runners
- Use shared runners with Docker-in-Docker support or register a project runner.
- Minimum job permissions: allow `docker` commands (privileged runner or dinD service).

## CI/CD Variables
Store secrets under **Settings → CI/CD → Variables** (mark as **masked** and **protected** where appropriate):
- `DEPLOY_SSH_PRIVATE_KEY`
- Backend staging: `DEPLOY_BACKEND_STAGING_HOST`, `DEPLOY_BACKEND_STAGING_USER`, `DEPLOY_BACKEND_STAGING_PATH`, `DEPLOY_BACKEND_STAGING_ENV_FILE`
- Frontend staging: `DEPLOY_FRONTEND_STAGING_HOST`, `DEPLOY_FRONTEND_STAGING_USER`, `DEPLOY_FRONTEND_STAGING_PATH`, `DEPLOY_FRONTEND_STAGING_ENV_FILE`
- Backend production: `DEPLOY_BACKEND_PRODUCTION_HOST`, `DEPLOY_BACKEND_PRODUCTION_USER`, `DEPLOY_BACKEND_PRODUCTION_PATH`, `DEPLOY_BACKEND_PRODUCTION_ENV_FILE`
- Frontend production: `DEPLOY_FRONTEND_PRODUCTION_HOST`, `DEPLOY_FRONTEND_PRODUCTION_USER`, `DEPLOY_FRONTEND_PRODUCTION_PATH`, `DEPLOY_FRONTEND_PRODUCTION_ENV_FILE`
- Domain variables: `APP_DOMAIN_STAGING`, `APP_DOMAIN_PRODUCTION`, `API_DOMAIN_STAGING`, `API_DOMAIN_PRODUCTION`
- Application secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `JWT_SECRET`, `SENDGRID_API_KEY`
- Optional: `SMOKE_BASE_URL_STAGING`, `SMOKE_BASE_URL_PRODUCTION`

Scope staging-only values to the **staging** environment; mark production secrets as **protected**.

## Integrations (optional)
- Slack notifications: Settings → Integrations → Slack Notifications
- Issue tracker automation: Connect to Linear/Jira for status updates
- SAST/Dependency scanning: enable GitLab Security features by including their templates in `.gitlab-ci.yml`

