#!/bin/bash

# AgroConnect World Frontend Deployment Script
# For Hostgator deployment

echo "🚀 Starting AgroConnect World Frontend Deployment..."

# Build the React app
echo "📦 Building React application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Exiting..."
    exit 1
fi

echo "✅ Build completed successfully!"

# Create deployment package
echo "📁 Creating deployment package..."
DEPLOY_DIR="deploy-agroconnect-world"
rm -rf $DEPLOY_DIR
mkdir $DEPLOY_DIR

# Copy build files
cp -r build/* $DEPLOY_DIR/
cp .htaccess $DEPLOY_DIR/

# Create deployment info
cat > $DEPLOY_DIR/DEPLOYMENT_INFO.txt << EOF
AgroConnect World Frontend Deployment
====================================
Deployment Date: $(date)
Build Version: $(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
Environment: Production
Backend API: Supabase

Deployment Instructions:
1. Upload all files from this directory to your Hostgator public_html folder
2. Ensure .htaccess is in the root directory
3. Update API endpoints in src/services/ to point to Supabase
4. Test the application

Backup Instructions:
- Always backup your current site before deploying
- Keep a copy of this deployment package
EOF

# Create zip file for easy upload
echo "🗜️ Creating deployment zip..."
zip -r agroconnect-world-frontend-deploy.zip $DEPLOY_DIR/

echo "✅ Deployment package created!"
echo "📁 Files ready for upload:"
echo "   - Directory: $DEPLOY_DIR/"
echo "   - Zip file: agroconnect-world-frontend-deploy.zip"
echo ""
echo "📋 Next steps:"
echo "   1. Upload files to Hostgator public_html directory"
echo "   2. Update API configuration for Supabase"
echo "   3. Test the application"
echo ""
echo "🎉 Deployment package ready!" 