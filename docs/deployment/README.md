# SmileFactory Deployment Overview

## Architecture
- React + Vite frontend served via Nginx container on a **dedicated frontend server**
- NestJS microservices (`api-gateway`, `auth-service`, `user-service`) and Redis on a **dedicated backend server**
- Traefik reverse proxy on each server to terminate TLS and expose dashboards
- GitLab Container Registry for images and GitLab CI/CD for automation

## Environments
- **Local**: Docker Compose (`backend/docker-compose.yml`) or native Node tooling for rapid iteration
- **Staging**: Two VMs (frontend + backend) running dedicated compose stacks, TLS via Let's Encrypt, manual approval deploys from `develop`
- **Production**: Hardened VMs (frontend + backend) using the same compose stacks, releases via semver tags

## Pipelines
1. Lint (`eslint`) → Test (`jest`) → Build (Vite + Nest)  
2. Container builds pushed to the GitLab registry (tagged by SHA and branch)  
3. Manual deploy jobs run `deployment/scripts/deploy.sh` for frontend/backend targets per environment  
4. Optional smoke tests hit health endpoints post deploy

## Deployment Assets
- `.gitlab-ci.yml`: GitLab pipeline definition
- `/Dockerfile`: Multi-stage frontend build
- `/backend/services/*/Dockerfile`: Multi-stage service builds
- `/deployment/compose/backend/docker-compose.yml`: Backend server stack
- `/deployment/compose/frontend/docker-compose.yml`: Frontend server stack
- `/deployment/scripts/*.sh`: Automation for deploy, rollback, smoke tests
- `/docs/deployment/*.md`: Playbooks and references

Use the companion guides in this folder for detailed steps per scenario.

