#!/bin/bash

# AgroConnect World - Hosting Organization Script
# This script organizes the hosting structure for better management

echo "🏗️ Organizing Hosting Structure for Better Management"
echo "===================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Load SSH configuration
SSH_CONFIG_FILE="ssh-config.txt"

if [ ! -f "$SSH_CONFIG_FILE" ]; then
    print_error "SSH configuration file not found!"
    print_status "Please run ./ssh-setup.sh first"
    exit 1
fi

source "$SSH_CONFIG_FILE"

print_status "Organizing hosting structure..."

# Create organized directory structure
print_status "Creating organized directory structure..."
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "
mkdir -p /home/nyxezvte/websites
mkdir -p /home/nyxezvte/websites/agroconnect-world
mkdir -p /home/nyxezvte/websites/bishnoianurag-site
mkdir -p /home/nyxezvte/websites/backups
mkdir -p /home/nyxezvte/websites/logs
mkdir -p /home/nyxezvte/websites/ssl
"

# Move AgroConnect World files
print_status "Organizing AgroConnect World files..."
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "
if [ -d '/home/nyxezvte/public_html' ]; then
    cp -r /home/nyxezvte/public_html/* /home/nyxezvte/websites/agroconnect-world/ 2>/dev/null || true
    echo 'AgroConnect World files organized'
fi
"

# Move bishnoianurag.site files
print_status "Organizing bishnoianurag.site files..."
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "
if [ -d '/home/nyxezvte/bishnoianurag.site' ]; then
    cp -r /home/nyxezvte/bishnoianurag.site/* /home/nyxezvte/websites/bishnoianurag-site/ 2>/dev/null || true
    echo 'bishnoianurag.site files organized'
fi
"

# Create website information files
print_status "Creating website information files..."

ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "cat > /home/nyxezvte/websites/agroconnect-world/WEBSITE_INFO.txt << 'EOF'
AgroConnect World Website
=========================
Domain: agroconnectworld.com
Type: React.js Frontend
Backend: Supabase
Deployment: SSH
Last Updated: $(date)

Files:
- index.html (React app)
- static/ (CSS, JS, assets)
- .htaccess (Apache config)

Deployment Path: /home/nyxezvte/public_html/
Organized Path: /home/nyxezvte/websites/agroconnect-world/
EOF"

ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "cat > /home/nyxezvte/websites/bishnoianurag-site/WEBSITE_INFO.txt << 'EOF'
Bishnoi Anurag Site
===================
Domain: bishnoianurag.site
Type: WordPress/Static Site
Last Updated: $(date)

Files:
- WordPress files (if applicable)
- Static HTML/CSS/JS files

Original Path: /home/nyxezvte/bishnoianurag.site/
Organized Path: /home/nyxezvte/websites/bishnoianurag-site/
EOF"

# Create hosting organization guide
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "cat > /home/nyxezvte/websites/HOSTING_ORGANIZATION.md << 'EOF'
# Hosting Organization Guide

## Directory Structure
```
/home/nyxezvte/websites/
├── agroconnect-world/          # AgroConnect World files
├── bishnoianurag-site/         # Bishnoi Anurag site files
├── backups/                    # Website backups
├── logs/                       # Log files
└── ssl/                        # SSL certificates
```

## Website Management

### AgroConnect World
- **Domain**: agroconnectworld.com
- **Type**: React.js Frontend
- **Backend**: Supabase
- **Deployment**: SSH via deploy-ssh.sh
- **Live Path**: /home/nyxezvte/public_html/
- **Organized Path**: /home/nyxezvte/websites/agroconnect-world/

### Bishnoi Anurag Site
- **Domain**: bishnoianurag.site
- **Type**: WordPress/Static Site
- **Original Path**: /home/nyxezvte/bishnoianurag.site/
- **Organized Path**: /home/nyxezvte/websites/bishnoianurag-site/

## Quick Commands

### View Website Files
```bash
# AgroConnect World
ls -la /home/nyxezvte/websites/agroconnect-world/

# Bishnoi Anurag Site
ls -la /home/nyxezvte/websites/bishnoianurag-site/
```

### Deploy AgroConnect World
```bash
cd /path/to/agroconnect-world/client
./deploy-ssh.sh
```

### Create Backup
```bash
tar -czf /home/nyxezvte/websites/backups/agroconnect-world-$(date +%Y%m%d).tar.gz -C /home/nyxezvte/websites/agroconnect-world .
```

## Notes
- Original files are preserved in their original locations
- Organized structure is for better management
- Live sites continue to work from their original paths
EOF"

# Create quick access script
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "cat > /home/nyxezvte/websites/quick-access.sh << 'EOF'
#!/bin/bash

echo '🌐 Website Quick Access'
echo '====================='
echo '1. AgroConnect World (agroconnectworld.com)'
echo '2. Bishnoi Anurag Site (bishnoianurag.site)'
echo '3. View hosting organization'
echo '4. Create backup'
echo ''

read -p 'Select option (1-4): ' choice

case $choice in
    1)
        echo '📁 AgroConnect World Files:'
        ls -la /home/nyxezvte/websites/agroconnect-world/
        echo ''
        echo '🌐 Live Site: /home/nyxezvte/public_html/'
        ;;
    2)
        echo '📁 Bishnoi Anurag Site Files:'
        ls -la /home/nyxezvte/websites/bishnoianurag-site/
        echo ''
        echo '🌐 Live Site: /home/nyxezvte/bishnoianurag.site/'
        ;;
    3)
        echo '📋 Hosting Organization:'
        cat /home/nyxezvte/websites/HOSTING_ORGANIZATION.md
        ;;
    4)
        echo '💾 Creating backup...'
        tar -czf /home/nyxezvte/websites/backups/websites-backup-$(date +%Y%m%d-%H%M%S).tar.gz -C /home/nyxezvte/websites .
        echo 'Backup created successfully!'
        ;;
    *)
        echo 'Invalid option'
        ;;
esac
EOF"

# Make quick access script executable
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "chmod +x /home/nyxezvte/websites/quick-access.sh"

# Show final organization
print_status "Final organization structure:"
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "tree /home/nyxezvte/websites/ -L 2 2>/dev/null || ls -la /home/nyxezvte/websites/"

print_success "Hosting organization completed!"
echo ""
echo "📋 Organization Summary:"
echo "   ✅ Created /home/nyxezvte/websites/ directory"
echo "   ✅ Organized AgroConnect World files"
echo "   ✅ Organized bishnoianurag.site files"
echo "   ✅ Created website information files"
echo "   ✅ Created hosting organization guide"
echo "   ✅ Created quick access script"
echo ""
echo "🚀 Quick Access:"
echo "   Run: ssh -p $SSH_PORT $SSH_USER@$SSH_HOST '/home/nyxezvte/websites/quick-access.sh'"
echo ""
echo "📁 Organized Paths:"
echo "   - AgroConnect World: /home/nyxezvte/websites/agroconnect-world/"
echo "   - Bishnoi Anurag: /home/nyxezvte/websites/bishnoianurag-site/"
echo ""
print_success "Your hosting is now organized and clutter-free!" 