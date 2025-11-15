#!/bin/bash

echo "========================================="
echo "SmileFactory Health Check"
echo "========================================="

# Function to check service health
check_service() {
    local service_name=$1
    local url=$2
    local max_attempts=10
    local attempt=1

    echo -n "Checking $service_name... "
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s -o /dev/null "$url"; then
            echo "✓ Healthy"
            return 0
        fi
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "✗ Unhealthy"
    return 1
}

# Check backend-node
check_service "Backend Node" "http://localhost:3000/health"
BACKEND_NODE_STATUS=$?

# Check backend-java
check_service "Backend Java" "http://localhost:8080/actuator/health"
BACKEND_JAVA_STATUS=$?

# Check frontend
check_service "Frontend" "http://localhost:80"
FRONTEND_STATUS=$?

echo "========================================="

# Summary
if [ $BACKEND_NODE_STATUS -eq 0 ] && [ $BACKEND_JAVA_STATUS -eq 0 ] && [ $FRONTEND_STATUS -eq 0 ]; then
    echo "✓ All services are healthy!"
    exit 0
else
    echo "✗ Some services are unhealthy!"
    echo ""
    echo "To troubleshoot, check logs:"
    echo "  docker logs smilefactory-backend-node"
    echo "  docker logs smilefactory-backend-java"
    echo "  docker logs smilefactory-frontend"
    exit 1
fi
