# Rollback Procedure

## Overview
Rollbacks reuse previously published Docker images by re-running `docker compose` with a known-good tag. No code changes are required.

## Prerequisites
- GitLab CI/CD variables configured for SSH access (same as deploy flow)
- The desired image tag (`CI_COMMIT_SHA`, branch slug, or semantic tag)
- Access to the GitLab pipeline history to identify the target version

## Automated Rollback via CI
1. Navigate to the failed deployment pipeline and locate the relevant `deploy:<env>-<role>` stage (`role` = `backend` or `frontend`).
2. Trigger a rollback job (manual) or re-run deployment with the previous tag. Alternatively run:
   ```bash
   ./deployment/scripts/rollback.sh staging backend <tag>
   ./deployment/scripts/rollback.sh staging frontend <tag>
   ```
   through the GitLab Web Terminal (if enabled).
3. Supply the image tag from the previous successful pipeline (`CI_COMMIT_SHA` shown on the summary page).
4. Monitor the `smoke:<env>` job to verify the application recovered.

## Manual Rollback (server)
### Backend server
```bash
ssh user@backend-host
cd /opt/smilefactory/<env>/backend
IMAGE_TAG=<tag> CONTAINER_REGISTRY=registry.gitlab.com/your-group/smilefactory \
  docker compose --env-file .env pull
IMAGE_TAG=<tag> CONTAINER_REGISTRY=registry.gitlab.com/your-group/smilefactory \
  docker compose --env-file .env up -d --remove-orphans
```

### Frontend server
```bash
ssh user@frontend-host
cd /opt/smilefactory/<env>/frontend
IMAGE_TAG=<tag> CONTAINER_REGISTRY=registry.gitlab.com/your-group/smilefactory \
  docker compose --env-file .env pull
IMAGE_TAG=<tag> CONTAINER_REGISTRY=registry.gitlab.com/your-group/smilefactory \
  docker compose --env-file .env up -d --remove-orphans
```

## Selecting a Tag
- **Semantic release**: use the last known good `vX.Y.Z` tag.
- **Branch fallback**: use `develop` slug tag (`:develop`) for staging, `:main` for production.
- **Commit-specific**: use the 40-char `CI_COMMIT_SHA` for deterministic rollback.

## Post-Rollback Validation
- Confirm health endpoints (`/health`) return `status=ok`.
- Review service logs for errors.
- Update incident tracking with the root cause and next steps.

## Preventing Future Rollbacks
- Add regression tests that cover the issue.
- Enhance smoke tests to detect failures earlier.
- Consider implementing blue/green or canary deployments for safer rollouts.

