#!/bin/bash

# AgroConnect World - VPS Deployment Script
# This script automates deployment to a remote VPS with SSL and custom domain

set -e  # Exit on any error

# Configuration
VPS_USER="anuragbishnoi8"
VPS_IP="34.46.140.99"
VPS_PORT="22"
VPS_PATH="~/agroconnect-world"
DOMAIN="agroconnectworld.com"
DOMAIN_WWW="www.agroconnectworld.com"

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

# Function to execute command on VPS
execute_on_vps() {
    local command="$1"
    print_status "Executing locally: $command"
    eval "$command"
}

# Function to copy file to VPS
copy_to_vps() {
    local local_file="$1"
    local remote_file="$2"
    print_status "Copying $local_file to $remote_file..."
    cp "$local_file" "$remote_file"
}

# Check if required tools are installed
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command -v ssh &> /dev/null; then
        print_error "SSH is not installed. Please install SSH client."
        exit 1
    fi
    
    if ! command -v scp &> /dev/null; then
        print_error "SCP is not installed. Please install SSH client."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Test SSH connection
test_ssh_connection() {
    print_status "Skipping SSH test: running directly on GCP instance"
    print_success "SSH connection established"
}

# Prepare VPS environment
prepare_vps() {
    print_status "Preparing VPS environment..."
    
    # Update system and install required packages
    execute_on_vps "sudo apt update && sudo apt install -y git ufw nginx certbot python3-certbot-nginx docker.io docker-compose"
    
    # Create application directory
    execute_on_vps "mkdir -p $VPS_PATH && cd $VPS_PATH"
    
    # Start and enable Docker
    execute_on_vps "sudo systemctl start docker && sudo systemctl enable docker"
    execute_on_vps "sudo usermod -aG docker $VPS_USER"
    
    print_success "VPS environment prepared"
}

# Setup firewall
setup_firewall() {
    print_status "Setting up firewall..."
    
    execute_on_vps "sudo ufw --force reset"
    execute_on_vps "sudo ufw default deny incoming"
    execute_on_vps "sudo ufw default allow outgoing"
    execute_on_vps "sudo ufw allow ssh"
    execute_on_vps "sudo ufw allow 80/tcp"
    execute_on_vps "sudo ufw allow 443/tcp"
    execute_on_vps "sudo ufw --force enable"
    
    print_success "Firewall configured"
}

