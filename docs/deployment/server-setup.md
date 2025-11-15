# Server Setup Guide

This guide walks through setting up servers for SmileFactory deployment.

## Prerequisites

### System Requirements

**Frontend Server:**
- OS: Ubuntu 20.04+ or similar Linux distribution
- RAM: 2GB minimum, 4GB recommended
- CPU: 2 cores minimum
- Disk: 20GB minimum
- Docker: 20.10+
- Docker Compose: 2.0+

**Backend Node Server:**
- OS: Ubuntu 20.04+ or similar Linux distribution
- RAM: 4GB minimum, 8GB recommended
- CPU: 4 cores minimum
- Disk: 50GB minimum
- Docker: 20.10+
- Docker Compose: 2.0+

**Backend Java Server:**
- OS: Ubuntu 20.04+ or similar Linux distribution
- RAM: 4GB minimum, 8GB recommended
- CPU: 4 cores minimum
- Disk: 50GB minimum
- Docker: 20.10+
- Docker Compose: 2.0+

## Initial Server Setup

### 1. Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Start Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Verify installation
docker --version
```

### 3. Install Docker Compose

```bash
# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### 4. Create Deployment Directory

```bash
# Create base directory
sudo mkdir -p /smilefactory
sudo chown $USER:$USER /smilefactory

# Create subdirectories
mkdir -p /smilefactory/backend-node/logs
mkdir -p /smilefactory/backend-java/logs
```

### 5. Configure Firewall

```bash
# Install UFW if not present
sudo apt install ufw -y

# Allow SSH
sudo ufw allow 22/tcp

# Frontend Server - Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Backend Node Server - Allow API port
sudo ufw allow 3000/tcp

# Backend Java Server - Allow API port
sudo ufw allow 8080/tcp

# Enable firewall
sudo ufw enable
```

## Frontend Server Setup

### 1. Clone Repository

```bash
cd /smilefactory
git clone https://github.com/devsmilefactory/devsmilefactory.git
cd devsmilefactory
```

### 2. Configure Environment Variables

```bash
# Copy environment template
cp .env.example .env
cp apps/frontend/.env.example apps/frontend/.env

# Edit environment variables
nano .env
nano apps/frontend/.env
```

Required variables:
```env
VITE_API_URL=http://backend-node-server:3000
VITE_BACKEND_URL=http://backend-node-server:3000
```

### 3. Create Docker Network

```bash
docker network create smilefactory-network
```

### 4. Deploy Frontend

```bash
# Build and start frontend
npm run deploy:frontend

# Or manually
docker-compose -f deployment/compose/frontend/docker-compose.yml up -d
```

### 5. Verify Deployment

```bash
# Check container status
docker ps | grep smilefactory-frontend

# Check logs
docker logs smilefactory-frontend

# Test health endpoint
curl http://localhost/health
```

## Backend Node Server Setup

### 1. Clone Repository

```bash
cd /smilefactory
git clone https://github.com/devsmilefactory/devsmilefactory.git
cd devsmilefactory
```

### 2. Configure Environment Variables

```bash
# Copy environment template
cp .env.example .env
cp apps/backend-node/.env.example apps/backend-node/.env

# Edit environment variables
nano apps/backend-node/.env
```

Required variables:
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@db-server:5432/smilefactory
JWT_SECRET=your-secure-jwt-secret-here
API_KEY=your-api-key-here
```

### 3. Create Docker Network

```bash
docker network create smilefactory-network
```

### 4. Deploy Backend Node

```bash
# Build and start backend
npm run deploy:backend

# Or manually
docker-compose -f deployment/compose/backend/docker-compose.yml up -d
```

### 5. Verify Deployment

```bash
# Check container status
docker ps | grep smilefactory-backend-node

# Check logs
docker logs smilefactory-backend-node

# Test health endpoint
curl http://localhost:3000/health
```

## Backend Java Server Setup

### 1. Clone Repository

```bash
cd /smilefactory
git clone https://github.com/devsmilefactory/devsmilefactory.git
cd devsmilefactory
```

### 2. Configure Environment Variables

```bash
# Copy environment template
cp .env.example .env
cp apps/backend-java/.env.example apps/backend-java/.env

