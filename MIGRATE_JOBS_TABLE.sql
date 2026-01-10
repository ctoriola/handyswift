-- Add missing columns to jobs table if they don't exist
-- Run this in Supabase SQL Editor

ALTER TABLE jobs
ADD COLUMN location TEXT;

ALTER TABLE jobs
ADD COLUMN timeline TEXT CHECK (timeline IN ('urgent', 'week', 'month', 'flexible'));

-- Add constraints if needed
ALTER TABLE jobs
ALTER COLUMN location SET NOT NULL;

-- Create index for location queries if needed
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
