# AgroConnect World - SSH Deployment Summary

## Deployment Date
Thu Jul 31 20:54:28 EDT 2025

## Deployment Details
- **Method**: SSH via rsync
- **Host**: 50.6.160.170
- **User**: nyxezvte
- **Path**: /home/nyxezvte/public_html
- **Backup**: backup-20250731-205422.tar.gz

## Files Deployed
- ✅ React build files
- ✅ .htaccess configuration
- ✅ Static assets (CSS, JS, images)
- ✅ Deployment information

## Next Steps
1. Test the website at: https://50.6.160.170
2. Verify all functionality works
3. Check error logs if needed
4. Monitor performance

## Backup Information
- Backup location: /home/nyxezvte/backups/backup-20250731-205422.tar.gz
- To restore: `tar -xzf /home/nyxezvte/backups/backup-20250731-205422.tar.gz -C /home/nyxezvte/public_html`

## SSH Commands for Maintenance
```bash
# Connect to server
ssh -p 2222 nyxezvte@50.6.160.170

# View logs
tail -f /home/nyxezvte/public_html/error_log

# Check disk space
df -h

# List files
ls -la /home/nyxezvte/public_html
```

## Troubleshooting
- If site doesn't load: Check DNS and SSL settings
- If API calls fail: Verify Supabase configuration
- If permissions issues: Run chmod commands manually
