# Admin Dashboard Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        HANDYSWIFT PLATFORM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     FRONTEND (React)                     │   │
│  │              https://handyswift.vercel.app               │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                          │   │
│  │  ┌────────────────────────────────────────────────────┐ │   │
│  │  │            Admin Dashboard (/admin)                │ │   │
│  │  ├────────────────────────────────────────────────────┤ │   │
│  │  │                                                    │ │   │
│  │  │  ┌──────────┐  ┌──────────────────────────────┐  │ │   │
│  │  │  │ AdminNav │  │     Main Content Area        │  │ │   │
│  │  │  │ Sidebar  │  │                              │  │ │   │
│  │  │  │          │  │  ┌─────────────────────────┐ │  │ │   │
│  │  │  │ • Dashboard   │ • Dashboard Stats   │ │  │ │   │
│  │  │  │ • Users │  │ • User Table       │ │  │ │   │
│  │  │  │ • Providers   │ • Provider Queue   │ │  │ │   │
│  │  │  │ • Jobs   │  │ • Jobs List        │ │  │ │   │
│  │  │  │ • Reports     │ • Reports List     │ │  │ │   │
│  │  │  │ • Logout  │  │ • Modals/Dialogs   │ │  │ │   │
│  │  │  │          │  │ • Search/Filter    │ │  │ │   │
│  │  │  └──────────┘  └─────────────────────────┘ │  │ │   │
│  │  │                                            │  │ │   │
│  │  │  Pages (React Components):                 │  │ │   │
│  │  │  • DashboardNew.tsx                        │  │ │   │
│  │  │  • Users.tsx                               │  │ │   │
│  │  │  • Providers.tsx                           │  │ │   │
│  │  │  • Jobs.tsx                                │  │ │   │
│  │  │  • Reports.tsx                             │  │ │   │
│  │  │                                            │  │ │   │
│  │  │  Components:                               │  │ │   │
│  │  │  • AdminNav.tsx (Sidebar)                  │  │ │   │
│  │  │  • Radix UI Components (Button, Card, etc) │  │ │   │
│  │  │                                            │  │ │   │
│  │  └────────────────────────────────────────────┘  │ │   │
│  │                                                   │ │   │
│  │  State Management:                              │ │   │
│  │  • AuthContext (useAuth hook)                   │ │   │
│  │  • React Hooks (useState, useEffect)            │ │   │
│  │  • React Router (Navigation)                    │ │   │
│  │                                                  │ │   │
│  └──────────────────────────────────────────────────┘ │   │
│            ↓ HTTP Requests (JWT Auth)               │   │
│  ┌──────────────────────────────────────────────────┐   │
│  │              BACKEND API (Express.js)            │   │
│  │        https://handyswift-backend.vercel.app     │   │
│  ├──────────────────────────────────────────────────┤   │
│  │                                                  │   │
│  │  Admin Routes (backend/src/routes/admin.ts)     │   │
│  │                                                  │   │
│  │  GET    /api/admin/stats                        │   │
│  │  GET    /api/admin/users                        │   │
│  │  PUT    /api/admin/users/:id/suspend            │   │
│  │  PUT    /api/admin/users/:id/unsuspend          │   │
│  │  GET    /api/admin/providers                    │   │
│  │  GET    /api/admin/providers/pending            │   │
│  │  PUT    /api/admin/providers/:id/approve        │   │
│  │  PUT    /api/admin/providers/:id/reject         │   │
│  │  GET    /api/admin/jobs                         │   │
│  │  GET    /api/admin/bookings                     │   │
│  │  GET    /api/admin/reports                      │   │
│  │  PUT    /api/admin/reports/:id/resolve          │   │
│  │                                                  │   │
│  │  Middleware:                                    │   │
│  │  • authMiddleware (JWT verification)            │   │
│  │  • isAdmin (Role check)                         │   │
│  │                                                  │   │
│  │  Logging:                                       │   │
│  │  • All admin actions logged to admin_activity_  │   │
│  │    logs table                                   │   │
│  │                                                  │   │
│  └──────────────────────────────────────────────────┘   │
│            ↓ SQL Queries                              │   │
│  ┌──────────────────────────────────────────────────┐   │
│  │         DATABASE (Supabase PostgreSQL)           │   │
│  ├──────────────────────────────────────────────────┤   │
│  │                                                  │   │
│  │  Tables:                                        │   │
│  │  • users (with role, suspension fields)         │   │
│  │  • admin_reports (complaints)                   │   │
│  │  • provider_verification_queue (applications)   │   │
│  │  • admin_activity_logs (audit trail)            │   │
│  │  • jobs, bookings, etc. (existing)              │   │
│  │                                                  │   │
│  │  RLS Policies:                                  │   │
│  │  • Admin-only access control                    │   │
│  │  • Row-level security enforced                  │   │
│  │                                                  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Examples

