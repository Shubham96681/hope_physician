#!/bin/bash

# Multi-Application Deployment Script for EC2
# Deploys multiple applications on a single EC2 instance

set -e  # Exit on error

echo "🚀 Starting multi-application deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load apps configuration
CONFIG_FILE="./apps.config.json"
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}❌ apps.config.json not found!${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18 or higher.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"
echo -e "${GREEN}✅ npm version: $(npm --version)${NC}"

# Parse apps from config
APPS=$(node -e "const config = require('./apps.config.json'); console.log(JSON.stringify(config.apps.map(a => a.name)))")
APPS_ARRAY=($(echo $APPS | tr -d '[],"'))

# Function to deploy a single application
deploy_app() {
    local APP_NAME=$1
    local APP_CONFIG=$(node -e "const config = require('./apps.config.json'); console.log(JSON.stringify(config.apps.find(a => a.name === '$APP_NAME')))")
    
    if [ "$APP_CONFIG" == "undefined" ]; then
        echo -e "${RED}❌ App '$APP_NAME' not found in config${NC}"
        return 1
    fi
    
    echo -e "\n${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}📦 Deploying: $APP_NAME${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}\n"
    
    # Extract app configuration
    local APP_DIR=$(node -e "console.log(JSON.parse('$APP_CONFIG').directory)")
    local BACKEND_DIR=$(node -e "const c = JSON.parse('$APP_CONFIG'); console.log(c.backend ? c.directory + '/' + c.backend.directory : '')")
    local FRONTEND_DIR=$(node -e "const c = JSON.parse('$APP_CONFIG'); console.log(c.frontend ? c.directory + '/' + c.frontend.directory : '')")
    local BACKEND_PORT=$(node -e "const c = JSON.parse('$APP_CONFIG'); console.log(c.backend ? c.backend.port : '')")
    local BACKEND_SCRIPT=$(node -e "const c = JSON.parse('$APP_CONFIG'); console.log(c.backend ? c.backend.script : '')")
    
    # Create directories
    mkdir -p "$APP_DIR"
    mkdir -p "$APP_DIR/logs"
    
    # ============================================
    # BACKEND DEPLOYMENT
    # ============================================
    if [ -n "$BACKEND_DIR" ] && [ -d "$BACKEND_DIR" ]; then
        echo -e "${YELLOW}🔧 Deploying Backend for $APP_NAME...${NC}"
        
        cd "$BACKEND_DIR"
        
        # Install backend dependencies
        echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
        npm ci --production=false
        
        # Generate Prisma Client (if Prisma exists)
        if [ -f "prisma/schema.prisma" ]; then
            echo -e "${YELLOW}🔨 Generating Prisma Client...${NC}"
            npm run prisma:generate 2>/dev/null || npx prisma generate
            
            # Run database migrations
            echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
            npx prisma migrate deploy 2>/dev/null || echo "⚠️  Migration skipped or already applied"
        fi
        
        # Create .env file if it doesn't exist
        if [ ! -f "$BACKEND_DIR/.env" ]; then
            echo -e "${YELLOW}📝 Creating .env file...${NC}"
            cat > "$BACKEND_DIR/.env" << EOF
NODE_ENV=${NODE_ENV:-production}
PORT=$BACKEND_PORT
JWT_SECRET=${JWT_SECRET:-change-this-secret-in-production}
DATABASE_URL=file:./prisma/hope_physicians.db
EMAIL_USER=${EMAIL_USER:-}
EMAIL_PASS=${EMAIL_PASS:-}
RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID:-}
RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET:-}
EOF
            echo -e "${GREEN}✅ .env file created${NC}"
        else
            echo -e "${GREEN}✅ .env file already exists${NC}"
        fi
        
        # Stop existing PM2 process if running
        if command -v pm2 &> /dev/null; then
            echo -e "${YELLOW}🛑 Stopping existing backend process...${NC}"
            pm2 stop "${APP_NAME}-backend" 2>/dev/null || echo "No existing process to stop"
            pm2 delete "${APP_NAME}-backend" 2>/dev/null || echo "No existing process to delete"
        fi
        
        echo -e "${GREEN}✅ Backend prepared for $APP_NAME${NC}"
    fi
    
    # ============================================
    # FRONTEND DEPLOYMENT
    # ============================================
    if [ -n "$FRONTEND_DIR" ] && [ -d "$FRONTEND_DIR" ]; then
        echo -e "${YELLOW}🎨 Deploying Frontend for $APP_NAME...${NC}"
        
        cd "$FRONTEND_DIR"
        
        # Install frontend dependencies
        echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
        npm ci
        
        # Build frontend
        echo -e "${YELLOW}🏗️  Building frontend...${NC}"
        BUILD_CMD=$(node -e "const c = JSON.parse('$APP_CONFIG'); console.log(c.frontend.buildCommand || 'npm run build')")
        eval "$BUILD_CMD"
        
        echo -e "${GREEN}✅ Frontend built for $APP_NAME${NC}"
    fi
    
    echo -e "${GREEN}✅ $APP_NAME deployment completed!${NC}\n"
}

