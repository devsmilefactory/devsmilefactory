# Server Deployment Guide

## Prerequisites
- **Two** Ubuntu 22.04 LTS (or compatible) servers with sudo access
  - Frontend server handles `app.*` traffic
  - Backend server handles `api.*` traffic
- Docker Engine ≥ 24 and Docker Compose plugin ≥ 2.20 on both servers
- Firewall open on ports 80/443 (Traefik) and 22 (SSH)
- DNS records pointing to the appropriate servers (`app`, `traefik-app`, `api`, `traefik-api`)
- GitLab CI/CD variables populated (see `CICD_GUIDE.md`)

## One-Time Server Setup
Perform these steps on **both** servers (frontend + backend):
1. Install Docker & Compose:
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER
   newgrp docker
   ```
2. Create deployment directories:
   ```bash
   sudo mkdir -p /opt/smilefactory/staging/{frontend,backend}
   sudo mkdir -p /opt/smilefactory/production/{frontend,backend}
   sudo chown -R $USER:$USER /opt/smilefactory
   ```
3. Provision environment files:
   - Backend: copy `deployment/compose/backend/env.example` → `/opt/smilefactory/<env>/backend/.env`
   - Frontend: copy `deployment/compose/frontend/env.example` → `/opt/smilefactory/<env>/frontend/.env`
   - Populate secrets (Supabase, JWT, SendGrid, Traefik credentials, etc.)

## Deploying via GitLab CI
1. Trigger `deploy:staging-backend` and `deploy:staging-frontend` (manual) from the `develop` branch pipeline.
2. Each job uploads the appropriate compose/env template and executes:
   ```bash
   docker compose --env-file .env pull
   docker compose --env-file .env up -d --remove-orphans
   ```
3. Validate services on backend:
   ```bash
   docker compose ps
   curl -H "Host: api.example.com" http://localhost/health
   ```
   Validate frontend:
   ```bash
   docker compose ps
   curl -I -H "Host: app.example.com" http://localhost/
   ```
4. Promote to production by tagging the repository (`git tag v1.0.0 && git push origin v1.0.0`) and executing `deploy:production-backend` and `deploy:production-frontend`.

## Manual Deployment (fallback)
### Backend server
```bash
rsync -avz deployment/compose/backend/ user@backend:/opt/smilefactory/production/backend/
ssh user@backend '
  cd /opt/smilefactory/production/backend &&
  IMAGE_TAG=latest CONTAINER_REGISTRY=registry.gitlab.com/your-group/smilefactory \
    docker compose --env-file .env pull &&
  IMAGE_TAG=latest CONTAINER_REGISTRY=registry.gitlab.com/your-group/smilefactory \
    docker compose --env-file .env up -d --remove-orphans
'
```

### Frontend server
```bash
rsync -avz deployment/compose/frontend/ user@frontend:/opt/smilefactory/production/frontend/
ssh user@frontend '
  cd /opt/smilefactory/production/frontend &&
  IMAGE_TAG=latest CONTAINER_REGISTRY=registry.gitlab.com/your-group/smilefactory \
    docker compose --env-file .env pull &&
  IMAGE_TAG=latest CONTAINER_REGISTRY=registry.gitlab.com/your-group/smilefactory \
    docker compose --env-file .env up -d --remove-orphans
'
```

## Post-Deployment Checks
- Backend: `curl https://api.example.com/health`
- Frontend: `curl -I https://app.example.com`
- Inspect container logs with `docker compose logs --tail=50`
- Validate Let's Encrypt certificates via each Traefik dashboard

## Maintenance
- Rotate secrets periodically and update GitLab CI variables
- Update system packages monthly
- Use `deployment/scripts/rollback.sh <env> <role>` for quick restores