### Example 1: Admin Suspending a User

```
1. Admin clicks "Suspend" button on Users page
   ↓
2. Modal opens asking for suspension reason
   ↓
3. Admin enters reason and submits
   ↓
4. Frontend makes API call:
   PUT /api/admin/users/:userId/suspend
   {
     "suspension_reason": "Violating terms of service",
     "Authorization": "Bearer JWT_TOKEN"
   }
   ↓
5. Backend receives request:
   • authMiddleware validates JWT
   • isAdmin middleware checks role
   • Updates users table (is_suspended=true)
   • Logs action to admin_activity_logs
   • Returns success response
   ↓
6. Frontend updates local state
   ↓
7. User table refreshes showing "Suspended" status
   ↓
8. Admin can click "Unsuspend" to reverse action
```

### Example 2: Admin Approving a Provider

```
1. Admin navigates to /admin/providers
   ↓
2. Page loads pending providers from API:
   GET /api/admin/providers/pending
   ↓
3. Backend queries provider_verification_queue table
   Returns all pending applications
   ↓
4. Frontend displays in table with "Approve" button
   ↓
5. Admin clicks "Approve"
   ↓
6. Frontend makes API call:
   PUT /api/admin/providers/:providerId/approve
   {
     "Authorization": "Bearer JWT_TOKEN"
   }
   ↓
7. Backend:
   • Updates provider_verification_queue status
   • Sets is_verified=true on provider user
   • Logs action to admin_activity_logs
   • Returns success
   ↓
8. Frontend updates table
   Status changes from "pending" to "approved"
   ↓
9. Admin can now see provider in active providers list
```

### Example 3: Admin Viewing Platform Stats

```
1. Admin logs in and navigates to /admin
   ↓
2. Dashboard component mounts
   ↓
3. useEffect hook calls API:
   GET /api/admin/stats
   {
     "Authorization": "Bearer JWT_TOKEN"
   }
   ↓
4. Backend:
   • Validates JWT
   • Validates admin role
   • Runs SQL queries:
     - SELECT COUNT(*) FROM users
     - SELECT COUNT(*) FROM users WHERE role='provider'
     - SELECT COUNT(*) FROM jobs
     - SELECT COUNT(*) FROM admin_reports WHERE status='open'
   • Calculates completion rate
   • Returns JSON response
   ↓
5. Frontend receives stats:
   {
     "data": {
       "users": { "total": 150, "providers": 45, "activeProviders": 38 },
       "jobs": { "total": 200, "completed": 120, "completionRate": 0.6 },
       "bookings": { "total": 220 },
       "admin": { "pendingProviderApplications": 7, "openReports": 3 }
     }
   }
   ↓
6. Frontend displays in stat cards
   ↓
7. Stats auto-update if user refreshes page
```

---

## Component Hierarchy

```
App.tsx
├── Router
├── Routes
│   ├── Route: /admin → AdminDashboard
│   │   ├── AdminNav (sidebar)
│   │   └── Dashboard content
│   ├── Route: /admin/users → AdminUsersPage
│   │   ├── AdminNav (sidebar)
│   │   └── Users table with search
│   ├── Route: /admin/providers → AdminProvidersPage
│   │   ├── AdminNav (sidebar)
│   │   └── Providers approval table
│   ├── Route: /admin/jobs → AdminJobsPage
│   │   ├── AdminNav (sidebar)
│   │   └── Jobs table with filtering
│   ├── Route: /admin/reports → AdminReportsPage
│   │   ├── AdminNav (sidebar)
│   │   └── Reports list
│   └── [Other routes]
├── AuthProvider
│   ├── AuthContext
│   └── Login/Logout logic
└── ScrollToTop
```

---

## State Management Flow

```
Browser
  ↓
localStorage (JWT Token, User)
  ↓
AuthContext (useAuth hook)
  ├── user (User object)
  ├── isAdmin (boolean check)
  ├── isAuthenticated (boolean)
  ├── login() function
  └── logout() function
  ↓
Component State (useState)
├── Page state (loading, error, data)
├── Modal state (which modal open)
└── Form state (input values)
  ↓
Rendered JSX
  ↓
Browser Display
```

---

## Security Architecture

```
┌─────────────────────────────────────────┐
│      Frontend Security Layers           │
├─────────────────────────────────────────┤
│ 1. Auth Check on Page Load              │
│    ↓                                    │
│ 2. isAdmin validation in AuthContext    │
│    ↓                                    │
│ 3. Redirect non-admins to /login        │
│    ↓                                    │
│ 4. Show admin page only if isAdmin      │
└─────────────────────────────────────────┘
                  ↓
        (JWT Token in localStorage)
                  ↓
┌─────────────────────────────────────────┐
│      Backend Security Layers            │
├─────────────────────────────────────────┤
│ 1. Extract JWT from Authorization       │
│    header                               │
│    ↓                                    │
│ 2. Verify JWT signature                 │
│    ↓                                    │
│ 3. Check user exists in database        │
│    ↓                                    │
│ 4. Check user role == 'admin'           │
│    ↓                                    │
│ 5. Process request if all checks pass   │
│    ↓                                    │
│ 6. Log action to admin_activity_logs    │
│    ↓                                    │
│ 7. Return response with updated data    │
└─────────────────────────────────────────┘
```

