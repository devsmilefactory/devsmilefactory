# SmileFactory Deployment Architecture

## Overview

SmileFactory is deployed as a microservices architecture using Docker containers, with separate servers for frontend and backend services. All services are deployed to the `/smilefactory` base path and communicate through a shared Docker network.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Internet                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   Nginx (Port 80)    │
              │   Frontend Server    │
              └──────────┬───────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌────────────────┐ ┌────────────┐ ┌────────────┐
│   React SPA    │ │  API Proxy │ │  API Proxy │
│   Static Files │ │  /api/*    │ │ /java-api/*│
└────────────────┘ └──────┬─────┘ └──────┬─────┘
                          │               │
                          ▼               ▼
              ┌──────────────────┐ ┌──────────────┐
              │  Backend Node    │ │ Backend Java │
              │  (Port 3000)     │ │ (Port 8080)  │
              │  Backend Server  │ │ Backend Srv  │
              └────────┬─────────┘ └──────┬───────┘
                       │                   │
                       └─────────┬─────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Docker Network        │
                    │  smilefactory-network   │
                    └─────────────────────────┘
```

## Server Separation

### Frontend Server
- **Purpose**: Serves the React application and acts as reverse proxy
- **Components**:
  - Nginx web server
  - React SPA (built static files)
  - API proxy to backend services
- **Port**: 80 (HTTP), 443 (HTTPS in production)
- **Container**: `smilefactory-frontend`

### Backend Node Server
- **Purpose**: Runs Node.js microservices
- **Components**:
  - API Gateway
  - Authentication Service
  - User Service
  - Other microservices
- **Port**: 3000
- **Container**: `smilefactory-backend-node`

### Backend Java Server
- **Purpose**: Runs Java backend services
- **Components**:
  - Spring Boot application
  - Business logic services
  - Data processing
- **Port**: 8080
- **Container**: `smilefactory-backend-java`

## Deployment Path

All services are deployed to the `/smilefactory` base directory:

```
/smilefactory/
├─ backend-node/
│   ├─ logs/
│   └─ data/
└─ backend-java/
    ├─ logs/
    └─ data/
```

## Docker Network

Services communicate through a dedicated Docker bridge network:

- **Network Name**: `smilefactory-network`
- **Driver**: bridge
- **Purpose**: Enables inter-service communication using container names as hostnames

## Health Checks

Each service implements health check endpoints:

- **Frontend**: `GET /health` → Returns 200 OK
- **Backend Node**: `GET /health` → Returns service status
- **Backend Java**: `GET /actuator/health` → Returns Spring Boot health status

Health checks run every 30 seconds with:
- Timeout: 10 seconds
- Retries: 3
- Start period: 20-60 seconds (varies by service)

## Data Persistence

Volumes are mounted for persistent data:

- **Backend Node Logs**: `/smilefactory/backend-node/logs`
- **Backend Java Logs**: `/smilefactory/backend-java/logs`

## Security Considerations

### Network Isolation
- Services communicate only through the Docker network
- External access is controlled through Nginx proxy

### Environment Variables
- Sensitive configuration stored in `.env` files
- Never committed to version control
- Injected at container runtime

### HTTPS/TLS
- Nginx configured for SSL/TLS termination
- Certificates managed separately
- HTTP to HTTPS redirect in production

## Scaling Strategy

### Horizontal Scaling
- Multiple instances of backend services can be deployed
- Load balancing through Nginx upstream configuration
- Stateless service design enables easy scaling

### Vertical Scaling
- Container resource limits can be adjusted
- Memory and CPU allocation per service
- Configured in docker-compose files

## Monitoring and Logging

### Logs
- Container logs accessible via `docker logs`
- Persistent logs stored in mounted volumes
- Centralized logging recommended for production

### Monitoring
- Health check endpoints for service status
- Container metrics via Docker stats
- Application-level metrics via service endpoints

## Deployment Workflow

1. **Build Phase**
   - Build Docker images for each service
   - Tag with version/commit hash
   - Push to container registry (optional)

2. **Deploy Phase**
   - Pull latest images
   - Stop existing containers
   - Start new containers
   - Run health checks

3. **Verification Phase**
   - Check service health endpoints
   - Verify inter-service connectivity
   - Monitor logs for errors

## Rollback Strategy

In case of deployment failure:

1. Stop failed containers
2. Revert to previous image version
3. Restart containers with previous version
4. Verify health checks pass
5. Investigate failure cause

## Production Considerations

### High Availability
- Deploy multiple instances of each service
- Use container orchestration (Kubernetes, Docker Swarm)
- Implement load balancing

### Backup and Recovery
- Regular database backups
- Configuration backups
- Disaster recovery plan

### Performance Optimization
- Enable Nginx caching
- Optimize Docker image sizes
- Use multi-stage builds
- Implement CDN for static assets

### Security Hardening
- Use non-root users in containers
- Scan images for vulnerabilities
- Implement rate limiting
- Enable HTTPS only
- Regular security updates
