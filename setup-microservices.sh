#!/bin/bash

# 🌾 AgroConnect World - Microservices Setup Script
# This script sets up the complete microservices architecture

set -e

echo "🚀 Starting AgroConnect World Microservices Setup..."

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

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if Node.js is installed (for local development)
check_nodejs() {
    print_status "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_warning "Node.js is not installed. Frontend development will not work locally."
    else
        print_success "Node.js is installed"
    fi
}

# Check if Java is installed (for local development)
check_java() {
    print_status "Checking Java installation..."
    if ! command -v java &> /dev/null; then
        print_warning "Java is not installed. Backend development will not work locally."
    else
        print_success "Java is installed"
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating project directories..."
    
    # Create microservices directories if they don't exist
    mkdir -p microservices/product-service/src/main/java/com/agroconnect/product
    mkdir -p microservices/product-service/src/main/resources
    mkdir -p microservices/order-service/src/main/java/com/agroconnect/order
    mkdir -p microservices/order-service/src/main/resources
    mkdir -p microservices/user-service/src/main/java/com/agroconnect/user
    mkdir -p microservices/user-service/src/main/resources
    mkdir -p microservices/audit-log-service/src/main/java/com/agroconnect/audit
    mkdir -p microservices/audit-log-service/src/main/resources
    
    # Create API gateway directories
    mkdir -p backend-api-gateway/src/main/java/com/agroconnect/gateway
    mkdir -p backend-api-gateway/src/main/resources
    
    # Create database directory
    mkdir -p database/init
    
    print_success "Project directories created"
}

# Install frontend dependencies
install_frontend_deps() {
    print_status "Installing frontend dependencies..."
    cd client
    
    if [ -f "package.json" ]; then
        npm install
        print_success "Frontend dependencies installed"
    else
        print_warning "package.json not found in client directory"
    fi
    
    cd ..
}

# Build Docker images
build_docker_images() {
    print_status "Building Docker images..."
    
    # Build API Gateway
    if [ -f "backend-api-gateway/pom.xml" ]; then
        print_status "Building API Gateway..."
        cd backend-api-gateway
        mvn clean package -DskipTests
        cd ..
    fi
    
    # Build Product Service
    if [ -f "microservices/product-service/pom.xml" ]; then
        print_status "Building Product Service..."
        cd microservices/product-service
        mvn clean package -DskipTests
        cd ../..
    fi
    
    # Build Order Service
    if [ -f "microservices/order-service/pom.xml" ]; then
        print_status "Building Order Service..."
        cd microservices/order-service
        mvn clean package -DskipTests
        cd ../..
    fi
    
    # Build User Service
    if [ -f "microservices/user-service/pom.xml" ]; then
        print_status "Building User Service..."
        cd microservices/user-service
        mvn clean package -DskipTests
        cd ../..
    fi
    
    # Build Audit Service
    if [ -f "microservices/audit-log-service/pom.xml" ]; then
        print_status "Building Audit Service..."
        cd microservices/audit-log-service
        mvn clean package -DskipTests
        cd ../..
    fi
    
    print_success "Docker images built successfully"
}

# Start services with Docker Compose
start_services() {
    print_status "Starting services with Docker Compose..."
    
    if [ -f "docker-compose.yml" ]; then
        docker-compose up -d --build
        print_success "Services started successfully"
    else
        print_error "docker-compose.yml not found"
        exit 1
    fi
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for MongoDB
    print_status "Waiting for MongoDB..."
    until docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
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

# Display service information
display_info() {
    echo ""
    echo "🎉 AgroConnect World is now running!"
    echo ""
    echo "📱 Access Points:"
    echo "   Frontend:     http://localhost:3000"
    echo "   API Gateway:  http://localhost:8080"
    echo "   MongoDB:      localhost:27017"
    echo ""
    echo "🔧 Management:"
    echo "   View logs:    docker-compose logs -f"
    echo "   Stop services: docker-compose down"
    echo "   Restart:      docker-compose restart"
    echo ""
    echo "📊 Health Checks:"
    echo "   API Gateway:  http://localhost:8080/actuator/health"
    echo "   Product API:  http://localhost:8080/api/products/"
    echo ""
    echo "🚀 Next Steps:"
    echo "   1. Open http://localhost:3000 in your browser"
    echo "   2. Explore the product catalog"
    echo "   3. Test the live chat feature"
    echo "   4. Check the analytics dashboard"
    echo ""
}

# Main execution
main() {
    echo "🌾 AgroConnect World - Microservices Setup"
    echo "=========================================="
    echo ""
    
    # Run setup steps
    check_docker
    check_nodejs
    check_java
    create_directories
    install_frontend_deps
    build_docker_images
    start_services
    wait_for_services
    display_info
    
    print_success "Setup completed successfully!"
}

# Run main function
main "$@" 