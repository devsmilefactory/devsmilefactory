# SmileFactory Deployment Guide

Complete step-by-step guide for deploying SmileFactory to production servers.

## Pre-Deployment Checklist

- [ ] All servers are set up and configured (see [Server Setup Guide](server-setup.md))
- [ ] Docker and Docker Compose installed on all servers
- [ ] Git repository cloned on all servers
- [ ] Environment variables configured
- [ ] SSL certificates obtained (for production)
- [ ] Database servers are running and accessible
- [ ] Firewall rules configured
- [ ] Backup strategy in place

## Deployment Steps

### Step 1: Prepare Environment

#### On All Servers

```bash
# Navigate to deployment directory
cd /smilefactory/devsmilefactory

# Pull latest code
git pull origin main

# Verify environment files exist
ls -la .env
ls -la apps/frontend/.env
ls -la apps/backend-node/.env
ls -la apps/backend-java/.env
```

### Step 2: Build Docker Images

#### On Backend Node Server

```bash
# Build backend-node image
docker build -f deployment/Dockerfile.backend-node \
  -t smilefactory-backend-node:latest \
  apps/backend-node

# Verify image
docker images | grep smilefactory-backend-node
```

#### On Backend Java Server

```bash
# Build backend-java image
docker build -f deployment/Dockerfile.backend-java \
  -t smilefactory-backend-java:latest \
  apps/backend-java

# Verify image
docker images | grep smilefactory-backend-java
```

#### On Frontend Server

```bash
# Build frontend image
docker build -f deployment/Dockerfile.frontend \
  -t smilefactory-frontend:latest \
  apps/frontend

# Verify image
docker images | grep smilefactory-frontend
```

### Step 3: Deploy Backend Services

#### Deploy Backend Node

```bash
# On Backend Node Server
cd /smilefactory/devsmilefactory

# Create Docker network
docker network create smilefactory-network 2>/dev/null || true

# Stop existing containers
docker-compose -f deployment/compose/backend/docker-compose.yml down backend-node

# Start backend-node service
docker-compose -f deployment/compose/backend/docker-compose.yml up -d backend-node

# Check logs
docker logs -f smilefactory-backend-node
```

#### Deploy Backend Java

```bash
# On Backend Java Server
cd /smilefactory/devsmilefactory

# Create Docker network
docker network create smilefactory-network 2>/dev/null || true

# Stop existing containers
docker-compose -f deployment/compose/backend/docker-compose.yml down backend-java

# Start backend-java service
docker-compose -f deployment/compose/backend/docker-compose.yml up -d backend-java

# Check logs
docker logs -f smilefactory-backend-java
```

#### Verify Backend Services

```bash
# Check backend-node health
curl http://backend-node-server:3000/health

# Check backend-java health
curl http://backend-java-server:8080/actuator/health

# Check container status
docker ps | grep smilefactory-backend
```

### Step 4: Deploy Frontend

```bash
# On Frontend Server
cd /smilefactory/devsmilefactory

# Create Docker network
docker network create smilefactory-network 2>/dev/null || true

# Stop existing containers
docker-compose -f deployment/compose/frontend/docker-compose.yml down

# Start frontend service
docker-compose -f deployment/compose/frontend/docker-compose.yml up -d

# Check logs
docker logs -f smilefactory-frontend
```

### Step 5: Verify Deployment

#### Run Health Checks

```bash
# On Frontend Server
bash deployment/scripts/health-check.sh
```

#### Manual Verification

```bash
# Test frontend
curl http://frontend-server/

# Test backend-node API
curl http://backend-node-server:3000/health

# Test backend-java API
curl http://backend-java-server:8080/actuator/health
```

#### Browser Testing

1. Open browser and navigate to `http://your-domain.com`
2. Verify frontend loads correctly
3. Test user authentication
4. Verify API calls work
5. Check browser console for errors

### Step 6: Monitor Services

```bash
# Check all containers
docker ps

# Monitor logs
docker logs -f smilefactory-frontend
docker logs -f smilefactory-backend-node
docker logs -f smilefactory-backend-java

# Check resource usage
docker stats
```

## Automated Deployment

### Using Deployment Scripts

#### Deploy All Services

```bash
# From any server with access to all servers
cd /smilefactory/devsmilefactory
npm run deploy:all
```

#### Deploy Individual Services

```bash
# Deploy backend only
npm run deploy:backend

# Deploy frontend only
npm run deploy:frontend
```

### CI/CD Pipeline

For automated deployments, configure your CI/CD pipeline (GitLab CI, GitHub Actions, etc.):

```yaml
# Example .gitlab-ci.yml
stages:
  - build
  - deploy

build:
  stage: build
  script:
    - docker build -f deployment/Dockerfile.frontend -t smilefactory-frontend:$CI_COMMIT_SHA apps/frontend
    - docker build -f deployment/Dockerfile.backend-node -t smilefactory-backend-node:$CI_COMMIT_SHA apps/backend-node
    - docker build -f deployment/Dockerfile.backend-java -t smilefactory-backend-java:$CI_COMMIT_SHA apps/backend-java

deploy:
  stage: deploy
  script:
    - ssh user@frontend-server "cd /smilefactory/devsmilefactory && git pull && npm run deploy:frontend"
    - ssh user@backend-server "cd /smilefactory/devsmilefactory && git pull && npm run deploy:backend"
  only:
    - main
```

