#!/bin/bash

# Script to setup and clone second application on EC2
# Run this on EC2 instance to prepare for second app deployment

set -e

echo "🚀 Setting up second application..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
APP2_DIR="/home/$USER/app2"
APP2_REPO_URL=${1:-""}

if [ -z "$APP2_REPO_URL" ]; then
    echo -e "${YELLOW}Usage: ./setup-second-app.sh <repository-url>${NC}"
    echo -e "${YELLOW}Example: ./setup-second-app.sh https://github.com/username/app2.git${NC}"
    exit 1
fi

echo -e "${YELLOW}📁 Setting up second app in: $APP2_DIR${NC}"

# Create directory
mkdir -p "$APP2_DIR"
cd "$APP2_DIR"

# Clone repository
if [ -d ".git" ]; then
    echo -e "${YELLOW}📥 Updating existing repository...${NC}"
    git pull
else
    echo -e "${YELLOW}📥 Cloning repository...${NC}"
    git clone "$APP2_REPO_URL" .
fi

# Create logs directory
mkdir -p logs

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Install backend dependencies
if [ -d "backend" ] && [ -f "backend/package.json" ]; then
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    cd backend
    npm install
    cd ..
fi

# Install frontend dependencies
if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    cd frontend
    npm install
    cd ..
fi

echo -e "${GREEN}✅ Second application setup completed!${NC}"
echo -e "${YELLOW}Next: Update apps.config.json with your second app configuration${NC}"

