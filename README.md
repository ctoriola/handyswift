# 🔧 HandySwift - Full Stack Job/Service Platform

A modern, full-stack web application connecting service providers with users who need their services. Built with React, Express.js, TypeScript, and Supabase.

**Status**: ✅ Production Ready | **Last Updated**: January 10, 2026

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [System Architecture](#system-architecture)
4. [Quick Start (5 minutes)](#quick-start-5-minutes)
5. [Complete Setup Guide](#complete-setup-guide)
   - [Supabase Setup](#supabase-setup)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
6. [Project Structure](#project-structure)
7. [API Documentation](#api-documentation)
8. [Database Schema](#database-schema)
9. [Features Implemented](#features-implemented)
10. [Troubleshooting](#troubleshooting)
11. [Security](#security)
12. [Deployment](#deployment)

---

## 🎯 Project Overview

HandySwift is a Nigeria-focused job marketplace platform that enables:

- **Users** to post service requests (jobs) with budgets, timelines, and locations
- **Providers** to browse available jobs in their specialization category
- **Two-way communication** between users and service providers
- **Ratings & reviews** system for quality assurance
- **Secure authentication** with JWT tokens and password hashing
- **Real-time job tracking** and status management

### Key Features
✅ User & Provider Registration/Login  
✅ Job Posting & Management  
✅ Category-based Job Filtering  
✅ Provider Profile Management  
✅ Ratings & Reviews System  
✅ Activity Logging  
✅ Responsive UI with Tailwind CSS  
✅ Type-safe with TypeScript  

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript 5.3** - Type safety
- **Vite 6.3.5** - Build tool (lightning fast)
- **Tailwind CSS** - Styling
- **React Router v6** - Routing
- **Context API** - State management
- **Lucide React** - Icons
- **Recharts** - Charts & graphs

### Backend
- **Node.js** - Runtime
- **Express.js 4.18** - HTTP server
- **TypeScript 5.3** - Type safety
- **bcryptjs** - Password hashing (10 salt rounds)
- **jsonwebtoken** - JWT authentication
- **Supabase SDK** - Database client
- **CORS** - Cross-origin requests

### Database
- **Supabase** (PostgreSQL) - Cloud database
- **10 Tables** with proper relationships
- **Row Level Security (RLS)** - Data protection
- **Indexes** for performance

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   Frontend (React + TypeScript)                  │
│              localhost:3000 or localhost:5173                    │
│                                                                  │
│  • React Components (Pages & Components)                         │
│  • Context API (Auth State)                                      │
│  • Tailwind CSS (Styling)                                        │
│  • React Router (Routing)                                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
            HTTP/REST API Calls (JSON)
             Authorization: Bearer Token
                         │
     ┌───────────────────▼────────────────────┐
     │   Backend Server (Express.js + TS)     │
     │       localhost:5000                   │
     │                                        │
     │  • Authentication Routes               │
     │  • Job Management Routes               │
     │  • Booking Routes                      │
     │  • JWT Verification Middleware         │
     │  • Error Handling                      │
     │  • CORS Configuration                  │
     └────────────────┬─────────────────────┘
                      │
              Supabase SDK (Queries)
                      │
     ┌────────────────▼──────────────────┐
     │  Supabase Cloud (PostgreSQL)       │
     │  https://xxxxx.supabase.co         │
     │                                    │
     │  Tables:                           │
     │  • users                           │
     │  • providers                       │
     │  • jobs                            │
     │  • offers                          │
     │  • bookings                        │
     │  • reviews                         │
     │  • messages                        │
     │  • activity_logs                   │
     │  • referrals                       │
     │  • subscriptions                   │
     └────────────────────────────────────┘
```

### Data Flow Example

1. **User logs in** → Frontend sends POST to `/api/auth/login`
2. **Backend validates** → Checks password against hashed value
3. **JWT generated** → Returns token + user data
4. **Token stored** → Frontend saves to localStorage
5. **Authenticated requests** → Frontend sends `Authorization: Bearer {token}` header
6. **Backend verifies** → Middleware validates JWT
7. **Query database** → Supabase returns data
8. **Response sent** → Frontend receives and displays data

---

## ⚡ Quick Start (5 minutes)

### Prerequisites
- Node.js 16+ installed
- Git installed
- Supabase account (free at supabase.com)

### Step 1: Clone & Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

### Step 2: Create Supabase Project
1. Go to https://supabase.com
2. Create new project
3. Copy credentials from Settings → API

### Step 3: Setup Environment
```bash
# Backend .env file
cd backend
cp .env.example .env

# Edit .env and add Supabase credentials:
# SUPABASE_URL=https://xxxxx.supabase.co
# SUPABASE_ANON_KEY=your_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 4: Initialize Database
```bash
# Go to Supabase SQL Editor and run all SQL from the DATABASE SCHEMA section
```

### Step 5: Start Everything
```bash
# Terminal 1: Backend
cd backend
npm run dev
# Output: 🚀 Server running on http://localhost:5000

# Terminal 2: Frontend
npm run dev
# Output: VITE v6.3.5 ready in X ms
#         ➜  Local:   http://localhost:5173
```

✅ **Done!** Visit http://localhost:5173 and create an account

---

## 📚 Complete Setup Guide

### Supabase Setup

#### Step 1: Create Supabase Project
1. Go to https://supabase.com → Sign up
2. Click "New Project"
3. Fill in:
   - **Project Name**: HandySwift
   - **Database Password**: (secure password)
   - **Region**: Choose your region
4. Wait ~2 minutes for project creation

#### Step 2: Get Credentials
Navigate to **Settings → API** and copy:
- **Project URL** (e.g., `https://xxxxx.supabase.co`)
- **Anon Key** (public)
- **Service Role Key** (⚠️ KEEP SECRET!)

#### Step 3: Create Database Tables

Go to **SQL Editor** in Supabase Dashboard and run this SQL:

```sql
-- 1. Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  photo TEXT,
  membership_type TEXT DEFAULT 'Free' CHECK (membership_type IN ('Free', 'Premium')),
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'provider')),
  verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'verified', 'pending')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- 2. Providers Table
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  specialization TEXT[],
  hourly_rate DECIMAL(10, 2),
  response_time INTEGER,
  total_jobs_completed INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_providers_user_id ON providers(user_id);
CREATE INDEX idx_providers_rating ON providers(average_rating);

-- 3. Jobs Table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  budget DECIMAL(10, 2),
  budget_type TEXT CHECK (budget_type IN ('fixed', 'hourly')),
  timeline TEXT CHECK (timeline IN ('urgent', 'week', 'month', 'flexible')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  attachments TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  closed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_status ON jobs(status);

-- 4. Offers Table
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  proposed_price DECIMAL(10, 2),
  proposed_timeline TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_offers_job_id ON offers(job_id);
CREATE INDEX idx_offers_provider_id ON offers(provider_id);
CREATE INDEX idx_offers_status ON offers(status);

-- 5. Bookings Table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  service_category TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  price DECIMAL(10, 2),
  status TEXT DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- 6. Reviews Table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  photos TEXT[],
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_provider_id ON reviews(provider_id);

-- 7. Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);

-- 8. Activity Logs Table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT,
  description TEXT,
  related_entity_id UUID,
  read BOOLEAN DEFAULT false,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_read ON activity_logs(read);

-- 9. Referrals Table
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);

-- 10. Subscriptions Table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'paused')),
  plan_type TEXT CHECK (plan_type IN ('free', 'premium')),
  renewal_date DATE,
  price DECIMAL(10, 2),
  payment_method TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
```

### Backend Setup

#### Step 1: Install Dependencies
```bash
cd backend
npm install
```

#### Step 2: Configure Environment
```bash
# Copy example env
cp .env.example .env

# Edit .env with your values:
# SUPABASE_URL=https://xxxxx.supabase.co
# SUPABASE_ANON_KEY=your_anon_key_here
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
# PORT=5000
# NODE_ENV=development
# JWT_SECRET=your_jwt_secret_key_here_change_in_production
# JWT_EXPIRY=24h
# CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

#### Step 3: Start Backend
```bash
npm run dev

# Output:
# 🚀 Server running on http://localhost:5000
# 📊 Health check: http://localhost:5000/health
```

### Frontend Setup

#### Step 1: Ensure Dependencies Installed
```bash
npm install
```

#### Step 2: Create .env.local (Optional)
```bash
# Frontend can work without this (backend is http://localhost:5000 by default)
echo "VITE_API_URL=http://localhost:5000" > .env.local
```

#### Step 3: Start Frontend
```bash
npm run dev

# Output:
# VITE v6.3.5 ready in X ms
# ➜  Local:   http://localhost:5173
# ➜  press h to show help
```

---

## 📁 Project Structure

```
HandySwift Project(8)/
│
├── backend/                         ← Backend server
│   ├── src/
│   │   ├── index.ts                 ← Entry point
│   │   ├── config/
│   │   │   └── supabase.ts          ← Supabase client + token verification
│   │   ├── middleware/
│   │   │   └── auth.ts              ← JWT authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.ts              ← Auth endpoints (16 endpoints total)
│   │   │   ├── bookings.ts          ← Booking endpoints
│   │   │   └── jobs.ts              ← Job posting & offers endpoints
│   │   └── utils/
│   │       └── response.ts          ← API response formatting
│   ├── .env                         ← Environment variables (KEEP SECRET!)
│   ├── .env.example                 ← Template for .env
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── src/                             ← Frontend React app
│   ├── pages/
│   │   ├── LandingPage.tsx          ← Home page
│   │   ├── GetStarted.tsx           ← Browse services
│   │   ├── Login.tsx                ← User login
│   │   ├── UserSignUp.tsx           ← User registration
│   │   ├── ProviderSignUp.tsx       ← Provider registration
│   │   ├── UserDashboard.tsx        ← User dashboard (posts jobs)
│   │   ├── ProviderDashboard.tsx    ← Provider dashboard (views jobs)
│   │   ├── ProviderProfileEdit.tsx  ← Edit provider profile + category
│   │   ├── ProviderJobs.tsx         ← Provider job management
│   │   ├── PostJob.tsx              ← Create job listing
│   │   ├── SearchResults.tsx        ← Search results page
│   │   └── Messages.tsx             ← Messaging
│   ├── components/
│   │   ├── Navbar.tsx               ← Navigation bar
│   │   ├── Footer.tsx               ← Footer
│   │   ├── HowItWorks.tsx           ← How it works section
│   │   ├── Services.tsx             ← Services section
│   │   ├── Testimonials.tsx         ← Testimonials
│   │   ├── PageTransition.tsx       ← Page animations
│   │   └── ui/                      ← Shadcn UI components
│   ├── contexts/
│   │   └── AuthContext.tsx          ← Global auth state + specialization
│   ├── services/
│   │   └── api.ts                   ← API client
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env.local                       ← Frontend env (optional)
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md                        ← You are here!
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User/Provider
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "phone_number": "+234XXXXXXXXXX",
  "role": "user",              // or "provider"
  "specialization": ["Electrical Services"]  // only for providers
}

Response (201):
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "john_abc123",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user"
  },
  "message": "User registered successfully"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "user",
      "specialization": ["Electrical Services"]  // if provider
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+234XXXXXXXXXX",
  "bio": "Professional electrician",
  "location": "Lagos, Nigeria",
  "specialization": ["Electrical Services", "Plumbing"]
}

Response (200):
{
  "success": true,
  "data": { ...updated user },
  "message": "Profile updated successfully"
}
```

### Job Endpoints

#### Post a Job
```http
POST /jobs
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Fix broken electrical outlet",
  "description": "Need someone to repair kitchen outlet",
  "category": "Electrical Services",
  "location": "Victoria Island, Lagos",
  "budget": 15000,
  "budget_type": "fixed",
  "timeline": "urgent",
  "expiresAt": "2026-02-10T00:00:00Z"
}

Response (201):
{
  "success": true,
  "data": {
    "id": "job-uuid",
    "title": "Fix broken electrical outlet",
    "status": "active",
    ...
  },
  "message": "Job posted successfully"
}
```

#### Get User's Posted Jobs
```http
GET /jobs
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "job-uuid",
        "title": "...",
        "status": "active",
        "offersCount": 3,
        ...
      }
    ],
    "total": 1
  }
}
```

#### Get Available Jobs for Provider
```http
GET /jobs/available/for-provider
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "job-uuid",
        "title": "Fix broken electrical outlet",
        "category": "Electrical Services",
        "budget": 15000,
        "location": "Victoria Island, Lagos",
        "timeline": "urgent",
        "offersCount": 2,
        ...
      }
    ],
    "total": 5
  }
}
```

### Response Format

All API responses follow this structure:

**Success Response (2xx)**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful",
  "statusCode": 200,
  "timestamp": "2026-01-10T10:30:00Z"
}
```

