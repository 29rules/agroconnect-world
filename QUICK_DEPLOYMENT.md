# 🚀 AgroConnect World - Quick Deployment

## One Command Deployment
```bash
./deploy-agroconnect.sh
```

## Access URLs
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **MongoDB**: localhost:27017

## Quick Commands
```bash
# View logs
./deploy-agroconnect.sh logs

# Restart services
./deploy-agroconnect.sh restart

# Check status
./deploy-agroconnect.sh status

# Clean up
./deploy-agroconnect.sh clean

# Test deployment
./deploy-agroconnect.sh test
```

## Manual Steps (if needed)
```bash
# 1. Setup environment
echo "REACT_APP_API_URL=http://api-gateway:8080" > client/.env

# 2. Build Java services
cd backend-api-gateway && mvn clean package -DskipTests && cd ..
for service in microservices/*; do
  cd "$service" && mvn clean package -DskipTests && cd ../..
done

# 3. Start services
docker-compose down -v && docker-compose up --build -d
```

## Troubleshooting
```bash
# Check if Docker is running
docker info

# View service logs
docker-compose logs -f

# Check container status
docker-compose ps

# Restart specific service
docker-compose restart frontend
```

## Health Checks
```bash
# API Gateway
curl http://localhost:8080/actuator/health

# Frontend
curl http://localhost:3000

# Individual services
curl http://localhost:8081/actuator/health  # Product
curl http://localhost:8082/actuator/health  # Order
curl http://localhost:8083/actuator/health  # User
curl http://localhost:8084/actuator/health  # Audit
```

---
**Need help?** See `DEPLOYMENT_GUIDE.md` for detailed instructions. 