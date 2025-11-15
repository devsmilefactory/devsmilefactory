#!/bin/bash
set -e

echo "========================================="
echo "Deploying SmileFactory Frontend"
echo "========================================="

# Navigate to deployment directory
cd "$(dirname "$0")/.."

# Build frontend Docker image
echo "Building frontend Docker image..."
docker build -f Dockerfile.frontend -t smilefactory-frontend:latest ../apps/frontend

# Stop existing frontend container if running
echo "Stopping existing frontend container..."
docker-compose -f compose/frontend/docker-compose.yml down || true

# Start frontend service
echo "Starting frontend service..."
docker-compose -f compose/frontend/docker-compose.yml up -d

# Wait for service to be healthy
echo "Waiting for frontend to be healthy..."
sleep 10

# Check health
if docker ps | grep -q smilefactory-frontend; then
    echo "✓ Frontend deployed successfully!"
    echo "Frontend is running on http://localhost:80"
else
    echo "✗ Frontend deployment failed!"
    docker-compose -f compose/frontend/docker-compose.yml logs
    exit 1
fi

echo "========================================="
echo "Frontend Deployment Complete"
echo "========================================="
