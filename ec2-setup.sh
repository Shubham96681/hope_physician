#!/bin/bash

# EC2 Initial Setup Script
# Run this once on a fresh EC2 instance

set -e

echo "🚀 Setting up EC2 instance for Hope Physicians..."

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
echo "📦 Installing PM2..."
sudo npm install -g pm2
pm2 startup systemd -u $USER --hp /home/$USER 2>/dev/null | grep "sudo" | bash || true

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt-get install -y nginx

# Install Git
if ! command -v git &> /dev/null; then
    echo "📦 Installing Git..."
    sudo apt-get install -y git
fi

# Install build tools
echo "📦 Installing build tools..."
sudo apt-get install -y build-essential python3

# Setup firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Create application directory
mkdir -p ~/hope-physicians/logs

echo ""
echo "✅ EC2 setup completed!"
echo "Ports opened: 22 (SSH), 80 (HTTP), 443 (HTTPS)"

