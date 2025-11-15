#!/bin/bash
set -e

echo "========================================="
echo "Deploying SmileFactory Backend Services"
echo "========================================="

# Navigate to deployment directory
cd "$(dirname "$0")/.."

# Create Docker network if it doesn't exist
echo "Creating Docker network..."
docker network create smilefactory-network 2>/dev/null || echo "Network already exists"

# Build backend Docker images
echo "Building backend-node Docker image..."
docker build -f Dockerfile.backend-node -t smilefactory-backend-node:latest ../apps/backend-node

echo "Building backend-java Docker image..."
docker build -f Dockerfile.backend-java -t smilefactory-backend-java:latest ../apps/backend-java

# Stop existing backend containers if running
echo "Stopping existing backend containers..."
docker-compose -f compose/backend/docker-compose.yml down || true

# Start backend services
echo "Starting backend services..."
docker-compose -f compose/backend/docker-compose.yml up -d

# Wait for services to be healthy
echo "Waiting for backend services to be healthy..."
sleep 15

# Check health
if docker ps | grep -q smilefactory-backend-node && docker ps | grep -q smilefactory-backend-java; then
    echo "✓ Backend services deployed successfully!"
    echo "Backend Node is running on http://localhost:3000"
    echo "Backend Java is running on http://localhost:8080"
else
    echo "✗ Backend deployment failed!"
    docker-compose -f compose/backend/docker-compose.yml logs
    exit 1
fi

echo "========================================="
echo "Backend Deployment Complete"
echo "========================================="
