# 🚀 Vercel Deployment Guide for National Group Portal

## Quick Deployment Steps

### 1. Prepare Your Repository
Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect SvelteKit
5. Click "Deploy"

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to your Vercel account
vercel login

# Deploy from your project directory
cd /path/to/your/project
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? Select your account
# - Link to existing project? N
# - Project name? national-group-portal
# - In which directory? ./
# - Override settings? N
```

### 3. Configure Environment Variables

After deployment, set up your environment variables:

1. Go to your project dashboard on Vercel
2. Navigate to Settings → Environment Variables
3. Add the following variables:

**For Production Database (Recommended - Turso):**
```
DATABASE_URL = libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN = your-auth-token
```

**For Simple SQLite (Development only):**
```
DATABASE_URL = file:./local.db
```

### 4. Set Up Production Database (Recommended)

#### Using Turso (Free SQLite hosting):
```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create account and login
turso auth signup
turso auth login

# Create database
turso db create national-group-portal --location bom # Mumbai region

# Get database URL
turso db show national-group-portal --url

# Create auth token
turso db tokens create national-group-portal
```

### 5. Update Environment Variables in Vercel
1. Copy the database URL and auth token from Turso
2. Add them to your Vercel project environment variables
3. Redeploy your project

### 6. Initialize Database Schema
After setting environment variables, trigger a new deployment or run:
```bash
# If you have Vercel CLI
vercel env pull .env.local
npm run db:push
```

## Project Configuration

Your project is already configured with:
- ✅ `@sveltejs/adapter-auto` for automatic platform detection
- ✅ `vercel.json` configuration for optimal performance
- ✅ Environment variable setup for database
- ✅ Build optimization for production

## Vercel Project Settings

The following settings are automatically configured:
- **Framework**: SvelteKit
- **Build Command**: `npm run build`
- **Output Directory**: `.svelte-kit/output`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

## Domain Configuration

### Custom Domain (Optional)
1. Go to your Vercel project dashboard
2. Navigate to Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed

### Suggested Domains:
- `portal.nationalgroupindia.com`
- `it.nationalgroupindia.com`
- `internal.nationalgroupindia.com`

## Performance Optimizations

Your deployment includes:
- 🌏 **Mumbai Region (bom1)** for optimal India performance
- 📦 **Automatic code splitting** and optimization
- 🗜️ **Gzip compression** for faster loading
- 🎯 **CDN distribution** via Vercel Edge Network

## Monitoring & Analytics

Enable Vercel Analytics:
1. Go to your project dashboard
2. Navigate to Analytics tab
3. Enable Web Analytics
4. Track user engagement and performance

## Troubleshooting

### Common Issues:

**Build Fails:**
- Check environment variables are set
- Ensure all dependencies are in `package.json`
- Review build logs in Vercel dashboard

**Database Connection Issues:**
- Verify `DATABASE_URL` is correctly set
- Check if Turso database is accessible
- Ensure auth token is valid

**404 Errors:**
- Check SvelteKit routing configuration
- Verify all routes are properly defined

## Security Considerations

✅ **Environment Variables**: Sensitive data stored securely
✅ **CSRF Protection**: Enabled in SvelteKit configuration  
✅ **Database Security**: Using secure connection strings
✅ **HTTPS**: Automatically enabled by Vercel

## Support

If you encounter any deployment issues:
1. Check Vercel deployment logs
2. Review this guide's troubleshooting section
3. Contact IT support: ithelpdesk@nationalgroupindia.com

---

🎉 **Your National Group Portal is now live on Vercel!**

Access your deployed application at: `https://your-project-name.vercel.app`
