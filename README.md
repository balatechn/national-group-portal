# National Group Portal

A modern IT request portal built with SvelteKit, featuring glassmorphism design, Zoho app integration, and an intelligent chat agent.

## Features

- 🏢 **Professional Portal Design** - Glassmorphism UI with golden National Group branding
- 📝 **IT Request Form** - Typeform-style interactive request submission
- 🔗 **Zoho Integration** - Direct access to all Zoho applications (.in domain)
- 💬 **Chat Agent** - Intelligent IT support chat widget
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🔍 **Contact Page** - IT helpdesk contact information

## Deployment on Vercel

### Prerequisites
1. A Vercel account at [vercel.com](https://vercel.com)
2. A Turso database account (for production SQLite database)

### Step 1: Set up Production Database
1. Go to [turso.tech](https://turso.tech) and create a free account
2. Create a new database: `turso db create national-group-portal`
3. Get the database URL: `turso db show national-group-portal --url`
4. Generate an auth token: `turso db tokens create national-group-portal`

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy the project
vercel

# Set environment variables
vercel env add DATABASE_URL
# Enter your Turso database URL when prompted
```

#### Option B: Deploy via Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Framework Preset: **SvelteKit**
5. Build Command: `npm run build`
6. Output Directory: `build`
7. Install Command: `npm install`

### Step 3: Configure Environment Variables
In your Vercel project dashboard:
1. Go to Settings → Environment Variables
2. Add the following variables:
   - `DATABASE_URL`: Your Turso database URL

### Step 4: Update Database Schema
After deployment, run database migrations:
```bash
# If using Vercel CLI
vercel env pull .env.local
npm run db:push
```

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy environment variables: `cp .env.example .env`
4. Update `.env` with your database URL
5. Push database schema: `npm run db:push`
6. Start development server: `npm run dev`
