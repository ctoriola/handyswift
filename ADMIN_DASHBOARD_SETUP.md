# Admin Dashboard Setup Guide

## Phase 1: Backend Setup

### Step 1: Database Schema Updates

Run these SQL commands in Supabase SQL Editor:

#### 1.1 Update users table to support admin role
```sql
-- Add 'admin' role to the users table if not already present
-- The role field already exists, just ensure 'admin' is allowed
ALTER TYPE user_role ADD VALUE 'admin' BEFORE 'provider';
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

## Testing

After implementation, test with:
```bash
# Make yourself an admin (in Supabase dashboard)
UPDATE users SET role = 'admin' WHERE id = 'your-user-id';

# Test admin endpoints
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/admin/stats
```
