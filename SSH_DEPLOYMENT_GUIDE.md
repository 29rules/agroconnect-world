# 🚀 AgroConnect World - SSH Deployment Guide for Hostgator

This guide will help you deploy your AgroConnect World frontend to Hostgator using SSH access, providing secure and efficient deployment.

## 📋 Prerequisites

### Required Tools
- SSH access enabled on your Hostgator account
- SSH client (built into macOS/Linux, PuTTY for Windows)
- rsync (for efficient file transfers)
- Your Hostgator SSH credentials

### Hostgator Setup
1. **Enable SSH Access**:
   - Log into your Hostgator cPanel
   - Go to "SSH Access" or "Terminal"
   - Enable SSH access for your account
   - Note your SSH username and port

2. **Get SSH Credentials**:
   - SSH Host: Your domain name or server IP
   - SSH User: Your cPanel username
   - SSH Port: Usually 22 (or custom port if configured)
   - Password: Your cPanel password

## 🔧 Initial Setup

### 1. Run SSH Setup Script
```bash
cd client
chmod +x ssh-setup.sh
./ssh-setup.sh
```

This script will:
- Prompt for your SSH credentials
- Test the SSH connection
- Create the configuration file
- Install rsync if needed
- Generate SSH key setup instructions

### 2. Configure SSH Credentials
The script creates `ssh-config.txt` with your credentials:
```bash
SSH_HOST=your-domain.com
SSH_USER=your-cpanel-username
SSH_PORT=22
REMOTE_PATH=/home/your-cpanel-username/public_html
BACKUP_PATH=/home/your-cpanel-username/backups
```

## 🚀 Deployment Process

### 1. Deploy via SSH
```bash
chmod +x deploy-ssh.sh
./deploy-ssh.sh
```

This script will:
- Build your React application
- Create a backup of the current site
- Upload files via SSH using rsync
- Set proper file permissions
- Generate deployment summary

### 2. What Gets Deployed
- ✅ React build files (HTML, CSS, JS)
- ✅ Static assets (images, fonts)
- ✅ `.htaccess` configuration
- ✅ Deployment information

## 🔒 Security Features

### SSH Key Authentication (Recommended)
For enhanced security, set up SSH key authentication:

1. **Generate SSH Key**:
   ```bash
   ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
   ```

2. **Add Key to Hostgator**:
   ```bash
   # Copy your public key
   cat ~/.ssh/id_rsa.pub
   
   # SSH into Hostgator and add the key
   ssh your-username@your-domain.com
   mkdir -p ~/.ssh
   echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **Update Configuration**:
   Uncomment and update in `ssh-config.txt`:
   ```bash
   SSH_KEY_PATH=~/.ssh/id_rsa
   ```

## 🛠️ Maintenance Tools

### SSH Maintenance Script
```bash
chmod +x ssh-maintenance.sh
./ssh-maintenance.sh
```

This provides a menu-driven interface for:
- Server status monitoring
- Log viewing and monitoring
- Backup creation and restoration
- File permission management
- SSL certificate checking
- Real-time log monitoring

### Available Maintenance Options
1. **Server Status** - Uptime, users, processes
2. **Disk Space** - Storage usage
3. **Error Logs** - View recent errors
4. **Access Logs** - View visitor logs
5. **File Permissions** - Check file security
6. **Create Backup** - Manual backup creation
7. **List Backups** - View available backups
8. **Restore Backup** - Restore from backup
9. **SSL Certificate** - Check SSL status
10. **Real-time Logs** - Live log monitoring
11. **Database Connections** - Check DB status
12. **Website Files** - List deployed files
13. **Website Response** - Test site response
14. **Cron Jobs** - View scheduled tasks
15. **System Resources** - CPU, memory usage

## 📊 Monitoring and Logs

### Log Locations
- **Error Logs**: `/home/username/public_html/error_log`
- **Access Logs**: `/home/username/public_html/access_log`
- **Backups**: `/home/username/backups/`

### Real-time Monitoring
```bash
# Monitor error logs in real-time
ssh username@domain.com "tail -f /home/username/public_html/error_log"

# Monitor access logs in real-time
ssh username@domain.com "tail -f /home/username/public_html/access_log"
```

## 🔄 Automated Deployment

### Cron Job for Auto-Deployment
Set up automatic deployment using cron:

1. **Create Deployment Script**:
   ```bash
   #!/bin/bash
   cd /path/to/your/project/client
   ./deploy-ssh.sh
   ```

2. **Add to Cron**:
   ```bash
   # Edit crontab
   crontab -e
   
   # Add line for daily deployment at 2 AM
   0 2 * * * /path/to/deployment-script.sh
   ```

### CI/CD Integration
The SSH deployment can be integrated with CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Deploy to Hostgator
  run: |
    cd client
    chmod +x deploy-ssh.sh
    ./deploy-ssh.sh
```

## 🆘 Troubleshooting

### Common SSH Issues

**Connection Refused**
- Check if SSH is enabled in cPanel
- Verify port number (usually 22)
- Check firewall settings

**Authentication Failed**
- Verify username and password
- Check if account is suspended
- Try SSH key authentication

**Permission Denied**
- Check file permissions on server
- Verify SSH user has access to public_html
- Contact Hostgator support

### Deployment Issues

**Build Fails**
```bash
cd client
npm install
npm run build
```

**Upload Fails**
- Check SSH connection
- Verify disk space on server
- Check file permissions

**Site Not Loading**
- Check DNS settings
- Verify SSL certificate
- Check error logs

## 📈 Performance Optimization

### File Compression
The `.htaccess` file includes:
- Gzip compression for text files
- Browser caching for static assets
- Security headers

### CDN Integration
Consider using a CDN for better performance:
- Cloudflare (free tier available)
- AWS CloudFront
- Hostgator's built-in CDN

## 🔄 Backup Strategy

### Automatic Backups
- Backups created before each deployment
- Stored in `/home/username/backups/`
- Timestamped with deployment date

### Manual Backups
```bash
# Create manual backup
ssh username@domain.com "tar -czf /home/username/backups/manual-backup-$(date +%Y%m%d).tar.gz -C /home/username/public_html ."
```

### Restore from Backup
```bash
# Restore specific backup
ssh username@domain.com "cd /home/username/public_html && tar -xzf /home/username/backups/backup-name.tar.gz"
```

## 📞 Support

### Hostgator Support
- **24/7 Live Chat**: Available in cPanel
- **Phone Support**: Check Hostgator website
- **Knowledge Base**: Hostgator help center

### SSH Documentation
- [Hostgator SSH Guide](https://www.hostgator.com/help/article/ssh-access)
- [SSH Key Setup](https://www.hostgator.com/help/article/ssh-keys)

## 🎉 Success!

Your AgroConnect World frontend is now deployed via SSH to Hostgator with:
- ✅ Secure SSH deployment
- ✅ Automated backup system
- ✅ Comprehensive maintenance tools
- ✅ Real-time monitoring capabilities
- ✅ Performance optimization
- ✅ Easy rollback options

**Next Steps**:
1. Test your website thoroughly
2. Set up monitoring alerts
3. Configure SSL certificate
4. Set up automated backups
5. Monitor performance metrics

For ongoing maintenance, use the `ssh-maintenance.sh` script for easy server management. 