---

## Database Schema (Simplified)

```
users TABLE
├── id (UUID, Primary Key)
├── email (String, Unique)
├── password (String, Hashed)
├── full_name (String)
├── role (String: 'user' | 'provider' | 'admin')
├── is_suspended (Boolean)
├── suspension_reason (String)
├── suspended_at (Timestamp)
├── suspended_by (UUID, FK)
└── ... other fields

admin_reports TABLE
├── id (UUID, Primary Key)
├── reporter_id (UUID, FK → users)
├── reported_user_id (UUID, FK → users)
├── report_type (String)
├── description (String)
├── status (String: 'open' | 'in_review' | 'resolved')
├── resolution_notes (String)
├── resolved_by (UUID, FK → users)
├── created_at (Timestamp)
└── updated_at (Timestamp)

provider_verification_queue TABLE
├── id (UUID, Primary Key)
├── provider_id (UUID, FK → users)
├── status (String: 'pending' | 'approved' | 'rejected')
├── documents_submitted (Boolean)
├── submission_date (Timestamp)
├── reviewed_by (UUID, FK → users)
└── rejection_reason (String)

admin_activity_logs TABLE
├── id (UUID, Primary Key)
├── admin_id (UUID, FK → users)
├── action (String)
├── target_type (String)
├── target_id (String)
├── changes (JSON)
└── created_at (Timestamp)
```

---

## API Request/Response Examples

### Request 1: Get Admin Stats
```
REQUEST:
GET /api/admin/stats
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

RESPONSE:
{
  "success": true,
  "data": {
    "users": {
      "total": 150,
      "providers": 45,
      "activeProviders": 38
    },
    "jobs": {
      "total": 200,
      "completed": 120,
      "completionRate": 0.6
    },
    "bookings": {
      "total": 220
    },
    "admin": {
      "pendingProviderApplications": 7,
      "openReports": 3
    }
  }
}
```

### Request 2: Suspend User
```
REQUEST:
PUT /api/admin/users/550e8400-e29b-41d4-a716-446655440000/suspend
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "suspension_reason": "Violating community guidelines"
}

RESPONSE:
{
  "success": true,
  "message": "User suspended successfully",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "is_suspended": true,
    "suspended_at": "2024-01-15T10:30:00Z"
  }
}
```

---

## Deployment Flow

```
Developer
  ↓
Write Code
  ↓
Test Locally (npm run dev)
  ↓
Commit to Git (git commit)
  ↓
Push to GitHub (git push)
  ↓
GitHub → Vercel (Webhook)
  ↓
Vercel Frontend Build
  ├── npm install
  ├── npm run build
  ├── Generate static assets
  └── Deploy to CDN
  ↓
Vercel Backend Build (if changes)
  ├── npm install
  ├── npm run build
  ├── Compile TypeScript
  └── Deploy to Vercel Functions
  ↓
Live at:
Frontend: https://handyswift.vercel.app
Backend: https://handyswift-backend.vercel.app
```

---

## Admin Workflow

```
Admin User Journey
│
├─ Login
│  └─ Email + Password → /login
│     ↓
│     Backend validates
│     ↓
│     Returns JWT token
│     ↓
│     Store in localStorage
│
├─ Navigate to /admin
│  └─ AuthContext checks isAdmin
│     ↓
│     If admin: Show dashboard
│     If not: Redirect to /login
│
├─ Manage Users (/admin/users)
│  └─ View users
│     ├─ Search for user
│     ├─ Click view details
│     ├─ Suspend with reason
│     └─ Unsuspend
│
├─ Manage Providers (/admin/providers)
│  └─ Review applications
│     ├─ View pending queue
│     ├─ Approve provider
│     └─ Reject with reason
│
├─ Monitor Jobs (/admin/jobs)
│  └─ View all jobs
│     ├─ Filter by status
│     └─ View details
│
├─ Handle Reports (/admin/reports)
│  └─ Review user complaints
│     ├─ View details
│     ├─ Resolve report
│     └─ Optionally suspend user
│
└─ Logout
   └─ Clear auth
      ↓
      Redirect to /login
```

---

This architecture provides:
✅ Clear separation of concerns
✅ Scalable component structure
✅ Secure API integration
✅ Comprehensive data flow
✅ Audit trail and logging
✅ Production-ready design

