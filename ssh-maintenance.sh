#!/bin/bash

# AgroConnect World - SSH Maintenance Script for Hostgator
# This script provides maintenance tools for your Hostgator server

echo "🔧 AgroConnect World - SSH Maintenance Tools"
echo "============================================"

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

# Validate SSH configuration
if [ -z "$SSH_HOST" ] || [ -z "$SSH_USER" ] || [ -z "$REMOTE_PATH" ]; then
    print_error "SSH configuration is incomplete!"
    print_warning "Please update $SSH_CONFIG_FILE with your credentials"
    exit 1
fi

# Function to execute SSH command
execute_ssh() {
    local command="$1"
    local description="$2"
    
    print_status "$description..."
    ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "$command"
}

# Function to show menu
show_menu() {
    echo ""
    echo "🔧 Maintenance Options:"
    echo "1.  View server status"
    echo "2.  Check disk space"
    echo "3.  View error logs"
    echo "4.  View access logs"
    echo "5.  Check file permissions"
    echo "6.  Create backup"
    echo "7.  List backups"
    echo "8.  Restore from backup"
    echo "9.  Check SSL certificate"
    echo "10. Monitor real-time logs"
    echo "11. Check database connections"
    echo "12. View website files"
    echo "13. Test website response"
    echo "14. Check cron jobs"
    echo "15. View system resources"
    echo "0.  Exit"
    echo ""
}

# Main menu loop
while true; do
    show_menu
    read -p "Select an option (0-15): " choice
    
    case $choice in
        1)
            echo ""
            print_status "Server Status:"
            execute_ssh "uptime && who && ps aux | head -10" "Getting server status"
            ;;
        2)
            echo ""
            print_status "Disk Space:"
            execute_ssh "df -h" "Checking disk space"
            ;;
        3)
            echo ""
            print_status "Error Logs (last 50 lines):"
            execute_ssh "tail -50 $REMOTE_PATH/error_log 2>/dev/null || echo 'No error log found'" "Viewing error logs"
            ;;
        4)
            echo ""
            print_status "Access Logs (last 50 lines):"
            execute_ssh "tail -50 $REMOTE_PATH/access_log 2>/dev/null || echo 'No access log found'" "Viewing access logs"
            ;;
        5)
            echo ""
            print_status "File Permissions:"
            execute_ssh "ls -la $REMOTE_PATH/ | head -20" "Checking file permissions"
            ;;
        6)
            echo ""
            print_status "Creating Backup:"
            BACKUP_NAME="manual-backup-$(date +%Y%m%d-%H%M%S)"
            execute_ssh "mkdir -p $BACKUP_PATH && tar -czf $BACKUP_PATH/$BACKUP_NAME.tar.gz -C $REMOTE_PATH ." "Creating backup"
            print_success "Backup created: $BACKUP_NAME.tar.gz"
            ;;
        7)
            echo ""
            print_status "Available Backups:"
            execute_ssh "ls -la $BACKUP_PATH/ 2>/dev/null || echo 'No backups found'" "Listing backups"
            ;;
        8)
            echo ""
            print_status "Available Backups:"
            execute_ssh "ls -la $BACKUP_PATH/ 2>/dev/null || echo 'No backups found'" "Listing backups"
            echo ""
            read -p "Enter backup filename to restore: " backup_file
            if [ -n "$backup_file" ]; then
                print_warning "This will overwrite current files. Continue? (y/n): "
                read -p "" confirm
                if [[ $confirm == "y" || $confirm == "Y" ]]; then
                    execute_ssh "cd $REMOTE_PATH && tar -xzf $BACKUP_PATH/$backup_file" "Restoring backup"
                    print_success "Backup restored!"
                else
                    print_status "Restore cancelled."
                fi
            fi
            ;;
        9)
            echo ""
            print_status "SSL Certificate Status:"
            execute_ssh "openssl s_client -connect $SSH_HOST:443 -servername $SSH_HOST < /dev/null 2>/dev/null | openssl x509 -noout -dates" "Checking SSL certificate"
            ;;
        10)
            echo ""
            print_status "Real-time Log Monitoring (Press Ctrl+C to stop):"
            print_warning "Monitoring logs in real-time..."
            ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "tail -f $REMOTE_PATH/error_log $REMOTE_PATH/access_log 2>/dev/null"
            ;;
        11)
            echo ""
            print_status "Database Connections:"
            execute_ssh "netstat -an | grep :3306 | wc -l" "Checking database connections"
            ;;
        12)
            echo ""
            print_status "Website Files:"
            execute_ssh "ls -la $REMOTE_PATH/" "Listing website files"
            ;;
        13)
            echo ""
            print_status "Testing Website Response:"
            execute_ssh "curl -I https://$SSH_HOST 2>/dev/null || curl -I http://$SSH_HOST 2>/dev/null" "Testing website response"
            ;;
        14)
            echo ""
            print_status "Cron Jobs:"
            execute_ssh "crontab -l 2>/dev/null || echo 'No cron jobs found'" "Checking cron jobs"
            ;;
        15)
            echo ""
            print_status "System Resources:"
            execute_ssh "free -h && echo '---' && top -bn1 | head -10" "Checking system resources"
            ;;
        0)
            print_success "Exiting maintenance tools."
            exit 0
            ;;
        *)
            print_error "Invalid option. Please select 0-15."
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
done 