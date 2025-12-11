#!/bin/bash

# Hope Physicians Deployment Script for EC2
# Fully automated deployment with no manual intervention

set -e

echo "🚀 Starting Hope Physicians deployment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
APP_DIR="/home/$USER/hope-physicians"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
BACKEND_PORT=${PORT:-5000}
NODE_ENV=${NODE_ENV:-production}

echo -e "${YELLOW}📁 Application Directory: $APP_DIR${NC}"

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Node.js 18...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo -e "${GREEN}✅ Node.js installed${NC}"
fi

echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
echo -e "${GREEN}✅ npm: $(npm --version)${NC}"

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📦 Installing PM2...${NC}"
    sudo npm install -g pm2
    pm2 startup systemd -u $USER --hp /home/$USER 2>/dev/null | grep "sudo" | bash || true
    echo -e "${GREEN}✅ PM2 installed${NC}"
fi

# ============================================
# BACKEND DEPLOYMENT
# ============================================
echo -e "\n${YELLOW}🔧 Deploying Backend...${NC}"

cd $BACKEND_DIR

# Install dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
npm ci --production=false

# Generate Prisma Client
if [ -f "prisma/schema.prisma" ]; then
    echo -e "${YELLOW}🔨 Generating Prisma Client...${NC}"
    npm run prisma:generate
    
    # Run migrations
    echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
    npx prisma migrate deploy --skip-generate 2>/dev/null || npx prisma db push --skip-generate --accept-data-loss 2>/dev/null || echo "⚠️  Database setup skipped"
fi

# Create/Update .env file
echo -e "${YELLOW}📝 Updating .env file...${NC}"
cat > $BACKEND_DIR/.env << EOF
NODE_ENV=${NODE_ENV}
PORT=${BACKEND_PORT}
JWT_SECRET=${JWT_SECRET}
DATABASE_URL=${DATABASE_URL:-file:./prisma/hope_physicians.db}
EMAIL_USER=${EMAIL_USER}
EMAIL_PASS=${EMAIL_PASS}
RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}
EOF
echo -e "${GREEN}✅ .env file updated${NC}"

# Stop existing PM2 process
pm2 stop hope-physicians-backend 2>/dev/null || true
pm2 delete hope-physicians-backend 2>/dev/null || true

# Start backend with PM2
echo -e "${YELLOW}🚀 Starting backend with PM2...${NC}"
cd $APP_DIR
if [ -f "$APP_DIR/ecosystem.config.js" ]; then
    pm2 start ecosystem.config.js --update-env
else
    cd $BACKEND_DIR
    pm2 start server.js --name "hope-physicians-backend" --update-env
fi
pm2 save --force
echo -e "${GREEN}✅ Backend started${NC}"

# ============================================
# FRONTEND DEPLOYMENT
# ============================================
echo -e "\n${YELLOW}🎨 Deploying Frontend...${NC}"

cd $FRONTEND_DIR

# Install dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
npm ci

# Build frontend
echo -e "${YELLOW}🏗️  Building frontend...${NC}"
npm run build
echo -e "${GREEN}✅ Frontend built${NC}"

# ============================================
# NGINX CONFIGURATION
# ============================================
if command -v nginx &> /dev/null; then
    echo -e "\n${YELLOW}🌐 Configuring Nginx...${NC}"
    
    sudo tee /etc/nginx/sites-available/hope-physicians > /dev/null << EOF
server {
    listen 80;
    server_name _;
    
    root $FRONTEND_DIR/dist;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

    sudo ln -sf /etc/nginx/sites-available/hope-physicians /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    if sudo nginx -t 2>/dev/null; then
        sudo systemctl reload nginx
        echo -e "${GREEN}✅ Nginx configured${NC}"
    fi
fi

# ============================================
# FINAL STATUS
# ============================================
echo -e "\n${GREEN}✅ Deployment completed!${NC}\n"

pm2 status
echo ""
echo -e "${GREEN}🎉 Application is running!${NC}"
echo -e "${YELLOW}📍 Backend: http://localhost:$BACKEND_PORT${NC}"
echo -e "${YELLOW}📍 Frontend: http://localhost${NC}"