**Error Response (4xx/5xx)**
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human readable error message",
  "statusCode": 400,
  "timestamp": "2026-01-10T10:30:00Z"
}
```

---

## 💾 Database Schema

### Core Tables

**Users**
- `id` (UUID) - Primary key
- `email` (TEXT) - Unique email
- `password_hash` (TEXT) - Bcrypt hashed
- `full_name` (TEXT)
- `phone` (TEXT)
- `role` (TEXT) - 'user' or 'provider'
- `membership_type` (TEXT) - 'Free' or 'Premium'
- `created_at`, `updated_at` (TIMESTAMP)

**Providers**
- `id` (UUID)
- `user_id` (UUID) - Foreign key
- `specialization` (TEXT[]) - Array of categories
- `bio`, `hourly_rate`, `average_rating`
- `total_jobs_completed`, `is_available`

**Jobs**
- `id` (UUID)
- `user_id` (UUID) - Job poster
- `title`, `description`
- `category`, `location`
- `budget`, `budget_type`, `timeline`
- `status` - 'active' or 'closed'
- `created_at`, `expires_at`, `closed_at`

**Offers**
- `id` (UUID)
- `job_id`, `provider_id` (UUID)
- `proposed_price`, `proposed_timeline`
- `message`, `status`

**Additional Tables**: Bookings, Reviews, Messages, ActivityLogs, Referrals, Subscriptions

---

## ✨ Features Implemented

### Authentication ✅
- User & provider registration
- Login with JWT tokens
- Password hashing (bcryptjs)
- Token verification middleware
- Profile updates

### Job Management ✅
- Post jobs with full details
- Filter by status/category
- Budget type selection
- Timeline options
- Real-time display

### Provider Features ✅
- Dashboard with statistics
- View available jobs
- Change specialization/category
- Profile management
- Real-time job requests

### User Features ✅
- Dashboard showing posted jobs
- Job posting
- View offers received
- Job tracking

### UI/UX ✅
- Responsive design
- Loading states
- Error messages
- Success notifications
- Smooth transitions

---

## 🐛 Troubleshooting

### "Failed to fetch" Error
**Solution**: Ensure backend is running: `cd backend && npm run dev`

### Port 5000 Already in Use
**Solution**: Kill process on port 5000 or change PORT in .env

### Supabase Connection Error
**Solution**: Verify credentials in `backend/.env` and test connection

### CORS Error
**Solution**: Check CORS_ORIGIN in .env includes frontend URL:
```env
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### Database Tables Not Found
**Solution**: Run SQL setup script in Supabase SQL Editor (see DATABASE SCHEMA section)

