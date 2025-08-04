# 🚀 VPS Quick Deployment

## One Command Deployment
```bash
./deploy-vps.sh
```

## VPS Configuration
- **VPS**: 50.6.160.170:2222
- **User**: nyxezvte
- **Domain**: agroconnectworld.com
- **Path**: ~/agroconnect-world

## Quick Commands
```bash
# Test connection
./deploy-vps.sh test-connection

# Update application
./deploy-vps.sh update

# View logs
./deploy-vps.sh logs

# Restart services
./deploy-vps.sh restart

# Check status
./deploy-vps.sh status

# Renew SSL
./deploy-vps.sh ssl-renew
```

## Manual SSH Commands
```bash
# Connect to VPS
ssh -p 2222 nyxezvte@50.6.160.170

# View logs
cd ~/agroconnect-world && docker-compose logs -f

# Restart services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart

# Update app
git pull && docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

## Access URLs
- **Frontend**: https://agroconnectworld.com
- **API**: https://agroconnectworld.com/api
- **Health**: https://agroconnectworld.com/health

## Troubleshooting
```bash
# Check services
docker-compose ps

# Check Nginx
sudo systemctl status nginx

# Check SSL
sudo certbot certificates

# Check firewall
sudo ufw status
```

---
**Full Guide**: See `VPS_DEPLOYMENT_GUIDE.md` 