# 🚀 AgroConnect World - VPS Deployment Guide

## Overview
This guide will help you deploy AgroConnect World to a remote VPS (Virtual Private Server) with SSL certificate and custom domain support.

## ✅ Prerequisites

### VPS Requirements
- **OS**: Ubuntu 22.04 LTS (recommended)
- **CPU**: 1 vCPU minimum (2+ recommended)
- **RAM**: 2GB minimum (4GB recommended)
- **Storage**: 20GB minimum (50GB recommended)
- **Network**: Public IP address

### Domain Requirements
- **Domain name** pointing to your VPS IP
- **DNS A record** configured
- **Email address** for SSL certificate notifications

### Local Requirements
- SSH client installed
- Git installed
- Docker and Docker Compose (for local testing)

## 🔧 VPS Setup

### 1. Connect to Your VPS
```bash
ssh -p 2222 nyxezvte@50.6.160.170
```

### 2. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Install Required Packages
```bash
sudo apt install -y git ufw nginx certbot python3-certbot-nginx docker.io docker-compose
```

### 4. Configure Firewall
```bash
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

### 5. Start Docker
```bash
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

## 🚀 Automated Deployment

### One-Command Deployment
```bash
./deploy-vps.sh
```

This script will:
1. ✅ Test SSH connection to VPS
2. ✅ Prepare VPS environment
3. ✅ Configure firewall
4. ✅ Deploy application files
5. ✅ Build and start services
6. ✅ Configure Nginx reverse proxy
7. ✅ Setup SSL certificate
8. ✅ Test deployment

### Manual Deployment Steps

If you prefer manual deployment or need to troubleshoot:

#### 1. Prepare Application Directory
```bash
# On VPS
mkdir -p ~/agroconnect-world
cd ~/agroconnect-world
```

#### 2. Clone Repository
```bash
git clone https://github.com/29rules/agroconnect-world.git .
```

#### 3. Create Environment File
```bash
cat > .env << EOF
REACT_APP_API_URL=https://agroconnectworld.com
REACT_APP_ENV=production
EOF
```

#### 4. Create Production Docker Compose Override
```bash
cat > docker-compose.prod.yml << EOF
version: '3.8'

services:
  frontend:
    environment:
      - REACT_APP_API_URL=https://agroconnectworld.com
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
```

#### 5. Build Java Services
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

#### 6. Start Services
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

## 🌐 Nginx Configuration

### 1. Create Nginx Site Configuration
```bash
sudo nano /etc/nginx/sites-available/agroconnect
```

### 2. Add Configuration
```nginx
server {
    listen 80;
    server_name agroconnectworld.com www.agroconnectworld.com;
    
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
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # API Gateway
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Health checks
    location /health {
        proxy_pass http://localhost:8080/actuator/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
}
```

