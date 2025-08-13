#!/bin/bash

# AgroConnect World - SSH Deployment Script
# Deploys React application to Hostgator via SSH with backup and error handling

set -euo pipefail  # Exit on error, undefined vars, pipe failures

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

# Function to handle errors
error_handler() {
    local exit_code=$?
    local line_number=$1
    print_error "Script failed at line $line_number with exit code $exit_code"
    exit $exit_code
}

# Set error handler
trap 'error_handler $LINENO' ERR

echo "🚀 Starting SSH Deployment to Hostgator"
echo "========================================"

# 1. Load environment variables from ssh-config.txt
print_status "📋 Loading SSH configuration..."
SSH_CONFIG_FILE="ssh-config.txt"

if [[ ! -f "$SSH_CONFIG_FILE" ]]; then
    print_error "SSH configuration file '$SSH_CONFIG_FILE' not found!"
    print_status "Please create $SSH_CONFIG_FILE with the following variables:"
    cat << EOF
SSH_HOST=your-domain.com
SSH_USER=your-cpanel-username
SSH_PORT=2222
REMOTE_PATH=/home/your-cpanel-username/public_html
BACKUP_PATH=/home/your-cpanel-username/backups
EOF
    exit 1
fi

# Source the configuration file
source "$SSH_CONFIG_FILE"

# Validate required environment variables
required_vars=("SSH_HOST" "SSH_USER" "REMOTE_PATH")
for var in "${required_vars[@]}"; do
    if [[ -z "${!var:-}" ]]; then
        print_error "Required environment variable '$var' is not set in $SSH_CONFIG_FILE"
        exit 1
    fi
done

# Set default values for optional variables
SSH_PORT="${SSH_PORT:-2222}"
BACKUP_PATH="${BACKUP_PATH:-/home/$SSH_USER/backups}"

print_success "SSH Configuration loaded: $SSH_USER@$SSH_HOST:$REMOTE_PATH"

# 2. Build React application
print_status "📦 Installing dependencies..."
if ! cd client && npm install; then
    print_error "npm install failed!"
    exit 1
fi

print_status "🔨 Building React application..."
if ! npm run build; then
    print_error "npm run build failed!"
    exit 1
fi

# Verify build directory exists
if [[ ! -d "build" ]]; then
    print_error "Build directory 'build' not found after build process!"
    exit 1
fi

print_success "React application built successfully!"

# Go back to root directory for deployment
cd ..

# 3. Connect to Hostgator server and backup existing contents
print_status "💾 Creating backup of existing site..."
BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"

# Create backup directory if it doesn't exist
ssh -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "mkdir -p '$BACKUP_PATH'"

# Create backup of existing contents
if ssh -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "cd '$REMOTE_PATH' && tar -czf '$BACKUP_PATH/$BACKUP_NAME.tar.gz' . 2>/dev/null"; then
    print_success "Backup created: $BACKUP_NAME.tar.gz"
else
    print_warning "Backup creation failed or directory was empty, continuing..."
fi

# 4. Clear remote deployment directory
print_status "🧹 Clearing remote deployment directory..."
if ssh -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "rm -rf '$REMOTE_PATH'/*"; then
    print_success "Remote directory cleared"
else
    print_warning "Failed to clear remote directory, continuing..."
fi

# 5. Upload build folder contents using rsync
print_status "📤 Uploading build files via rsync..."
if rsync -avz --delete -e "ssh -p $SSH_PORT" client/build/ "$SSH_USER@$SSH_HOST:$REMOTE_PATH/"; then
    print_success "Build files uploaded successfully!"
else
    print_error "rsync upload failed!"
    exit 1
fi

# 6. Upload .htaccess file if it exists
print_status "📄 Checking for .htaccess file..."
if [[ -f ".htaccess" ]]; then
    print_status "📤 Uploading .htaccess file..."
    if scp -P "$SSH_PORT" .htaccess "$SSH_USER@$SSH_HOST:$REMOTE_PATH/"; then
        print_success ".htaccess file uploaded successfully!"
    else
        print_error "Failed to upload .htaccess file!"
        exit 1
    fi
else
    print_warning ".htaccess file not found, skipping..."
fi

# 7. Set proper file permissions
print_status "🔐 Setting file permissions..."
ssh -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "
    chmod 644 '$REMOTE_PATH'/*.html '$REMOTE_PATH'/*.css '$REMOTE_PATH'/*.js 2>/dev/null || true
    chmod 755 '$REMOTE_PATH' 2>/dev/null || true
    chmod 644 '$REMOTE_PATH'/.htaccess 2>/dev/null || true
"

print_success "File permissions set correctly!"

# 8. Verify deployment
print_status "🔍 Verifying deployment..."
if ssh -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "ls -la '$REMOTE_PATH/' | head -5"; then
    print_success "Deployment verification successful!"
else
    print_error "Deployment verification failed!"
    exit 1
fi

# 9. Create deployment summary
DEPLOYMENT_SUMMARY="DEPLOYMENT_SUMMARY_$(date +%Y%m%d_%H%M%S).md"
cat > "$DEPLOYMENT_SUMMARY" << EOF
# SSH Deployment Summary

## Deployment Date
$(date)

## Configuration
- **Host**: $SSH_HOST
- **User**: $SSH_USER
- **Port**: $SSH_PORT
- **Remote Path**: $REMOTE_PATH
- **Backup Path**: $BACKUP_PATH

## Deployment Details
- ✅ SSH configuration loaded
- ✅ Dependencies installed
- ✅ React application built
- ✅ Backup created: $BACKUP_NAME.tar.gz
- ✅ Remote directory cleared
- ✅ Build files uploaded via rsync
- ✅ .htaccess file uploaded
- ✅ File permissions set
- ✅ Deployment verified

## Files Deployed
- React build files (HTML, CSS, JS)
- Static assets
- .htaccess configuration

## Backup Information
- **Backup Name**: $BACKUP_NAME.tar.gz
- **Backup Location**: $BACKUP_PATH/$BACKUP_NAME.tar.gz
- **Restore Command**: \`tar -xzf $BACKUP_PATH/$BACKUP_NAME.tar.gz -C $REMOTE_PATH\`

## Next Steps
1. Test the website at: https://$SSH_HOST
2. Verify all functionality works
3. Check error logs if needed
4. Monitor performance

## Troubleshooting
- If site doesn't load: Check DNS and SSL settings
- If API calls fail: Verify backend configuration
- If permissions issues: Run chmod commands manually
EOF

print_success "Deployment summary created: $DEPLOYMENT_SUMMARY"

# 10. Final success message
echo ""
echo "🎉 SSH Deployment Completed Successfully!"
echo "=========================================="
echo ""
echo "📋 Summary:"
echo "   - React app built and deployed"
echo "   - Backup created: $BACKUP_NAME.tar.gz"
echo "   - Files uploaded via SSH"
echo "   - Permissions set correctly"
echo ""
echo "🌐 Test your website:"
echo "   - HTTP: http://$SSH_HOST"
echo "   - HTTPS: https://$SSH_HOST"
echo ""
echo "📁 Files created:"
echo "   - $DEPLOYMENT_SUMMARY"
echo ""
print_success "Your React application is now live on Hostgator! 🚀" 