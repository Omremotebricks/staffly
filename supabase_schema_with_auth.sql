-- Create users table with password authentication
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('employee', 'hr', 'admin')) DEFAULT 'employee',
  hod_email VARCHAR(100),
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employees table (for reference data)
CREATE TABLE employees (
  code VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  hod_email VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leave_requests table
CREATE TABLE leave_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_code VARCHAR(20) NOT NULL,
  employee_name VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  hod_email VARCHAR(100) NOT NULL,
  leave_type VARCHAR(20) CHECK (leave_type IN ('CL', 'PL', 'LWP', 'Comp OFF')) NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  number_of_days DECIMAL(3,1) NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  applied_date DATE DEFAULT CURRENT_DATE,
  approved_by VARCHAR(100),
  approved_date DATE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert only 3 essential accounts
INSERT INTO users (employee_code, name, email, password_hash, department, role, hod_email, is_active) VALUES
('EMP001', 'Employee User', 'employee@company.com', '$2b$10$K7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY', 'General', 'employee', 'hr@company.com', true),
('HR001', 'HR Manager', 'hr@company.com', '$2b$10$K7L/8Y8qY8qY8qY8qY8qY8qY8qYO7L/8Y8qY8qY8qY8qYO7L/8Y8qY8qY', 'Human Resources', 'hr', 'admin@company.com', true),
('ADMIN', 'System Admin', 'admin@company.com', '$2b$10$K7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY', 'Administration', 'admin', 'admin@company.com', true);

-- Insert corresponding employees
INSERT INTO employees (code, name, department, email, hod_email) VALUES
('EMP001', 'Employee User', 'General', 'employee@company.com', 'hr@company.com'),
('HR001', 'HR Manager', 'Human Resources', 'hr@company.com', 'admin@company.com'),
('ADMIN', 'System Admin', 'Administration', 'admin@company.com', 'admin@company.com');

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- Simple policies for testing
CREATE POLICY "Allow all operations" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON employees FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON leave_requests FOR ALL USING (true);