### 3. Enable Site
```bash
sudo ln -sf /etc/nginx/sites-available/agroconnect /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 SSL Certificate Setup

### 1. Get SSL Certificate
```bash
sudo systemctl stop nginx
sudo certbot certonly --standalone -d agroconnectworld.com -d www.agroconnectworld.com --non-interactive --agree-tos --email admin@agroconnectworld.com
```

### 2. Update Nginx for SSL
```bash
sudo nano /etc/nginx/sites-available/agroconnect
```

Replace with SSL configuration:
```nginx
server {
    listen 80;
    server_name agroconnectworld.com www.agroconnectworld.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name agroconnectworld.com www.agroconnectworld.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/agroconnectworld.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/agroconnectworld.com/privkey.pem;
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
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # API Gateway
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Health checks
    location /health {
        proxy_pass http://localhost:8080/actuator/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
}
```

### 3. Start Nginx
```bash
sudo nginx -t
sudo systemctl start nginx
```

### 4. Setup Auto-Renewal
```bash
echo "0 12 * * * /usr/bin/certbot renew --quiet --post-hook \"systemctl reload nginx\"" | sudo crontab -
```

## 🔧 Management Commands

### VPS Deployment Script Commands
```bash
# Test SSH connection
./deploy-vps.sh test-connection

# Full deployment
./deploy-vps.sh

# Update application
./deploy-vps.sh update

# View logs
./deploy-vps.sh logs

# Restart services
./deploy-vps.sh restart

# Check status
./deploy-vps.sh status

# Renew SSL certificate
./deploy-vps.sh ssl-renew
```

### Manual VPS Commands
```bash
# SSH into VPS
ssh -p 2222 nyxezvte@50.6.160.170

# View service logs
cd ~/agroconnect-world
docker-compose logs -f

# Restart services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart

# Update application
git pull
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

# Check service status
docker-compose ps

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🌐 Access URLs

Once deployed, your application will be available at:

- **Frontend**: https://agroconnectworld.com
- **API**: https://agroconnectworld.com/api
- **Health Check**: https://agroconnectworld.com/health

## 🔄 Git-Based Auto Deployment (Optional)

### 1. Setup Git Remote
```bash
# On VPS
cd ~/agroconnect-world
git remote set-url origin git@github.com:29rules/agroconnect-world.git

# On Local
git remote add vps ssh://nyxezvte@50.6.160.170:2222/home/nyxezvte/agroconnect-world
```

### 2. Push to Deploy
```bash
# On Local
git push vps main
```

### 3. Auto-Deploy Hook (Optional)
Create a post-receive hook on the VPS:
```bash
# On VPS
nano ~/agroconnect-world/.git/hooks/post-receive
```

Add:
```bash
#!/bin/bash
cd ~/agroconnect-world
git pull origin main
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

Make executable:
```bash
chmod +x ~/agroconnect-world/.git/hooks/post-receive
```

## 🐛 Troubleshooting

### Common Issues

#### 1. SSH Connection Failed
```bash
# Check VPS status
ping 50.6.160.170

# Test SSH
ssh -p 2222 nyxezvte@50.6.160.170

# Check firewall
sudo ufw status
```

#### 2. Services Not Starting
```bash
# Check Docker status
sudo systemctl status docker

# Check service logs
docker-compose logs

# Check disk space
df -h

# Check memory
free -h
```

#### 3. SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew --force-renewal

# Check Nginx configuration
sudo nginx -t
```

#### 4. Domain Not Resolving
```bash
# Check DNS
nslookup agroconnectworld.com

# Check Nginx status
sudo systemctl status nginx

# Check firewall
sudo ufw status
```

#### 5. Application Not Accessible
```bash
# Check if services are running
docker-compose ps

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Test local access
curl http://localhost:3000
curl http://localhost:8080/actuator/health
```

## 📊 Monitoring

### Health Checks
```bash
# Application health
curl https://agroconnectworld.com/health

# Individual service health
curl http://localhost:8081/actuator/health  # Product Service
curl http://localhost:8082/actuator/health  # Order Service
curl http://localhost:8083/actuator/health  # User Service
curl http://localhost:8084/actuator/health  # Audit Service
```

### Resource Monitoring
```bash
# Container resource usage
docker stats

# System resource usage
htop

# Disk usage
df -h

# Memory usage
free -h
```

## 🔒 Security Best Practices

### 1. Firewall Configuration
- Only allow necessary ports (22, 80, 443)
- Use UFW for easy management
- Regularly review firewall rules

### 2. SSL/TLS Security
- Use Let's Encrypt for free SSL certificates
- Enable HSTS headers
- Use strong cipher suites
- Auto-renew certificates

### 3. Application Security
- Keep system packages updated
- Use Docker for containerization
- Implement security headers
- Regular security updates

### 4. Access Control
- Use SSH keys instead of passwords
- Disable root SSH access
- Use non-standard SSH port
- Implement fail2ban (optional)

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancer for multiple VPS instances
- Implement database clustering
- Use CDN for static assets

### Vertical Scaling
- Upgrade VPS resources as needed
- Monitor resource usage
- Optimize application performance

## 🆘 Support

### Getting Help
1. Check the troubleshooting section above
2. Review service logs: `./deploy-vps.sh logs`
3. Test individual components
4. Check VPS status: `./deploy-vps.sh status`

### Useful Resources
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Ubuntu Server Guide](https://ubuntu.com/server/docs)

---

## ✅ Success Checklist

After deployment, verify:

- [ ] VPS is accessible via SSH
- [ ] Domain resolves to VPS IP
- [ ] HTTPS is working with valid certificate
- [ ] Frontend loads at https://agroconnectworld.com
- [ ] API responds at https://agroconnectworld.com/api
- [ ] Health check passes
- [ ] All services are running
- [ ] SSL certificate auto-renewal is configured
- [ ] Firewall is properly configured
- [ ] Logs are accessible and clean

🎉 **Congratulations!** Your AgroConnect World application is now deployed on VPS with SSL! 