## Rollback Procedure

If deployment fails or issues are detected:

### Quick Rollback

```bash
# On each server, revert to previous image
docker-compose -f deployment/compose/backend/docker-compose.yml down
docker tag smilefactory-backend-node:previous smilefactory-backend-node:latest
docker-compose -f deployment/compose/backend/docker-compose.yml up -d
```

### Full Rollback

```bash
# Revert to previous git commit
git log --oneline -n 5
git checkout <previous-commit-hash>

# Rebuild and redeploy
npm run docker:build
npm run deploy:all
```

## Zero-Downtime Deployment

For production environments requiring zero downtime:

### Blue-Green Deployment

1. Deploy new version to "green" environment
2. Test green environment
3. Switch traffic from "blue" to "green"
4. Keep blue environment as backup

### Rolling Updates

```bash
# Update one instance at a time
docker-compose -f deployment/compose/backend/docker-compose.yml up -d --no-deps --scale backend-node=2 backend-node
```

## Post-Deployment Tasks

### 1. Verify All Services

```bash
# Run comprehensive health check
npm run health-check

# Check logs for errors
docker-compose -f deployment/compose/backend/docker-compose.yml logs --tail=100
docker-compose -f deployment/compose/frontend/docker-compose.yml logs --tail=100
```

### 2. Update Documentation

- Document any configuration changes
- Update deployment notes
- Record deployment timestamp and version

### 3. Notify Team

- Send deployment notification
- Share deployment notes
- Provide rollback instructions if needed

### 4. Monitor Performance

- Check application metrics
- Monitor error rates
- Verify response times
- Check resource usage

## Troubleshooting

### Deployment Fails

```bash
# Check Docker daemon
sudo systemctl status docker

# Check disk space
df -h

# Check logs
docker logs <container-name>

# Rebuild without cache
docker build --no-cache -f deployment/Dockerfile.frontend apps/frontend
```

### Service Won't Start

```bash
# Check environment variables
docker exec <container-name> env

# Check network connectivity
docker network inspect smilefactory-network

# Restart service
docker-compose -f deployment/compose/backend/docker-compose.yml restart backend-node
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Check container logs
docker logs --tail=1000 <container-name>

# Increase container resources
# Edit docker-compose.yml and add:
# resources:
#   limits:
#     cpus: '2'
#     memory: 4G
```

### Database Connection Issues

```bash
# Test database connectivity
docker exec smilefactory-backend-node ping database-server

# Check database credentials
docker exec smilefactory-backend-node env | grep DATABASE

# Restart database connection
docker-compose -f deployment/compose/backend/docker-compose.yml restart
```

## Maintenance Windows

### Scheduled Maintenance

1. **Notify users** of maintenance window
2. **Create backup** of current state
3. **Deploy updates** during low-traffic period
4. **Verify deployment** thoroughly
5. **Monitor closely** after deployment

### Emergency Maintenance

1. **Assess severity** of issue
2. **Notify stakeholders** immediately
3. **Deploy hotfix** or rollback
4. **Verify fix** works
5. **Post-mortem** analysis

## Security Considerations

### Before Deployment

- [ ] Scan Docker images for vulnerabilities
- [ ] Verify no secrets in code
- [ ] Check environment variables are set
- [ ] Ensure SSL certificates are valid
- [ ] Review firewall rules

### After Deployment

- [ ] Verify HTTPS is working
- [ ] Test authentication flows
- [ ] Check API rate limiting
- [ ] Review access logs
- [ ] Monitor for suspicious activity

## Performance Optimization

### After Initial Deployment

1. **Enable caching** in Nginx
2. **Optimize Docker images** (multi-stage builds)
3. **Configure CDN** for static assets
4. **Enable compression** (gzip)
5. **Monitor and tune** based on metrics

## Backup and Recovery

### Pre-Deployment Backup

```bash
# Backup current containers
docker commit smilefactory-frontend smilefactory-frontend:backup
docker commit smilefactory-backend-node smilefactory-backend-node:backup
docker commit smilefactory-backend-java smilefactory-backend-java:backup

# Backup environment files
tar -czf /smilefactory/backups/env-$(date +%Y%m%d).tar.gz \
  /smilefactory/devsmilefactory/.env \
  /smilefactory/devsmilefactory/apps/*/.env
```

### Recovery

```bash
# Restore from backup
docker tag smilefactory-frontend:backup smilefactory-frontend:latest
docker-compose -f deployment/compose/frontend/docker-compose.yml up -d
```

## Support and Resources

- **Documentation**: `/docs` directory
- **Architecture**: [architecture.md](architecture.md)
- **Server Setup**: [server-setup.md](server-setup.md)
- **Repository**: https://github.com/devsmilefactory/devsmilefactory.git

For issues or questions, contact the DevOps team.
