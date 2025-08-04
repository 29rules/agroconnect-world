#!/bin/bash

# AgroConnect World - SSH Setup Script for Hostgator
# This script helps configure SSH access to Hostgator

echo "🔧 AgroConnect World - SSH Setup for Hostgator"
echo "=============================================="

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

# Check if SSH config exists
SSH_CONFIG_FILE="ssh-config.txt"

if [ -f "$SSH_CONFIG_FILE" ]; then
    print_status "SSH configuration file found. Current settings:"
    echo ""
    cat "$SSH_CONFIG_FILE"
    echo ""
    
    read -p "Do you want to update the SSH configuration? (y/n): " update_config
    if [[ $update_config != "y" && $update_config != "Y" ]]; then
        print_status "SSH configuration unchanged."
        exit 0
    fi
fi

print_status "Setting up SSH configuration for Hostgator..."

# Get SSH credentials
echo ""
print_status "Please provide your Hostgator SSH credentials:"
echo ""

read -p "Enter your domain name (e.g., yourdomain.com): " ssh_host
read -p "Enter your cPanel username: " ssh_user
read -p "Enter SSH port (default: 22): " ssh_port
ssh_port=${ssh_port:-22}

# Calculate remote paths
remote_path="/home/$ssh_user/public_html"
backup_path="/home/$ssh_user/backups"

# Create SSH configuration
cat > "$SSH_CONFIG_FILE" << EOF
# Hostgator SSH Configuration
# Generated on $(date)

SSH_HOST=$ssh_host
SSH_USER=$ssh_user
SSH_PORT=$ssh_port
REMOTE_PATH=$remote_path
BACKUP_PATH=$backup_path

# Optional: SSH Key path (if using key-based authentication)
# SSH_KEY_PATH=~/.ssh/id_rsa

# Optional: Additional SSH options
# SSH_OPTIONS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
EOF

print_success "SSH configuration saved to $SSH_CONFIG_FILE"

# Test SSH connection
echo ""
print_status "Testing SSH connection..."
print_warning "You may be prompted for your password"

if ssh -p $ssh_port $ssh_user@$ssh_host "echo 'SSH connection successful'" 2>/dev/null; then
    print_success "SSH connection test successful!"
else
    print_error "SSH connection test failed!"
    print_warning "Please check your credentials and try again."
    print_status "Common issues:"
    echo "  - SSH access not enabled in cPanel"
    echo "  - Wrong username or password"
    echo "  - Firewall blocking connection"
    echo "  - Wrong port number"
    exit 1
fi

# Check if rsync is available
print_status "Checking if rsync is available..."
if command -v rsync &> /dev/null; then
    print_success "rsync is available for deployment"
else
    print_warning "rsync not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install rsync
    elif command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y rsync
    elif command -v yum &> /dev/null; then
        sudo yum install -y rsync
    else
        print_error "Could not install rsync automatically. Please install it manually."
    fi
fi

# Create SSH key setup instructions
cat > SSH_KEY_SETUP.md << EOF
# SSH Key Setup for Hostgator

## Why Use SSH Keys?
SSH keys provide more secure and convenient access to your Hostgator server.

## Setup Instructions

### 1. Generate SSH Key (if you don't have one)
\`\`\`bash
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
\`\`\`

### 2. Copy Public Key to Hostgator
\`\`\`bash
# Copy your public key
cat ~/.ssh/id_rsa.pub

# SSH into your Hostgator server
ssh $ssh_user@$ssh_host

# Add the key to authorized_keys
mkdir -p ~/.ssh
echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
\`\`\`

### 3. Update SSH Configuration
Uncomment and update the SSH_KEY_PATH line in ssh-config.txt:
\`\`\`
SSH_KEY_PATH=~/.ssh/id_rsa
\`\`\`

### 4. Test Key-Based Authentication
\`\`\`bash
ssh -i ~/.ssh/id_rsa $ssh_user@$ssh_host
\`\`\`

## Benefits
- No password required for deployment
- More secure than password authentication
- Can be used in automated scripts
EOF

print_success "SSH setup completed!"
echo ""
echo "📋 Summary:"
echo "   - SSH configuration saved to $SSH_CONFIG_FILE"
echo "   - Connection test successful"
echo "   - SSH key setup guide created"
echo ""
echo "🚀 Next steps:"
echo "   1. Optionally set up SSH keys (see SSH_KEY_SETUP.md)"
echo "   2. Run: ./deploy-ssh.sh to deploy via SSH"
echo ""
print_success "Ready for SSH deployment!" 