# Edit environment variables
nano apps/backend-java/.env
```

Required variables:
```env
SPRING_PROFILES_ACTIVE=production
DATABASE_URL=postgresql://user:password@db-server:5432/smilefactory
JWT_SECRET=your-secure-jwt-secret-here
```

### 3. Join Docker Network

```bash
# Connect to existing network (if on same host)
# Or create network (if on separate host)
docker network create smilefactory-network
```

### 4. Deploy Backend Java

```bash
# Build and start backend
docker-compose -f deployment/compose/backend/docker-compose.yml up -d backend-java

# Or build manually
docker build -f deployment/Dockerfile.backend-java -t smilefactory-backend-java:latest apps/backend-java
docker run -d --name smilefactory-backend-java \
  --network smilefactory-network \
  -p 8080:8080 \
  --env-file apps/backend-java/.env \
  smilefactory-backend-java:latest
```

### 5. Verify Deployment

```bash
# Check container status
docker ps | grep smilefactory-backend-java

# Check logs
docker logs smilefactory-backend-java

# Test health endpoint
curl http://localhost:8080/actuator/health
```

## SSL/TLS Configuration (Production)

### 1. Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Obtain SSL Certificate

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 3. Update Nginx Configuration

Edit `deployment/nginx/nginx.conf` to enable SSL configuration block.

### 4. Rebuild Frontend Container

```bash
docker-compose -f deployment/compose/frontend/docker-compose.yml down
docker-compose -f deployment/compose/frontend/docker-compose.yml up -d --build
```

## Monitoring Setup

### 1. Install Monitoring Tools

```bash
# Install htop for system monitoring
sudo apt install htop -y

# Install Docker stats
docker stats
```

### 2. Set Up Log Rotation

```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/smilefactory
```

Add:
```
/smilefactory/*/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 $USER $USER
    sharedscripts
}
```

## Backup Configuration

### 1. Create Backup Script

```bash
nano /smilefactory/backup.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR="/smilefactory/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup environment files
tar -czf $BACKUP_DIR/env_$DATE.tar.gz \
  /smilefactory/devsmilefactory/.env \
  /smilefactory/devsmilefactory/apps/*/.env

# Backup logs
tar -czf $BACKUP_DIR/logs_$DATE.tar.gz \
  /smilefactory/backend-node/logs \
  /smilefactory/backend-java/logs

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

### 2. Schedule Backups

```bash
# Make script executable
chmod +x /smilefactory/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
```

Add:
```
0 2 * * * /smilefactory/backup.sh
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs <container-name>

# Check Docker daemon
sudo systemctl status docker

# Restart Docker
sudo systemctl restart docker
```

### Port Already in Use

```bash
# Find process using port
sudo lsof -i :80
sudo lsof -i :3000
sudo lsof -i :8080

# Kill process
sudo kill -9 <PID>
```

### Network Issues

```bash
# List networks
docker network ls

# Inspect network
docker network inspect smilefactory-network

# Recreate network
docker network rm smilefactory-network
docker network create smilefactory-network
```

### Disk Space Issues

```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a

# Remove old images
docker image prune -a
```

## Security Hardening

### 1. Disable Root Login

```bash
sudo nano /etc/ssh/sshd_config
```

Set:
```
PermitRootLogin no
```

### 2. Set Up Fail2Ban

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Enable Automatic Security Updates

```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

### 4. Configure Docker Security

```bash
# Run containers as non-root user
# Add to Dockerfiles:
USER node  # or appropriate user
```

## Maintenance

### Regular Updates

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Update Docker images
cd /smilefactory/devsmilefactory
git pull
npm run docker:build
npm run deploy:all
```

### Health Checks

```bash
# Run health check script
npm run health-check

# Or manually
curl http://localhost/health
curl http://localhost:3000/health
curl http://localhost:8080/actuator/health
```
