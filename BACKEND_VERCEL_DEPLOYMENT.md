# 🚀 Deploy Backend on Vercel

Yes! You can deploy your Express.js backend on Vercel using the **Node.js runtime**. Here's how:

## Quick Setup (5 minutes)

### 1. Prepare the Backend

The backend is already Vercel-ready! Just ensure:
- ✅ `backend/package.json` exists
- ✅ `backend/src/index.ts` is the entry point
- ✅ `backend/tsconfig.json` exists
- ✅ `backend/vercel.json` configured (just created)

### 2. Push to GitHub

Make sure your backend is in the same repository:
```bash
cd backend
git add .
git commit -m "Backend ready for Vercel"
git push origin main
```

### 3. Deploy to Vercel

**Option A: Using Vercel Dashboard (Easiest)**

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Select your GitHub repository
4. **Set root directory to `backend/`** (IMPORTANT!)
5. Framework: **Node.js**
6. **DO NOT add environment variables during initial deployment**
7. Click "Deploy"
8. Wait for deployment to complete
9. After deployment:
   - Go to **Settings → Environment Variables**
   - Add each variable below (see list in next section)
   - Click "Redeploy" to apply variables

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy backend
cd backend
vercel --prod

# Follow the prompts
```

---

## Environment Variables for Backend

In Vercel Dashboard, add these under **Settings → Environment Variables**:

**Click "Add New" for EACH variable:**

1. **SUPABASE_URL**
   - Value: `https://xxxxx.supabase.co` (your actual Supabase URL)

2. **SUPABASE_ANON_KEY**
   - Value: `eyJhbGci...` (your Supabase Anon Key)

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Value: `eyJhbGci...` (your Service Role Key)

4. **JWT_SECRET**
   - Value: `random-string-32-characters-or-more`

5. **CORS_ORIGIN**
   - Value: `https://your-frontend-domain.vercel.app`

6. **NODE_ENV**
   - Value: `production`

7. **PORT**
   - Value: `3000`

**After adding all variables:**
1. Go to **Deployments** tab
2. Click your latest deployment
3. Click **"Redeploy"** button
4. Wait for redeployment to complete

---

## Update Frontend

After backend deployment, update your **frontend** environment:

1. Go to Frontend Vercel Project → Settings → Environment Variables
2. Update `VITE_API_URL`:
   ```
   VITE_API_URL=https://your-backend-domain.vercel.app/api
   ```
3. Click "Save"
4. Redeploy frontend: Click "Deployments" → Latest → "Redeploy"

---

## Verify Deployment

Test your backend is working:

```bash
# Check health endpoint
curl https://your-backend-domain.vercel.app/health

# Should return:
# {"status":"ok","message":"Server is running"}
```

---

## Pros & Cons

### ✅ Pros (Using Vercel for Both)
- One platform to manage
- Same team, same dashboard
- Integrated logs and monitoring
- Free tier includes both
- Easy environment management
- Automatic deployments on push
- Custom domains on both

### ⚠️ Cons
- Cold starts on serverless (~1-2 seconds on first request)
- Can't run infinite loops
- Memory limit of 512MB (usually fine)

### When to Use Alternative Platforms
- High traffic app (use Railway/Render for always-on backend)
- Long-running jobs (use Railway)
- Specific database needs (use Heroku)

---

## Vercel Backend Pricing

- **Free Tier**:
  - 100 requests/day
  - 512MB memory per function
  - 10 seconds max execution time
  - Good for development

- **Pro Tier** ($20/month):
  - Unlimited requests
  - Better performance
  - Priority support
  - Good for production

---

## Full Vercel Stack

If you deploy both on Vercel, your full stack looks like:

```
┌─────────────────────────────────────────┐
│  Vercel Account                         │
├─────────────────────┬───────────────────┤
│  Frontend Project   │ Backend Project    │
│  (React + Vite)     │ (Express.js)       │
│  Domain: app.xxx    │ Domain: api.xxx    │
└─────────────────────┴───────────────────┘
              ↓
         Git Push
              ↓
      Auto-Deployed!
```

---

## Alternative: Keep Backend Separate

If you prefer, you can still use:
- **Frontend**: Vercel
- **Backend**: Railway (easiest alternative)

Just follow the Railway instructions in VERCEL_DEPLOYMENT.md

---

## Troubleshooting

### Backend Deploy Fails
1. Check Vercel logs: https://vercel.com/dashboard
2. Make sure root directory is set to `backend/`
3. Verify environment variables are set
4. Try: `cd backend && npm run build`

### "Cannot find module" errors
- Ensure all dependencies in `backend/package.json`
- Run `npm install` in backend folder

### API calls fail from frontend
- Check `VITE_API_URL` in frontend environment
- Verify backend URL is correct
- Check CORS_ORIGIN in backend .env

### Cold start is too slow
- This is normal for serverless (~1-2 seconds)
- Switch to Railway if you need faster response

---

## Next Steps

1. ✅ Add environment variables to Vercel backend project
2. ✅ Deploy backend
3. ✅ Get backend URL from Vercel
4. ✅ Update `VITE_API_URL` in frontend
5. ✅ Redeploy frontend
6. ✅ Test end-to-end

---

**Status**: ✅ Backend Ready for Vercel  
**Time to Deploy**: 5-10 minutes  
**Difficulty**: Easy  

Good to go! 🚀
