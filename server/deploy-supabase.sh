#!/bin/bash

# AgroConnect World Backend Deployment Script
# For Supabase deployment

echo "🚀 Starting AgroConnect World Backend Deployment to Supabase..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed!"
    echo "📦 Installing Supabase CLI..."
    
    # Install Supabase CLI (macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install supabase/tap/supabase
    else
        echo "Please install Supabase CLI manually: https://supabase.com/docs/guides/cli"
        exit 1
    fi
fi

echo "✅ Supabase CLI found!"

# Initialize Supabase project if not already done
if [ ! -f "supabase/config.toml" ]; then
    echo "📁 Initializing Supabase project..."
    supabase init
fi

# Link to remote Supabase project (if not already linked)
if [ ! -f ".supabase/project.toml" ]; then
    echo "🔗 Linking to remote Supabase project..."
    echo "Please enter your Supabase project reference ID:"
    read -r project_ref
    
    if [ -n "$project_ref" ]; then
        supabase link --project-ref "$project_ref"
    else
        echo "❌ Project reference ID is required!"
        exit 1
    fi
fi

# Run database migrations
echo "🗄️ Running database migrations..."
supabase db push

if [ $? -ne 0 ]; then
    echo "❌ Database migration failed!"
    exit 1
fi

echo "✅ Database migrations completed!"

# Generate types for TypeScript (if using TypeScript)
echo "📝 Generating TypeScript types..."
supabase gen types typescript --local > ../client/src/types/supabase.ts

# Create deployment summary
cat > DEPLOYMENT_SUMMARY.md << EOF
# AgroConnect World Backend Deployment Summary

## Deployment Date
$(date)

## Environment
- Platform: Supabase
- Database: PostgreSQL
- API: REST + GraphQL

## Deployed Components
- ✅ Database Schema
- ✅ Row Level Security Policies
- ✅ API Endpoints
- ✅ Authentication (if configured)

## Database Tables
- contacts
- page_visits
- products
- chat_messages

## Next Steps
1. Update frontend API configuration
2. Test all endpoints
3. Configure authentication (if needed)
4. Set up monitoring and alerts

## API Endpoints
- REST API: https://your-project.supabase.co/rest/v1
- GraphQL: https://your-project.supabase.co/graphql/v1

## Environment Variables
Make sure to set these in your Supabase project:
- OPENAI_API_KEY (for AI chat functionality)
- Any other API keys needed

## Monitoring
- Check Supabase Dashboard for logs
- Monitor database performance
- Set up alerts for errors
EOF

echo "✅ Backend deployment completed!"
echo ""
echo "📋 Deployment Summary:"
echo "   - Database schema deployed"
echo "   - API endpoints available"
echo "   - TypeScript types generated"
echo ""
echo "📁 Files created:"
echo "   - DEPLOYMENT_SUMMARY.md"
echo "   - ../client/src/types/supabase.ts"
echo ""
echo "🎉 Backend ready for production!" 