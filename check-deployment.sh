#!/bin/bash

# Deployment Health Check Script

echo "🔍 Checking deployment status..."
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check PM2
echo -e "${YELLOW}1. PM2 Status:${NC}"
if command -v pm2 &> /dev/null; then
    pm2 status
    if pm2 list | grep -q "hope-physicians-backend"; then
        echo -e "${GREEN}✅ Backend is running${NC}"
    else
        echo -e "${RED}❌ Backend is NOT running${NC}"
    fi
else
    echo -e "${RED}❌ PM2 not installed${NC}"
fi

echo ""

# Check Ports
echo -e "${YELLOW}2. Port Status:${NC}"
if netstat -tuln 2>/dev/null | grep -q ":5000 " || ss -tuln 2>/dev/null | grep -q ":5000 "; then
    echo -e "${GREEN}✅ Port 5000 is listening${NC}"
else
    echo -e "${RED}❌ Port 5000 is NOT listening${NC}"
fi

if netstat -tuln 2>/dev/null | grep -q ":80 " || ss -tuln 2>/dev/null | grep -q ":80 "; then
    echo -e "${GREEN}✅ Port 80 is listening${NC}"
else
    echo -e "${RED}❌ Port 80 is NOT listening${NC}"
fi

echo ""

# Check Nginx
echo -e "${YELLOW}3. Nginx Status:${NC}"
if command -v nginx &> /dev/null; then
    if sudo systemctl is-active --quiet nginx; then
        echo -e "${GREEN}✅ Nginx is running${NC}"
    else
        echo -e "${RED}❌ Nginx is NOT running${NC}"
    fi
else
    echo -e "${RED}❌ Nginx not installed${NC}"
fi

echo ""

# Check Files
echo -e "${YELLOW}4. Application Files:${NC}"
APP_DIR="/home/$USER/hope-physicians"
if [ -d "$APP_DIR/backend" ]; then
    echo -e "${GREEN}✅ Backend directory exists${NC}"
else
    echo -e "${RED}❌ Backend directory missing${NC}"
fi

if [ -d "$APP_DIR/frontend/dist" ]; then
    echo -e "${GREEN}✅ Frontend build exists${NC}"
else
    echo -e "${RED}❌ Frontend build missing${NC}"
fi

echo ""
echo -e "${YELLOW}📊 Summary:${NC}"
echo "Test backend: curl http://localhost:5000/api"
echo "Test frontend: curl http://localhost"

