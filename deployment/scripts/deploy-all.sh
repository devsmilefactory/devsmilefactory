#!/bin/bash
set -e

echo "========================================="
echo "Deploying Complete SmileFactory System"
echo "========================================="

# Get script directory
SCRIPT_DIR="$(dirname "$0")"

# Deploy backend services first
echo ""
echo "Step 1/3: Deploying Backend Services..."
bash "$SCRIPT_DIR/deploy-backend.sh"

# Wait for backends to stabilize
echo ""
echo "Waiting for backend services to stabilize..."
sleep 5

# Deploy frontend
echo ""
echo "Step 2/3: Deploying Frontend..."
bash "$SCRIPT_DIR/deploy-frontend.sh"

# Run health checks
echo ""
echo "Step 3/3: Running Health Checks..."
bash "$SCRIPT_DIR/health-check.sh"

echo ""
echo "========================================="
echo "Complete System Deployment Successful!"
echo "========================================="
echo ""
echo "Services:"
echo "  - Frontend:      http://localhost:80"
echo "  - Backend Node:  http://localhost:3000"
echo "  - Backend Java:  http://localhost:8080"
echo ""
echo "To view logs:"
echo "  docker-compose -f deployment/compose/backend/docker-compose.yml logs -f"
echo "  docker-compose -f deployment/compose/frontend/docker-compose.yml logs -f"
echo ""