# Start all backends with PM2
start_all_backends() {
    echo -e "\n${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}🚀 Starting all backends with PM2...${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}\n"
    
    if ! command -v pm2 &> /dev/null; then
        echo -e "${YELLOW}⚠️  PM2 not installed. Installing PM2...${NC}"
        npm install -g pm2
        pm2 startup
    fi
    
    # Use ecosystem config if available
    if [ -f "./ecosystem.config.js" ]; then
        echo -e "${YELLOW}📋 Using ecosystem.config.js...${NC}"
        pm2 start ecosystem.config.js --update-env
    else
        # Start each app backend individually
        for APP_NAME in "${APPS_ARRAY[@]}"; do
            local APP_CONFIG=$(node -e "const config = require('./apps.config.json'); console.log(JSON.stringify(config.apps.find(a => a.name === '$APP_NAME')))")
            local APP_DIR=$(node -e "console.log(JSON.parse('$APP_CONFIG').directory)")
            local BACKEND_DIR=$(node -e "const c = JSON.parse('$APP_CONFIG'); console.log(c.backend ? c.directory + '/' + c.backend.directory : '')")
            local BACKEND_PORT=$(node -e "const c = JSON.parse('$APP_CONFIG'); console.log(c.backend ? c.backend.port : '')")
            local BACKEND_SCRIPT=$(node -e "const c = JSON.parse('$APP_CONFIG'); console.log(c.backend ? c.backend.script : '')")
            
            if [ -n "$BACKEND_DIR" ] && [ -d "$BACKEND_DIR" ]; then
                echo -e "${YELLOW}🚀 Starting ${APP_NAME}-backend on port $BACKEND_PORT...${NC}"
                cd "$BACKEND_DIR"
                pm2 start "$BACKEND_SCRIPT" --name "${APP_NAME}-backend" --update-env
            fi
        done
    fi
    
    pm2 save
    echo -e "${GREEN}✅ All backends started with PM2${NC}\n"
}

# Configure Nginx for all apps
configure_nginx() {
    if ! command -v nginx &> /dev/null; then
        echo -e "${YELLOW}⚠️  Nginx not installed. Skipping Nginx configuration.${NC}"
        return
    fi
    
    echo -e "\n${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}🌐 Configuring Nginx for all applications...${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}\n"
    
    # Generate Nginx config
    NGINX_CONFIG=$(node -e "
    const config = require('./apps.config.json');
    let nginxConfig = 'server {\n    listen 80;\n    server_name _;\n    \n';
    
    config.apps.forEach((app, index) => {
        if (app.frontend && app.backend) {
            const frontendPath = app.nginx.frontendPath || '/';
            const apiPath = app.nginx.apiPath || '/api';
            const frontendDir = app.directory + '/' + app.frontend.directory + '/' + (app.frontend.distDirectory || 'dist');
            const backendPort = app.backend.port;
            
            if (index === 0) {
                nginxConfig += '    # ' + app.displayName + ' - Frontend\n';
                nginxConfig += '    root ' + frontendDir + ';\n';
                nginxConfig += '    index index.html;\n    \n';
                nginxConfig += '    location ' + frontendPath + ' {\n';
                nginxConfig += '        try_files \\$uri \\$uri/ /index.html;\n';
                nginxConfig += '    }\n    \n';
            } else {
                nginxConfig += '    # ' + app.displayName + ' - Frontend\n';
                nginxConfig += '    location ' + frontendPath + ' {\n';
                nginxConfig += '        alias ' + frontendDir + '/' + ';\n';
                nginxConfig += '        try_files \\$uri \\$uri/ ' + frontendPath + 'index.html;\n';
                nginxConfig += '    }\n    \n';
            }
            
            nginxConfig += '    # ' + app.displayName + ' - Backend API\n';
            nginxConfig += '    location ' + apiPath + ' {\n';
            nginxConfig += '        proxy_pass http://localhost:' + backendPort + ';\n';
            nginxConfig += '        proxy_http_version 1.1;\n';
            nginxConfig += '        proxy_set_header Upgrade \\$http_upgrade;\n';
            nginxConfig += '        proxy_set_header Connection \"upgrade\";\n';
            nginxConfig += '        proxy_set_header Host \\$host;\n';
            nginxConfig += '        proxy_set_header X-Real-IP \\$remote_addr;\n';
            nginxConfig += '        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;\n';
            nginxConfig += '        proxy_set_header X-Forwarded-Proto \\$scheme;\n';
            nginxConfig += '        proxy_cache_bypass \\$http_upgrade;\n';
            nginxConfig += '    }\n    \n';
        }
    });
    
    nginxConfig += '    # Static files caching\n';
    nginxConfig += '    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {\n';
    nginxConfig += '        expires 1y;\n';
    nginxConfig += '        add_header Cache-Control \"public, immutable\";\n';
    nginxConfig += '    }\n';
    nginxConfig += '}\n';
    
    console.log(nginxConfig);
    ")
    
    # Write Nginx config
    echo -e "${YELLOW}📝 Writing Nginx configuration...${NC}"
    echo -e "$NGINX_CONFIG" | sudo tee /etc/nginx/sites-available/multi-app > /dev/null
    
    # Enable site
    sudo ln -sf /etc/nginx/sites-available/multi-app /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test and reload nginx
    echo -e "${YELLOW}🧪 Testing Nginx configuration...${NC}"
    sudo nginx -t && sudo systemctl reload nginx
    echo -e "${GREEN}✅ Nginx configured and reloaded${NC}\n"
}

# Main deployment flow
echo -e "${BLUE}📋 Found ${#APPS_ARRAY[@]} application(s) to deploy${NC}"

# Deploy each application
for APP_NAME in "${APPS_ARRAY[@]}"; do
    deploy_app "$APP_NAME"
done

# Start all backends
start_all_backends

# Configure Nginx
configure_nginx

# ============================================
# FINAL STATUS
# ============================================
echo -e "\n${GREEN}✅ Multi-application deployment completed!${NC}\n"

# Show PM2 status
if command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📊 Application Status:${NC}"
    pm2 status
    echo ""
fi

echo -e "${GREEN}🎉 All applications deployed successfully!${NC}"

