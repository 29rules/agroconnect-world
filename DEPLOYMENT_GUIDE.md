# AgroConnect World - Deployment Guide

This guide will help you deploy the AgroConnect World project to Hostgator (frontend) and Supabase (backend), similar to the bishnoianuragsite setup.

## 🏗️ Architecture Overview

- **Frontend**: React.js deployed to Hostgator
- **Backend**: Supabase (PostgreSQL + API)
- **Database**: PostgreSQL (managed by Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (if needed)

## 📋 Prerequisites

### For Frontend (Hostgator)
- Hostgator hosting account
- Domain name (optional)
- Node.js and npm installed locally

### For Backend (Supabase)
- Supabase account
- Supabase CLI installed
- PostgreSQL knowledge (basic)

## 🚀 Step-by-Step Deployment

### 1. Backend Setup (Supabase)

#### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

#### 1.2 Deploy Backend
```bash
cd server
chmod +x deploy-supabase.sh
./deploy-supabase.sh
```

#### 1.3 Configure Environment Variables
In your Supabase dashboard, go to Settings > API and set:
- `OPENAI_API_KEY` (for AI chat functionality)
- Any other required API keys

### 2. Frontend Setup (Hostgator)

#### 2.1 Prepare Frontend
```bash
cd client
npm install
```

#### 2.2 Configure Environment Variables
Create `.env` file in the client directory:
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
REACT_APP_API_BASE_URL=https://your-project.supabase.co/rest/v1
REACT_APP_ENV=production
```

#### 2.3 Build and Deploy
```bash
chmod +x deploy.sh
./deploy.sh
```

#### 2.4 Upload to Hostgator
1. Log into your Hostgator cPanel
2. Go to File Manager
3. Navigate to `public_html`
4. Upload all files from `deploy-agroconnect-world/` directory
5. Ensure `.htaccess` is in the root directory

### 3. Domain Configuration (Optional)

#### 3.1 Point Domain to Hostgator
1. In your domain registrar, update DNS settings
2. Point A record to Hostgator's IP address
3. Add CNAME record for www subdomain

#### 3.2 SSL Certificate
1. In cPanel, go to SSL/TLS
2. Install SSL certificate for your domain
3. Force HTTPS redirect in `.htaccess`

## 🔧 Configuration Files

### Frontend Configuration
- `client/.htaccess` - Apache configuration for Hostgator
- `client/src/config/supabase.js` - Supabase client configuration
- `client/env.example` - Environment variables template

### Backend Configuration
- `server/supabase/config.toml` - Supabase project configuration
- `server/supabase/migrations/` - Database schema migrations

## 📊 Database Schema

The following tables are created automatically:

### contacts
- Stores contact form submissions
- Public insert access, admin read access

### page_visits
- Tracks website analytics
- Public insert access, admin read access

### products
- Product catalog
- Public read access, admin full access

### chat_messages
- AI chat conversation history
- Public insert access, admin read access

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- Public access policies for necessary operations
- Admin policies for full access
- CORS configured for production domains
- Security headers in `.htaccess`

## 🧪 Testing

### Backend Testing
```bash
cd server
supabase start  # Start local development
# Test your endpoints
supabase stop   # Stop local development
```

### Frontend Testing
```bash
cd client
npm start  # Test locally
npm run build  # Test build process
```

## 📈 Monitoring and Maintenance

### Supabase Dashboard
- Monitor database performance
- Check API usage
- View logs and errors
- Set up alerts

### Hostgator cPanel
- Monitor website performance
- Check error logs
- Manage SSL certificates
- Backup files

## 🔄 Continuous Deployment

### Automated Deployment Script
The deployment scripts can be integrated with CI/CD pipelines:

```bash
# Frontend deployment
cd client && ./deploy.sh

# Backend deployment
cd server && ./deploy-supabase.sh
```

### Environment Management
- Development: Local Supabase + local React
- Staging: Supabase staging project + test domain
- Production: Supabase production + live domain

## 🆘 Troubleshooting

### Common Issues

#### Frontend Issues
1. **Build fails**: Check Node.js version and dependencies
2. **API calls fail**: Verify Supabase URL and keys
3. **Routing issues**: Ensure `.htaccess` is properly configured

#### Backend Issues
1. **Migration fails**: Check database connection and permissions
2. **API errors**: Verify RLS policies and table structure
3. **Authentication issues**: Check Supabase auth configuration

### Support Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Hostgator Support](https://www.hostgator.com/support)
- [React Documentation](https://reactjs.org/docs)

## 📝 Maintenance Checklist

### Weekly
- [ ] Check Supabase dashboard for errors
- [ ] Monitor website performance
- [ ] Review security logs

### Monthly
- [ ] Update dependencies
- [ ] Backup database
- [ ] Review and update SSL certificates

### Quarterly
- [ ] Security audit
- [ ] Performance optimization
- [ ] Feature updates

## 🎉 Success!

Your AgroConnect World project is now deployed and ready for production use. The setup provides:

- ✅ Scalable backend with Supabase
- ✅ Fast frontend hosting with Hostgator
- ✅ Secure database with RLS
- ✅ Easy deployment and maintenance
- ✅ Professional monitoring and logging

For any questions or issues, refer to the troubleshooting section or contact the development team. 