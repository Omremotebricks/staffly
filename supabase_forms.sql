-- Create forms table
CREATE TABLE forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  fields JSONB DEFAULT '[]'::JSONB, -- Array of field definitions
  settings JSONB DEFAULT '{}'::JSONB, -- Access control, notifications, etc.
  status VARCHAR(20) CHECK (status IN ('draft', 'published', 'archived', 'disabled')) DEFAULT 'draft',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add can_create_forms permission to users table
-- Run this migration if users table already exists:
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS can_create_forms BOOLEAN DEFAULT FALSE;
-- UPDATE users SET can_create_forms = TRUE WHERE role = 'admin';


-- Create form_submissions table
CREATE TABLE form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  data JSONB DEFAULT '{}'::JSONB,
  status VARCHAR(20) CHECK (status IN ('submitted', 'reviewed', 'approved', 'rejected')) DEFAULT 'submitted',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for forms
CREATE POLICY "Allow all operations" ON forms FOR ALL USING (true);

-- Policies for form_submissions
CREATE POLICY "Allow all operations" ON form_submissions FOR ALL USING (true);

