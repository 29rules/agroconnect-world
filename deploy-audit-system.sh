#!/bin/bash

# AgroConnect World - Audit Logging System Deployment Script
# This script rebuilds and deploys the audit logging system

set -e

echo "🚀 Starting AgroConnect World Audit Logging System Deployment..."

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

# Check if we're on the GCP VM
if [[ "$HOSTNAME" == *"gcp"* ]] || [[ "$HOSTNAME" == *"instance"* ]]; then
    print_status "Running on GCP VM - deploying audit system..."
    
    cd ~/agroconnect-world
    
    # Stop all services
    print_status "Stopping all services..."
    docker-compose down
    
    # Rebuild audit service
    print_status "Rebuilding audit-log-service..."
    cd microservices/audit-log-service
    mvn clean package -DskipTests
    cd ../..
    
    # Rebuild product service
    print_status "Rebuilding product-service..."
    cd microservices/product-service
    mvn clean package -DskipTests
    cd ../..
    
    # Rebuild order service
    print_status "Rebuilding order-service..."
    cd microservices/order-service
    mvn clean package -DskipTests
    cd ../..
    
    # Start all services
    print_status "Starting all services..."
    docker-compose up -d
    
    # Wait for services to start
    print_status "Waiting for services to start..."
    sleep 30
    
    # Test audit service
    print_status "Testing audit service..."
    AUDIT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8084/api/audit/health)
    if [[ "$AUDIT_STATUS" == "200" ]]; then
        print_success "Audit service is running (HTTP $AUDIT_STATUS)"
    else
        print_error "Audit service failed (HTTP $AUDIT_STATUS)"
    fi
    
    # Test product service
    print_status "Testing product service..."
    PRODUCT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8081/products/)
    if [[ "$PRODUCT_STATUS" == "200" || "$PRODUCT_STATUS" == "401" ]]; then
        print_success "Product service is running (HTTP $PRODUCT_STATUS)"
    else
        print_error "Product service failed (HTTP $PRODUCT_STATUS)"
    fi
    
    # Test order service
    print_status "Testing order service..."
    ORDER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8082/orders/)
    if [[ "$ORDER_STATUS" == "200" || "$ORDER_STATUS" == "401" ]]; then
        print_success "Order service is running (HTTP $ORDER_STATUS)"
    else
        print_error "Order service failed (HTTP $ORDER_STATUS)"
    fi
    
    # Create test audit log
    print_status "Creating test audit log..."
    curl -X POST http://localhost:8084/api/audit/log \
        -H "Content-Type: application/json" \
        -d '{
            "serviceName": "test-service",
            "username": "admin",
            "action": "TEST_AUDIT",
            "details": "Testing audit logging system",
            "ipAddress": "127.0.0.1",
            "userAgent": "deployment-script",
            "requestId": "test-123"
        }'
    
    echo ""
    print_success "Audit logging system deployment completed!"
    echo ""
    echo "📊 Audit System Status:"
    echo "  • Audit Service: http://localhost:8084/api/audit/health"
    echo "  • Product Service: http://localhost:8081/products/"
    echo "  • Order Service: http://localhost:8082/orders/"
    echo "  • Audit Logs: http://localhost:8084/api/audit/logs"
    echo "  • Audit Stats: http://localhost:8084/api/audit/stats"
    echo ""
    echo "📝 Log Files:"
    echo "  • Audit Service: logs/operate.log"
    echo "  • Product Service: logs/operate.log"
    echo "  • Order Service: logs/operate.log"
    echo ""
    echo "🌐 Public URLs:"
    echo "  • Frontend: https://agroconnectworld.com"
    echo "  • Audit API: https://agroconnectworld.com/api/audit/"
    
else
    print_error "This script should be run on the GCP VM"
    print_status "Please SSH to your GCP VM and run this script there"
    exit 1
fi 