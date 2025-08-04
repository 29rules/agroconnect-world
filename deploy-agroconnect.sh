#!/bin/bash

# AgroConnect World - Complete Deployment Script
# This script automates the full deployment of the AgroConnect World microservices application

set -e  # Exit on any error

echo "🚀 AgroConnect World - Enterprise Deployment Script"
echo "=================================================="

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

# Check if Docker is running
check_docker() {
    print_status "Checking Docker installation..."
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Check if Docker Compose is available
check_docker_compose() {
    print_status "Checking Docker Compose..."
    if ! docker-compose --version > /dev/null 2>&1; then
        print_error "Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi
    print_success "Docker Compose is available"
}

# Create environment files
setup_environment() {
    print_status "Setting up environment configuration..."
    
    # Create client environment file
    if [ ! -f "client/.env" ]; then
        echo "REACT_APP_API_URL=http://api-gateway:8080" > client/.env
        print_success "Created client/.env file"
    else
        print_warning "client/.env already exists, skipping..."
    fi
    
    # Create backend environment files if they don't exist
    for service in backend-api-gateway microservices/product-service microservices/order-service microservices/user-service microservices/audit-log-service; do
        if [ ! -f "$service/.env" ]; then
            echo "SPRING_PROFILES_ACTIVE=docker" > "$service/.env"
            echo "MONGODB_URI=mongodb://admin:agroconnect123@mongodb:27017/agroconnect?authSource=admin" >> "$service/.env"
            print_success "Created $service/.env file"
        fi
    done
}

# Build Java microservices
build_java_services() {
    print_status "Building Java microservices..."
    
    # Build API Gateway
    print_status "Building API Gateway..."
    cd backend-api-gateway
    if [ -f "pom.xml" ]; then
        mvn clean package -DskipTests
        print_success "API Gateway built successfully"
    else
        print_warning "No pom.xml found in API Gateway, skipping build"
    fi
    cd ..
    
    # Build microservices
    for service in microservices/*; do
        if [ -d "$service" ] && [ -f "$service/pom.xml" ]; then
            print_status "Building $(basename $service)..."
            cd "$service"
            mvn clean package -DskipTests
            print_success "$(basename $service) built successfully"
            cd ../..
        fi
    done
}

# Clean up existing containers and volumes
cleanup() {
    print_status "Cleaning up existing containers and volumes..."
    docker-compose down -v --remove-orphans 2>/dev/null || true
    docker system prune -f 2>/dev/null || true
    print_success "Cleanup completed"
}

# Build and start services
deploy_services() {
    print_status "Building and starting all services..."
    
    # Build all services
    docker-compose build --no-cache
    
    # Start all services
    docker-compose up -d
    
    print_success "All services started successfully"
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for MongoDB
    print_status "Waiting for MongoDB..."
    until docker exec agroconnect-mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
        sleep 2
    done
    print_success "MongoDB is ready"
    
    # Wait for API Gateway
    print_status "Waiting for API Gateway..."
    until curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; do
        sleep 5
    done
    print_success "API Gateway is ready"
    
    # Wait for Frontend
    print_status "Waiting for Frontend..."
    until curl -f http://localhost:3000 > /dev/null 2>&1; do
        sleep 5
    done
    print_success "Frontend is ready"
}

# Display service status
show_status() {
    print_status "Checking service status..."
    docker-compose ps
    
    echo ""
    print_success "🎉 AgroConnect World is now running!"
    echo ""
    echo "📱 Frontend: http://localhost:3000"
    echo "🔌 API Gateway: http://localhost:8080"
    echo "🗄️  MongoDB: localhost:27017"
    echo ""
    echo "📊 Service Ports:"
    echo "   - Product Service: http://localhost:8081"
    echo "   - Order Service: http://localhost:8082"
    echo "   - User Service: http://localhost:8083"
    echo "   - Audit Service: http://localhost:8084"
    echo ""
    echo "🔧 Useful Commands:"
    echo "   - View logs: docker-compose logs -f"
    echo "   - Stop services: docker-compose down"
    echo "   - Restart services: docker-compose restart"
    echo "   - Rebuild: docker-compose up --build"
}

# Test the deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Test API Gateway
    if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
        print_success "API Gateway health check passed"
    else
        print_error "API Gateway health check failed"
        return 1
    fi
    
    # Test Frontend
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend is accessible"
    else
        print_error "Frontend is not accessible"
        return 1
    fi
    
    # Test API endpoint
    if curl -f http://localhost:8080/api/products > /dev/null 2>&1; then
        print_success "API endpoint test passed"
    else
        print_warning "API endpoint test failed (this might be expected if no products exist)"
    fi
    
    print_success "Deployment test completed"
}

# Main deployment function
main() {
    echo ""
    print_status "Starting AgroConnect World deployment..."
    echo ""
    
    # Run all deployment steps
    check_docker
    check_docker_compose
    setup_environment
    build_java_services
    cleanup
    deploy_services
    wait_for_services
    test_deployment
    show_status
    
    echo ""
    print_success "🎉 Deployment completed successfully!"
    echo ""
    print_status "You can now access AgroConnect World at:"
    echo "   🌐 Frontend: http://localhost:3000"
    echo "   🔌 API: http://localhost:8080"
    echo ""
}

# Handle script arguments
case "${1:-}" in
    "clean")
        print_status "Cleaning up deployment..."
        cleanup
        print_success "Cleanup completed"
        ;;
    "logs")
        print_status "Showing service logs..."
        docker-compose logs -f
        ;;
    "restart")
        print_status "Restarting services..."
        docker-compose restart
        print_success "Services restarted"
        ;;
    "status")
        show_status
        ;;
    "test")
        test_deployment
        ;;
    "help"|"-h"|"--help")
        echo "AgroConnect World Deployment Script"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  (no args)  Full deployment"
        echo "  clean      Clean up containers and volumes"
        echo "  logs       Show service logs"
        echo "  restart    Restart all services"
        echo "  status     Show service status"
        echo "  test       Test deployment"
        echo "  help       Show this help"
        ;;
    *)
        main
        ;;
esac 