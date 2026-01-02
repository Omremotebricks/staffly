-- Migration script to add can_create_forms permission and fix RLS policies
-- Run this in your Supabase SQL editor

-- 1. Add can_create_forms column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS can_create_forms BOOLEAN DEFAULT FALSE;

-- 2. Set can_create_forms to TRUE for all admin users
UPDATE users SET can_create_forms = TRUE WHERE role = 'admin';

-- 3. FIX RLS POLICIES: Update to permissive mode (matching rest of project)
-- Because this project uses custom JWT auth, Supabase auth.uid() is null, 
-- which breaks restrictive policies. We rely on API-level checks instead.

-- Forms table
DROP POLICY IF EXISTS "Admins and form creators can manage forms" ON forms;
DROP POLICY IF EXISTS "Users can view published forms" ON forms;
DROP POLICY IF EXISTS "Allow all operations" ON forms;
CREATE POLICY "Allow all operations" ON forms FOR ALL USING (true);

-- Form Submissions table
DROP POLICY IF EXISTS "Admins can do everything on submissions" ON form_submissions;
DROP POLICY IF EXISTS "Users can create submissions" ON form_submissions;
DROP POLICY IF EXISTS "Users can view their own submissions" ON form_submissions;
DROP POLICY IF EXISTS "HR/Managers can view all submissions" ON form_submissions;
DROP POLICY IF EXISTS "Allow all operations" ON form_submissions;
CREATE POLICY "Allow all operations" ON form_submissions FOR ALL USING (true);