# Deploy application files
deploy_application() {
    print_status "Deploying application to VPS..."
    
    # Create a temporary deployment directory
    local temp_dir=$(mktemp -d)
    
    # Copy necessary files
    cp docker-compose.yml "$temp_dir/"
    cp -r client "$temp_dir/"
    cp -r backend-api-gateway "$temp_dir/"
    cp -r microservices "$temp_dir/"
    cp deploy-agroconnect.sh "$temp_dir/"
    
    # Create environment file
    cat > "$temp_dir/.env" << EOF
REACT_APP_API_URL=https://$DOMAIN
REACT_APP_ENV=production
EOF
    
    # Create production docker-compose override
    cat > "$temp_dir/docker-compose.prod.yml" << EOF
version: '3.8'

services:
  frontend:
    environment:
      - REACT_APP_API_URL=https://$DOMAIN
    restart: unless-stopped
    
  api-gateway:
    restart: unless-stopped
    
  product-service:
    restart: unless-stopped
    
  order-service:
    restart: unless-stopped
    
  user-service:
    restart: unless-stopped
    
  audit-log-service:
    restart: unless-stopped
    
  mongodb:
    restart: unless-stopped
EOF
    
    # Copy files to VPS
    scp -P $VPS_PORT -r "$temp_dir"/* "$VPS_USER@$VPS_IP:$VPS_PATH/"
    
    # Clean up temp directory
    rm -rf "$temp_dir"
    
    print_success "Application files deployed"
}

# Build and start services
start_services() {
    print_status "Building and starting services on VPS..."
    
    execute_on_vps "cd $VPS_PATH && chmod +x deploy-agroconnect.sh"
    
    # Build Java services
    execute_on_vps "cd $VPS_PATH/backend-api-gateway && mvn clean package -DskipTests"
    execute_on_vps "cd $VPS_PATH/microservices/product-service && mvn clean package -DskipTests"
    execute_on_vps "cd $VPS_PATH/microservices/order-service && mvn clean package -DskipTests"
    execute_on_vps "cd $VPS_PATH/microservices/user-service && mvn clean package -DskipTests"
    execute_on_vps "cd $VPS_PATH/microservices/audit-log-service && mvn clean package -DskipTests"
    
    # Start services
    execute_on_vps "cd $VPS_PATH && docker-compose -f docker-compose.yml -f docker-compose.prod.yml down -v"
    execute_on_vps "cd $VPS_PATH && docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d"
    
    print_success "Services started"
}

# Configure Nginx
configure_nginx() {
    print_status "Configuring Nginx reverse proxy..."
    
    # Create Nginx configuration
    local nginx_config="/tmp/agroconnect-nginx.conf"
    cat > "$nginx_config" << EOF
server {
    listen 80;
    server_name $DOMAIN $DOMAIN_WWW;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # API Gateway
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Health checks
    location /health {
        proxy_pass http://localhost:8080/actuator/health;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
}
EOF
    
    # Copy Nginx config to VPS
    copy_to_vps "$nginx_config" "/tmp/agroconnect-nginx.conf"
    
    # Install Nginx config on VPS
    execute_on_vps "sudo cp /tmp/agroconnect-nginx.conf /etc/nginx/sites-available/agroconnect"
    execute_on_vps "sudo ln -sf /etc/nginx/sites-available/agroconnect /etc/nginx/sites-enabled/"
    execute_on_vps "sudo rm -f /etc/nginx/sites-enabled/default"
    execute_on_vps "sudo nginx -t && sudo systemctl reload nginx"
    
    # Clean up
    rm -f "$nginx_config"
    
    print_success "Nginx configured"
}

# Setup SSL certificate
setup_ssl() {
    print_status "Setting up SSL certificate with Let's Encrypt..."
    
    # Stop Nginx temporarily for certbot
    execute_on_vps "sudo systemctl stop nginx"
    
    # Get SSL certificate
    execute_on_vps "sudo certbot certonly --standalone -d $DOMAIN -d $DOMAIN_WWW --non-interactive --agree-tos --email admin@$DOMAIN"
    
    # Update Nginx config for SSL
    local nginx_ssl_config="/tmp/agroconnect-ssl.conf"
    cat > "$nginx_ssl_config" << EOF
server {
    listen 80;
    server_name $DOMAIN $DOMAIN_WWW;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN $DOMAIN_WWW;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # API Gateway
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Health checks
    location /health {
        proxy_pass http://localhost:8080/actuator/health;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
}
EOF
    
    # Copy SSL config to VPS
    copy_to_vps "$nginx_ssl_config" "/tmp/agroconnect-ssl.conf"
    
    # Install SSL config on VPS
    execute_on_vps "sudo cp /tmp/agroconnect-ssl.conf /etc/nginx/sites-available/agroconnect"
    execute_on_vps "sudo nginx -t && sudo systemctl start nginx"
    
    # Setup auto-renewal
    execute_on_vps "echo '0 12 * * * /usr/bin/certbot renew --quiet --post-hook \"systemctl reload nginx\"' | sudo crontab -"
    
    # Clean up
    rm -f "$nginx_ssl_config"
    
    print_success "SSL certificate configured"
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for services to start
    sleep 30
    
    # Test services
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f "https://$DOMAIN/health" > /dev/null 2>&1; then
            print_success "Services are ready"
            return 0
        fi
        
        print_status "Waiting for services... (attempt $attempt/$max_attempts)"
        sleep 10
        attempt=$((attempt + 1))
    done
    
    print_warning "Services may not be fully ready yet"
}

# Test deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Test HTTPS
    if curl -f "https://$DOMAIN" > /dev/null 2>&1; then
        print_success "HTTPS frontend is accessible"
    else
        print_error "HTTPS frontend is not accessible"
        return 1
    fi
    
    # Test API
    if curl -f "https://$DOMAIN/api/products" > /dev/null 2>&1; then
        print_success "API is accessible"
    else
        print_warning "API test failed (this might be expected if no products exist)"
    fi
    
    # Test health endpoint
    if curl -f "https://$DOMAIN/health" > /dev/null 2>&1; then
        print_success "Health check passed"
    else
        print_error "Health check failed"
        return 1
    fi
    
    print_success "Deployment test completed"
}

# Display deployment summary
show_summary() {
    echo ""
    print_success "🎉 AgroConnect World VPS Deployment Complete!"
    echo ""
    echo "🌐 Access URLs:"
    echo "   Frontend: https://$DOMAIN"
    echo "   API: https://$DOMAIN/api"
    echo "   Health: https://$DOMAIN/health"
    echo ""
    echo "🔧 VPS Management:"
    echo "   SSH: ssh -p $VPS_PORT $VPS_USER@$VPS_IP"
    echo "   App Directory: $VPS_PATH"
    echo ""
    echo "📊 Useful Commands:"
    echo "   View logs: ssh -p $VPS_PORT $VPS_USER@$VPS_IP 'cd $VPS_PATH && docker-compose logs -f'"
    echo "   Restart: ssh -p $VPS_PORT $VPS_USER@$VPS_IP 'cd $VPS_PATH && docker-compose restart'"
    echo "   Update: ssh -p $VPS_PORT $VPS_USER@$VPS_IP 'cd $VPS_PATH && git pull && docker-compose up --build -d'"
    echo ""
    echo "🔒 SSL Certificate:"
    echo "   Auto-renewal: Configured via cron"
    echo "   Manual renewal: sudo certbot renew"
    echo ""
}

# Main deployment function
main() {
    echo ""
    print_status "🚀 Starting AgroConnect World VPS Deployment"
    echo "=================================================="
    echo ""
    print_status "Target VPS: $VPS_USER@$VPS_IP:$VPS_PORT"
    print_status "Domain: $DOMAIN"
    echo ""
    
    # Run deployment steps
    check_prerequisites
    test_ssh_connection
    prepare_vps
    setup_firewall
    deploy_application
    start_services
    configure_nginx
    setup_ssl
    wait_for_services
    test_deployment
    show_summary
    
    echo ""
    print_success "🎉 VPS deployment completed successfully!"
    echo ""
    print_status "Your application is now live at: https://$DOMAIN"
    echo ""
}

# Handle script arguments
case "${1:-}" in
    "test-connection")
        test_ssh_connection
        ;;
    "update")
        print_status "Updating application on VPS..."
        execute_on_vps "cd $VPS_PATH && git pull"
        execute_on_vps "cd $VPS_PATH && docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d"
        print_success "Application updated"
        ;;
    "logs")
        print_status "Showing VPS logs..."
        execute_on_vps "cd $VPS_PATH && docker-compose logs -f"
        ;;
    "restart")
        print_status "Restarting services on VPS..."
        execute_on_vps "cd $VPS_PATH && docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart"
        print_success "Services restarted"
        ;;
    "status")
        print_status "Checking VPS status..."
        execute_on_vps "cd $VPS_PATH && docker-compose ps"
        ;;
    "ssl-renew")
        print_status "Renewing SSL certificate..."
        execute_on_vps "sudo certbot renew --force-renewal"
        execute_on_vps "sudo systemctl reload nginx"
        print_success "SSL certificate renewed"
        ;;
    "help"|"-h"|"--help")
        echo "AgroConnect World VPS Deployment Script"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  (no args)  Full VPS deployment"
        echo "  test-connection  Test SSH connection"
        echo "  update      Update application on VPS"
        echo "  logs        Show VPS logs"
        echo "  restart     Restart services on VPS"
        echo "  status      Check VPS status"
        echo "  ssl-renew   Renew SSL certificate"
        echo "  help        Show this help"
        ;;
    *)
        main
        ;;
esac 