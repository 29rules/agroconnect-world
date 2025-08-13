#!/bin/bash

# AgroConnect World - GCP Frontend Deployment Script
# Deploys React frontend from local machine to Google Cloud VPS

set -e  # Exit on any error

# GCP VPS Configuration
VPS_USER="anuragbishnoi8"
VPS_IP="34.46.140.99"
VPS_PORT="22"
VPS_PATH="~/agroconnect-world"
DOMAIN="agroconnectworld.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🚀 Starting GCP Frontend Deployment"
echo "==================================="

# 1. Build React application
print_status "📦 Building React application..."
cd client
if ! npm run build; then
    print_error "Build failed! Exiting..."
    exit 1
fi
cd ..
print_success "React application built successfully!"

# 2. Create deployment package
print_status "📁 Creating deployment package..."
DEPLOY_DIR="gcp-deploy-frontend"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# Copy build files
cp -r client/build/* $DEPLOY_DIR/
if [ -f ".htaccess" ]; then
    cp .htaccess $DEPLOY_DIR/
fi

# 3. Upload to GCP VPS
print_status "📤 Uploading to GCP VPS..."
if ! scp -P $VPS_PORT -r $DEPLOY_DIR/* $VPS_USER@$VPS_IP:$VPS_PATH/frontend/; then
    print_error "Upload failed! Exiting..."
    exit 1
fi
print_success "Files uploaded successfully!"

# 4. Restart services on VPS
print_status "🔄 Restarting services on VPS..."
if ! ssh -p $VPS_PORT $VPS_USER@$VPS_IP "cd $VPS_PATH && docker-compose restart frontend"; then
    print_warning "Service restart failed, but files are uploaded"
else
    print_success "Services restarted successfully!"
fi

# 5. Clean up local deployment files
print_status "🧹 Cleaning up local files..."
rm -rf $DEPLOY_DIR

# 6. Test deployment
print_status "🔍 Testing deployment..."
sleep 5  # Wait for services to restart

if curl -f "https://$DOMAIN" > /dev/null 2>&1; then
    print_success "Frontend is accessible at https://$DOMAIN"
else
    print_warning "Frontend test failed, but deployment completed"
fi

echo ""
print_success "🎉 GCP Frontend Deployment Complete!"
echo ""
echo "🌐 Your updated website should now be live at:"
echo "   https://$DOMAIN"
echo ""
echo "📁 Files deployed to: $VPS_PATH/frontend/"
echo ""
echo "🔧 If you still see the old version:"
echo "   1. Clear your browser cache (Ctrl+F5 or Cmd+Shift+R)"
echo "   2. Wait a few minutes for DNS propagation"
echo "   3. Check VPS logs: ssh -p $VPS_PORT $VPS_USER@$VPS_IP 'cd $VPS_PATH && docker-compose logs frontend'"
echo ""
