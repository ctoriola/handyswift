# Admin Dashboard Setup Guide

## Phase 1: Backend Setup

### Step 1: Database Schema Updates

Run these SQL commands in Supabase SQL Editor:

#### 1.1 Update users table to support admin role
```sql
-- Option A: If you're using an ENUM type (run this if the enum exists)
-- ALTER TYPE user_role ADD VALUE 'admin' BEFORE 'provider';

-- Option B: If the enum doesn't exist or you're using VARCHAR (recommended - run this instead)
-- First, check your users table structure:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users';

-- If role is VARCHAR, just ensure 'admin' can be stored (no action needed)
-- If role is an ENUM that doesn't exist, create it first:
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('user', 'provider', 'admin');
    ALTER TABLE users ALTER COLUMN role TYPE user_role USING role::user_role;
  END IF;
END $$;
```

**If you get an error, run this simpler version instead:**
```sql
-- Simply verify the role column accepts 'admin' value
-- If role is VARCHAR, no changes needed
-- If role is ENUM and 'admin' doesn't exist, add it:
-- ALTER TYPE user_role ADD VALUE 'admin';
```

#### 1.2 Create admin_reports table
```sql
CREATE TABLE admin_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  report_type VARCHAR(50) NOT NULL, -- 'inappropriate_behavior', 'fraud', 'unprofessional', 'other'
  description TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'dismissed'
  resolution_notes TEXT,
  resolved_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP
);

CREATE INDEX idx_admin_reports_status ON admin_reports(status);
CREATE INDEX idx_admin_reports_reported_user ON admin_reports(reported_user_id);
```

#### 1.3 Create provider_verification_queue table
```sql
CREATE TABLE provider_verification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  documents_submitted TEXT[], -- URLs to verification documents
  submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),
  review_date TIMESTAMP,
  rejection_reason TEXT,
  UNIQUE(provider_id)
);

CREATE INDEX idx_provider_verification_status ON provider_verification_queue(status);
```

#### 1.4 Create admin_activity_logs table (for audit trail)
```sql
CREATE TABLE admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50), -- 'user', 'provider', 'job', 'report'
  target_id UUID,
  changes JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX idx_admin_logs_created_at ON admin_activity_logs(created_at);
```

#### 1.5 Add suspension fields to users table
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspension_reason VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_by UUID REFERENCES users(id);
```

### Step 2: Enable RLS (Row Level Security) for Admin Tables

```sql
-- Enable RLS for admin_reports
ALTER TABLE admin_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "only_admins_see_reports"
  ON admin_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "reporters_see_own_reports"
  ON admin_reports FOR SELECT
  USING (reporter_id = auth.uid());

-- Enable RLS for provider_verification_queue
ALTER TABLE provider_verification_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "only_admins_see_queue"
  ON provider_verification_queue FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "providers_see_own_application"
  ON provider_verification_queue FOR SELECT
  USING (provider_id = auth.uid());

-- Enable RLS for admin_activity_logs
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "only_admins_see_logs"
  ON admin_activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );
```

## Phase 2: Backend API Implementation

See: `backend/src/routes/admin.ts`

## Phase 3: Frontend Implementation

See: `src/pages/Admin/` directory

---

## Troubleshooting

### Issue: "type 'user_role' does not exist"
This means your `users` table uses VARCHAR for the role column instead of an ENUM type.

**Solution:** Check your current schema first:
```sql
-- Check the role column type
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'role';
```

Then run the appropriate migration:
- If data_type is `character varying` (VARCHAR): Just run the rest of migrations (role column is fine)
- If data_type is `user_role` (ENUM): The enum doesn't exist, so create it:
  ```sql
  CREATE TYPE user_role AS ENUM ('user', 'provider', 'admin');
  ALTER TABLE users ALTER COLUMN role TYPE user_role USING role::user_role;
  ```

### Issue: "column 'is_suspended' already exists"
The column was already added in a previous migration. This is fine - just skip that step.

### Issue: "table 'admin_reports' already exists"
The tables were already created. This is fine - the migrations are idempotent.

## Testing

After implementation, test with:
```bash
# 1. First, verify the users table structure
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'users' AND column_name IN ('role', 'is_suspended')
ORDER BY column_name;

# 2. Make yourself an admin (in Supabase dashboard)
UPDATE users SET role = 'admin' WHERE id = 'your-user-id';

# 3. Verify the update
SELECT id, email, role FROM users WHERE id = 'your-user-id';

# 4. Test admin endpoints
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/admin/stats
```
