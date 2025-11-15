#!/bin/bash

# Smile Factory - Apache Deployment Script
# This script builds and prepares the application for Apache deployment

set -e

echo "================================"
echo "Smile Factory - Build & Deploy"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Clean previous build
echo -e "${YELLOW}Step 1: Cleaning previous build...${NC}"
rm -rf dist/
echo -e "${GREEN}✓ Build directory cleaned${NC}"
echo ""

# Step 2: Install dependencies
echo -e "${YELLOW}Step 2: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 3: Build the application
echo -e "${YELLOW}Step 3: Building application...${NC}"
npm run build
echo -e "${GREEN}✓ Application built successfully${NC}"
echo ""

# Step 4: Verify build output
echo -e "${YELLOW}Step 4: Verifying build output...${NC}"
if [ -f "dist/index.html" ]; then
    echo -e "${GREEN}✓ index.html found${NC}"
else
    echo -e "${RED}✗ index.html not found${NC}"
    exit 1
fi

if [ -d "dist/assets" ]; then
    echo -e "${GREEN}✓ assets directory found${NC}"
else
    echo -e "${RED}✗ assets directory not found${NC}"
    exit 1
fi
echo ""

# Step 5: Verify .htaccess
echo -e "${YELLOW}Step 5: Verifying .htaccess...${NC}"
if [ -f ".htaccess" ]; then
    echo -e "${GREEN}✓ .htaccess found${NC}"
else
    echo -e "${RED}✗ .htaccess not found${NC}"
    exit 1
fi
echo ""

# Step 6: Display build summary
echo -e "${YELLOW}Step 6: Build Summary${NC}"
echo "================================"
echo "Build Directory: dist/"
echo "Build Size: $(du -sh dist/ | cut -f1)"
echo "Files in dist/:"
find dist/ -type f | wc -l
echo ""
echo "Main files:"
ls -lh dist/index.html
ls -lh dist/assets/ | head -5
echo ""

# Step 7: Deployment instructions
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✓ Build Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Next steps for Apache deployment:"
echo ""
echo "1. Upload files to Apache:"
echo "   scp -r dist/* user@your-server.com:/var/www/html/"
echo ""
echo "2. Copy .htaccess to document root:"
echo "   scp .htaccess user@your-server.com:/var/www/html/"
echo ""
echo "3. SSH into server and enable mod_rewrite:"
echo "   ssh user@your-server.com"
echo "   sudo a2enmod rewrite"
echo "   sudo systemctl restart apache2"
echo ""
echo "4. Test the deployment:"
echo "   - Open: https://your-domain.com"
echo "   - Navigate to: https://your-domain.com/feed"
echo "   - Refresh page (F5) - should work without 404"
echo ""
echo "For detailed instructions, see: APACHE_DEPLOYMENT_GUIDE.md"
echo ""

