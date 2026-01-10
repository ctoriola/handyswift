# 🚀 Vercel Deployment Guide

This guide walks you through deploying HandySwift to Vercel.

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  Vercel (Frontend)                                  │
│  • React + TypeScript + Vite                        │
│  • Automatic deployments on git push                │
│  • CDN + Automatic caching                          │
│  • Environment variables managed in dashboard       │
└──────────────────┬──────────────────────────────────┘
                   │ API Calls
                   │
     ┌─────────────▼──────────────────────┐
     │  Backend (Deploy separately)        │
     │  • Heroku, Railway, Render, etc.    │
     │  • Node.js + Express.js             │
     │  • PostgreSQL (Supabase)            │
     └──────────────────────────────────────┘
```

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub account with your HandySwift repository
- Vercel account (https://vercel.com)
- Backend deployed and running
- Supabase project set up

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: HandySwift ready for production"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/handyswift.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click "New Project"
3. Find your `handyswift` repository and click "Import"
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (current directory)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables:
   ```
   VITE_API_URL = https://YOUR_BACKEND_URL/api
   ```
6. Click "Deploy"

Vercel will build and deploy automatically. Your frontend is now live! 🎉

### Step 3: Update Environment Variables

In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add:
   ```
   VITE_API_URL=https://your-backend.com/api
   ```
3. Redeploy to apply changes

## Backend Deployment

### Option 1: Vercel (Same as Frontend - Easiest!)

1. Go to https://vercel.com
2. Create new project
3. Select `backend` directory as root
4. Framework: **Node.js**
5. Environment Variables:
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   JWT_SECRET=generate_random_secret_here
   CORS_ORIGIN=https://your-vercel-frontend-domain.vercel.app
   ```
6. Deploy

**Pros**:
- ✅ One platform for frontend + backend
- ✅ Easier to manage
- ✅ Free tier available
- ✅ Same deployment experience

**Cons**:
- Serverless functions have cold start times (~1-2s first request)

### Option 2: Railway (Alternative)

1. Go to https://railway.app
2. Create new project
3. Connect GitHub repo
4. Select `backend` directory
5. Add environment variables:
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   JWT_SECRET=generate_random_secret_here
   PORT=3000
   NODE_ENV=production
   CORS_ORIGIN=https://your-vercel-domain.vercel.app
   ```
6. Deploy

### Option 3: Heroku

1. Create Heroku account at https://heroku.com
2. Create new app
3. Connect to GitHub
4. Add buildpacks:
   - `heroku/nodejs`
5. Set environment variables in Settings
6. Deploy from main branch

### Option 4: Render

1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repo
4. Configure:
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm run start`
   - Root Directory: `.`
5. Add environment variables
6. Deploy

## Production Checklist

### Frontend (Vercel)
- [ ] Repository pushed to GitHub
- [ ] Vercel project created and deployed
- [ ] `VITE_API_URL` points to production backend
- [ ] Environment shows "Ready" status
- [ ] Website accessible at vercel domain
- [ ] Custom domain configured (optional)

### Backend
- [ ] Deployed to Railway/Heroku/Render
- [ ] All environment variables set correctly
- [ ] Database tables created in Supabase
- [ ] CORS_ORIGIN includes Vercel domain
- [ ] JWT_SECRET is secure and unique
- [ ] Health check endpoint working: `GET /health`

### Database (Supabase)
- [ ] All 10 tables created
- [ ] Row Level Security enabled
- [ ] Indexes created for performance
- [ ] Backups configured
- [ ] Connection limits set appropriately

### Testing
- [ ] User registration works end-to-end
- [ ] User login works
- [ ] Provider registration with category works
- [ ] Job posting works
- [ ] Provider sees available jobs
- [ ] Category update works
- [ ] All API endpoints return 200/201 for success

## Environment Variables Reference

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend (.env)
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
PORT=3000
NODE_ENV=production
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRY=24h
CORS_ORIGIN=https://your-vercel-domain.vercel.app
```

## Monitoring & Debugging

### Vercel
- Logs: https://vercel.com/dashboard → Project → Deployments
- Real-time logs: Click on deployment
- Errors shown in browser console

### Backend (Railway/Heroku)
- Logs: Application dashboard
- Monitor: CPU, Memory, Network usage
- Restart service if needed

### Database (Supabase)
- Go to SQL Editor to check queries
- Monitor: Storage usage, connections
- View logs: Logs panel

## Custom Domain Setup (Optional)

### Add Custom Domain to Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Wait for SSL certificate (2-48 hours)

### Add Custom Domain to Backend
1. In Railway/Heroku, go to Settings
2. Add custom domain
3. Update CORS_ORIGIN in environment variables
4. Update frontend VITE_API_URL

## Automatic Deployments

### Frontend (Vercel)
- Every push to `main` branch triggers deployment
- Preview deployments for pull requests
- Rollback to previous version if needed

### Backend
- Railway/Heroku auto-deploys on push to main
- View deployment logs in dashboard

## Rollback Instructions

### Vercel
1. Go to Deployments
2. Click on previous deployment
3. Click "Redeploy"

### Backend
1. In Railway/Heroku dashboard
2. Select previous deployment
3. Redeploy

## Performance Optimization

### Frontend
- ✅ Code splitting enabled (vendor, ui, charts chunks)
- ✅ Tree-shaking removes unused code
- ✅ Minification enabled
- ✅ CDN caching optimized

### Recommendations
- [ ] Enable caching headers in Vercel config
- [ ] Use image optimization for next update
- [ ] Set up error tracking (Sentry)
- [ ] Monitor Core Web Vitals
- [ ] Set up analytics

## Troubleshooting

### "Failed to fetch" errors
**Problem**: Frontend can't reach backend  
**Solution**: 
1. Check backend is running
2. Verify VITE_API_URL in Vercel environment
3. Check CORS_ORIGIN in backend .env
4. View browser console for exact error

### Build fails on Vercel
**Problem**: npm run build fails  
**Solution**:
1. Check Vercel logs for error message
2. Ensure all TypeScript errors are fixed
3. Run `npm run build` locally to reproduce
4. Check node version: `node --version`

### 504 Gateway Timeout
**Problem**: Backend requests timeout  
**Solution**:
1. Check if backend is running
2. Increase backend timeout in Vercel config
3. Check database connection limits
4. Monitor backend logs for slow queries

### Environment variables not working
**Problem**: Environment variable is undefined  
**Solution**:
1. Verify variable is set in Vercel dashboard
2. Ensure variable name is correct
3. Redeploy after adding variable
4. Check if variable needs `VITE_` prefix (frontend)

## Cost Estimation

### Vercel
- Free tier: 100 GB bandwidth/month
- Paid: $20/month for unlimited

### Railway/Heroku/Render
- Heroku: Shutting down free tier
- Railway: $5/month starter plan
- Render: Free tier available

### Supabase
- Free tier: 500 MB storage, 1 GB bandwidth
- Pro: $25/month, 8 GB storage, 50 GB bandwidth

## Support

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Supabase Docs: https://supabase.com/docs
- Express Docs: https://expressjs.com

---

**Need Help?**
1. Check deployment logs
2. Verify environment variables
3. Test endpoints with Postman
4. Check Supabase connection
5. Review GitHub issues for known problems
