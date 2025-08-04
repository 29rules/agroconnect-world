# AgroConnect World - Complete Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Docker Compose installed
- Java 17+ (for building microservices)
- Maven (for building Java services)
- Node.js 18+ (for development)

### One-Command Deployment
```bash
./deploy-agroconnect.sh
```

This single command will:
1. ✅ Check Docker and Docker Compose
2. ✅ Set up environment files
3. ✅ Build all Java microservices
4. ✅ Clean up existing containers
5. ✅ Build and start all Docker containers
6. ✅ Wait for services to be ready
7. ✅ Test the deployment
8. ✅ Display access URLs

---

## 📋 Manual Deployment Steps

If you prefer to deploy manually or need to troubleshoot:

### 1. Environment Setup
```bash
# Create client environment file
echo "REACT_APP_API_URL=http://api-gateway:8080" > client/.env

# Create backend environment files
for service in backend-api-gateway microservices/*; do
  echo "SPRING_PROFILES_ACTIVE=docker" > "$service/.env"
  echo "MONGODB_URI=mongodb://admin:agroconnect123@mongodb:27017/agroconnect?authSource=admin" >> "$service/.env"
done
```

### 2. Build Java Services
```bash
# Build API Gateway
cd backend-api-gateway
mvn clean package -DskipTests
cd ..

# Build microservices
for service in microservices/*; do
  cd "$service"
  mvn clean package -DskipTests
  cd ../..
done
```

### 3. Start Services
```bash
# Clean up and start
docker-compose down -v
docker-compose up --build -d
```

---

## 🌐 Access URLs

Once deployed, access your application at:

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **MongoDB**: localhost:27017

### Individual Service Ports
- Product Service: http://localhost:8081
- Order Service: http://localhost:8082
- User Service: http://localhost:8083
- Audit Service: http://localhost:8084

---

## 🔧 Script Commands

The deployment script supports various commands:

```bash
# Full deployment
./deploy-agroconnect.sh

# Clean up containers and volumes
./deploy-agroconnect.sh clean

# View service logs
./deploy-agroconnect.sh logs

# Restart all services
./deploy-agroconnect.sh restart

# Check service status
./deploy-agroconnect.sh status

# Test deployment
./deploy-agroconnect.sh test

# Show help
./deploy-agroconnect.sh help
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Docker is not running"
```bash
# Start Docker Desktop
# On macOS: Open Docker Desktop application
# On Linux: sudo systemctl start docker
```

#### 2. "Port already in use"
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8080

# Kill the process or change ports in docker-compose.yml
```

#### 3. "Maven build failed"
```bash
# Check Java version
java -version

# Ensure Maven is installed
mvn -version

# Clean and rebuild
mvn clean package -DskipTests
```

#### 4. "Frontend can't connect to API"
```bash
# Check if API Gateway is running
docker logs agroconnect-api-gateway

# Verify environment variable
cat client/.env

# Check network connectivity
docker exec agroconnect-frontend ping api-gateway
```

#### 5. "MongoDB connection failed"
```bash
# Check MongoDB logs
docker logs agroconnect-mongodb

# Verify MongoDB is running
docker exec agroconnect-mongodb mongosh --eval "db.adminCommand('ping')"
```

### Service-Specific Issues

#### API Gateway Issues
```bash
# Check API Gateway logs
docker logs agroconnect-api-gateway

# Test health endpoint
curl http://localhost:8080/actuator/health

# Check if all microservices are accessible
curl http://localhost:8081/actuator/health  # Product Service
curl http://localhost:8082/actuator/health  # Order Service
curl http://localhost:8083/actuator/health  # User Service
curl http://localhost:8084/actuator/health  # Audit Service
```

#### Frontend Issues
```bash
# Check frontend logs
docker logs agroconnect-frontend

# Verify nginx configuration
docker exec agroconnect-frontend nginx -t

# Check if React app is built correctly
docker exec agroconnect-frontend ls -la /usr/share/nginx/html
```

#### Microservice Issues
```bash
# Check specific service logs
docker logs agroconnect-product-service
docker logs agroconnect-order-service
docker logs agroconnect-user-service
docker logs agroconnect-audit-service

# Restart specific service
docker-compose restart product-service
```

---

## 🔍 Debugging Commands

### View All Container Logs
```bash
docker-compose logs -f
```

### View Specific Service Logs
```bash
docker-compose logs -f api-gateway
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Check Container Status
```bash
docker-compose ps
docker ps
```

### Access Container Shell
```bash
# Frontend container
docker exec -it agroconnect-frontend sh

# API Gateway container
docker exec -it agroconnect-api-gateway sh

# MongoDB container
docker exec -it agroconnect-mongodb mongosh
```

### Check Network Connectivity
```bash
# Check if containers can reach each other
docker exec agroconnect-frontend ping api-gateway
docker exec agroconnect-api-gateway ping mongodb
```

---

## 📊 Monitoring

### Health Checks
```bash
# API Gateway health
curl http://localhost:8080/actuator/health

# Individual service health
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health
curl http://localhost:8083/actuator/health
curl http://localhost:8084/actuator/health
```

### Resource Usage
```bash
# Check container resource usage
docker stats

# Check disk usage
docker system df
```

---

## 🔄 Development Workflow

### Making Changes
1. Make your code changes
2. Rebuild the specific service:
   ```bash
   # For frontend changes
   docker-compose build frontend
   docker-compose up -d frontend
   
   # For backend changes
   docker-compose build api-gateway
   docker-compose up -d api-gateway
   ```

### Hot Reload (Development)
For development with hot reload, you can run services locally:

```bash
# Frontend (with hot reload)
cd client
npm start

# Backend (with hot reload)
cd backend-api-gateway
./mvnw spring-boot:run
```

---

## 🚀 Production Deployment

For production deployment, consider:

1. **Environment Variables**: Use proper production environment variables
2. **SSL/TLS**: Set up HTTPS with proper certificates
3. **Load Balancer**: Use a load balancer for high availability
4. **Monitoring**: Set up proper monitoring and logging
5. **Backup**: Configure database backups
6. **Security**: Review security configurations

---

## 📝 Configuration Files

### Docker Compose
The main configuration is in `docker-compose.yml`:
- Service definitions
- Network configuration
- Volume mounts
- Environment variables

### Environment Files
- `client/.env`: Frontend configuration
- `backend-api-gateway/.env`: API Gateway configuration
- `microservices/*/.env`: Individual microservice configurations

### Nginx Configuration
- `client/nginx.conf`: Frontend web server configuration

---

## 🆘 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review service logs: `./deploy-agroconnect.sh logs`
3. Test individual components: `./deploy-agroconnect.sh test`
4. Check service status: `./deploy-agroconnect.sh status`

For additional support, check the project documentation or create an issue in the repository.

---

## ✅ Success Checklist

After deployment, verify:

- [ ] Frontend loads at http://localhost:3000
- [ ] API Gateway responds at http://localhost:8080
- [ ] MongoDB is accessible
- [ ] All microservices are running
- [ ] Health checks pass
- [ ] Frontend can communicate with backend
- [ ] No errors in browser console
- [ ] No errors in service logs

🎉 **Congratulations!** Your AgroConnect World application is now running successfully! 