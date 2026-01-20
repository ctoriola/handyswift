# Admin Dashboard Testing Guide

## Overview
The admin dashboard consists of:
- **Backend**: API endpoints in `backend/src/routes/admin.ts` (already deployed)
- **Frontend**: React pages in `src/pages/Admin/` (just implemented)

## Setup Requirements

### 1. Backend Database Setup
The admin database tables need to be created in Supabase. Run the SQL migrations from `ADMIN_DASHBOARD_SETUP.md`:

```sql
-- Create admin_reports table
CREATE TABLE admin_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(id),
  reported_user_id UUID NOT NULL REFERENCES users(id),
  report_type TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open',
  resolution_notes TEXT,
  resolved_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create provider_verification_queue table
CREATE TABLE provider_verification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES users(id),
  status TEXT DEFAULT 'pending',
  documents_submitted BOOLEAN DEFAULT FALSE,
  submission_date TIMESTAMP DEFAULT NOW(),
  reviewed_by UUID REFERENCES users(id),
  rejection_reason TEXT
);

-- Create admin_activity_logs table
CREATE TABLE admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES users(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  changes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add admin suspension fields to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspension_reason TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_by UUID REFERENCES users(id);
```

### 2. Create Admin User Account
In Supabase, create or modify a user account with `role = 'admin'`:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

### 3. Frontend Development Setup
```bash
npm install  # Ensure all dependencies are installed
npm run dev  # Start dev server
```

## Testing Checklist

### Phase 1: Login as Admin
- [ ] Navigate to http://localhost:5173/login
- [ ] Login with admin email/password
- [ ] Should successfully authenticate
- [ ] Check localStorage for `authToken` and `user` with `role: 'admin'`

### Phase 2: Access Admin Dashboard
- [ ] Navigate to http://localhost:5173/admin
- [ ] Should see AdminNav sidebar on left
- [ ] Should see dashboard with 4 stat cards
- [ ] Verify stats are loading from backend (check Network tab)
- [ ] All stat cards should show numbers (not 0 unless database is empty)

### Phase 3: Users Management Page
- [ ] Click "Users" in AdminNav or navigate to /admin/users
- [ ] Search box should filter users by email/name
- [ ] User table should display: Email, Name, Role, Status, Joined, Actions
- [ ] Click "eye" icon to view user details in modal
- [ ] Click "lock" icon to suspend user
  - [ ] Modal appears asking for suspension reason
  - [ ] After submitting, user should show as "Suspended" in table
  - [ ] Check backend logs for activity log entry
- [ ] Click "unlock" icon to unsuspend
  - [ ] Should return user to "Active" status

### Phase 4: Providers Management Page
- [ ] Navigate to /admin/providers
- [ ] Should see stats cards: Pending, Approved, Rejected
- [ ] Provider table should show: Email, Name, Status, Submitted, Documents, Actions
- [ ] For pending providers:
  - [ ] Click "eye" to view details
  - [ ] Click checkmark to approve
  - [ ] Click X to reject (should ask for reason)
  - [ ] After action, status should update in table

### Phase 5: Jobs Overview Page
- [ ] Navigate to /admin/jobs
- [ ] Should see 4 stat cards: Total, Open, In Progress, Completed
- [ ] Click each stat card to filter table
- [ ] Jobs table should show: Title, Category, Posted By, Budget, Status, Posted, Actions
- [ ] Click "eye" to view full job details in modal
- [ ] Verify budget displays with $ and proper formatting
- [ ] Description should be in formatted box in modal

### Phase 6: Reports Management Page
- [ ] Navigate to /admin/reports
- [ ] Should see stat cards: Open/Pending, Fraud, Safety Concerns, Resolved
- [ ] Reports table should show: Type, Reporter, Reported User, Status, Date, Actions
- [ ] Click "eye" to view report details
- [ ] For open reports:
  - [ ] Click checkmark to resolve
  - [ ] Modal shows text area for resolution notes
  - [ ] Checkbox to "Suspend reported user" (optional action)
  - [ ] After submitting, report status changes to "resolved"
  - [ ] If suspend checkbox was checked, verify user is suspended

### Phase 7: Navigation
- [ ] All AdminNav links work correctly
- [ ] Active page is highlighted in sidebar
- [ ] Can navigate between pages without issues
- [ ] Logout button clears auth and redirects to login

### Phase 8: Error Handling
- [ ] Try to access /admin without being logged in → should redirect to /login
- [ ] Try to access /admin as non-admin user → should redirect to /login
- [ ] Check browser DevTools Network tab:
  - [ ] All API calls use correct URL (https://backend.vercel.app or localhost:5000)
  - [ ] All requests include Authorization header with Bearer token
  - [ ] Failed requests show error messages in UI

## Backend Testing (Optional)

### Using curl or Postman

```bash
# 1. Login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# 2. Get admin stats (replace TOKEN with actual JWT)
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer TOKEN"

# 3. Get users list
curl -X GET "http://localhost:5000/api/admin/users?limit=10&offset=0" \
  -H "Authorization: Bearer TOKEN"

# 4. Suspend a user
curl -X PUT http://localhost:5000/api/admin/users/USER_ID/suspend \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"suspension_reason":"Violating terms of service"}'

# 5. Get pending providers
curl -X GET http://localhost:5000/api/admin/providers/pending \
  -H "Authorization: Bearer TOKEN"
```

## Troubleshooting

### Issue: "Failed to fetch stats" or API errors
**Solution**: 
1. Check backend is running (`npm run dev` in backend folder)
2. Verify CORS is configured correctly
3. Check `VITE_API_URL` environment variable is set
4. Verify JWT token is not expired

### Issue: Admin pages show blank/no data
**Solution**:
1. Check if admin user has `role = 'admin'` in database
2. Open DevTools → Network tab, check API response status
3. Check if database tables exist in Supabase
4. Verify permissions/RLS policies are correctly set

### Issue: "Access denied" on admin pages
**Solution**:
1. Verify you're logged in as admin (check localStorage)
2. Check if `isAdmin` boolean in AuthContext is true
3. Verify backend is returning correct role in login response

### Issue: Logout not working
**Solution**:
1. Check if `authToken` is cleared from localStorage
2. Verify page redirects to /login
3. Check for JavaScript errors in console

## Performance Notes

- Admin pages use pagination for large lists (default 50 items)
- Stat cards are pre-computed on backend for performance
- Search is client-side (for users page)
- Backend endpoints include database query optimization

## Security Notes

- All admin endpoints require valid JWT token
- Backend checks if user role = 'admin' before allowing access
- All admin actions are logged to `admin_activity_logs` table
- Frontend redirects non-admin users to login
- Sensitive data is not exposed in API responses

## Next Steps After Testing

1. **Deploy to Production**:
   - Push code to GitHub (already committed)
   - Vercel auto-deploys frontend
   - Backend deployment should be already done

2. **Database Migration in Production**:
   - Run SQL migrations in production Supabase instance
   - Verify all tables are created

3. **Create Production Admin Account**:
   - Set `role = 'admin'` for production admin user

4. **Monitor Admin Actions**:
   - Check `admin_activity_logs` table regularly
   - Review suspended users and their reasons

5. **Future Enhancements**:
   - Add analytics charts/graphs
   - Bulk actions (suspend multiple users)
   - Email notifications for admin actions
   - Export functionality (CSV, PDF)
   - Advanced filtering (date ranges, categories)

---
**Admin Dashboard Testing: Ready for QA** ✅