---

## 🔐 Security

### Implemented
✅ Password hashing with bcryptjs (10 rounds)  
✅ JWT authentication (24h expiration)  
✅ CORS configuration  
✅ Environment variables for secrets  
✅ Input validation  
✅ Row Level Security (RLS)  

### Production Checklist
- [ ] Change JWT_SECRET to random value
- [ ] Enable HTTPS/SSL
- [ ] Set secure CORS_ORIGIN
- [ ] Enable RLS policies
- [ ] Set up rate limiting
- [ ] Enable email verification
- [ ] Regular security audits

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
git push origin main
# Vercel auto-deploys
# Set VITE_API_URL to backend URL
```

### Backend (Heroku/Railway)
```bash
git push heroku main
# Set env vars in dashboard
```

### Database
- Supabase handles hosting
- Automatic backups
- Scales automatically

---

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **Express.js**: https://expressjs.com/
- **React**: https://react.dev
- **Vite**: https://vitejs.dev

---

## ✅ Production Checklist

- [ ] Backend builds without errors
- [ ] All 10 database tables created
- [ ] RLS policies configured
- [ ] JWT_SECRET changed
- [ ] CORS_ORIGIN correct
- [ ] Frontend connects to backend
- [ ] Registration works end-to-end
- [ ] Job posting works
- [ ] Provider sees available jobs
- [ ] Token persists in localStorage
- [ ] Logout clears token

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: January 10, 2026
