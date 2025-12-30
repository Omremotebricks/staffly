-- Import script for exported leave data
-- Run this after creating the main schema

-- First, insert all employees from the exported data
INSERT INTO employees (code, name, department, email, hod_email) VALUES
('3000047', 'Hiren Prajapati', 'Civil/Structural/Marine', 'hiren@company.com', 'dbm@agts-in.com'),
('3000052', 'Mehul Chauhan', 'Process', 'mehul@company.com', 'krp@agts-in.com'),
('3000056', 'Vishal D Borade', 'Process', 'vishal@company.com', 'krp@agts-in.com'),
('3000040', 'Shefali Thakkar', 'Civil/Structural/Marine', 'shefali@company.com', 'dbm@agts-in.com'),
('3000051', 'Amit Kumar', 'Process', 'amit@company.com', 'ak@agts-in.com'),
('3000045', 'Pinakini Panda', 'Process', 'pinakini@company.com', 'ak@agts-in.com'),
('3000054', 'Shobha Chamoli', 'Process', 'shobha@company.com', 'krp@agts-in.com'),
('3000041', 'Tarang Suthar', 'Process', 'tarang@company.com', 'pkp@agts-in.com'),
('3000053', 'Sonu Neolia', 'Process', 'sonu@company.com', 'tpj@agts-in.com'),
('3000049', 'Trushar Joshi', 'Process', 'trushar@company.com', 'ak@agts-in.com'),
('3000024', 'Ankita Shah', 'Process', 'ankita@company.com', 'ak@agts-in.com'),
('3000011', 'Kalpesh Patel', 'Process', 'kalpesh@company.com', 'ak@agts-in.com'),
('3000048', 'Harshad Panchal', 'Process', 'harshad@company.com', 'krp@agts-in.com'),
('3000055', 'Kripesh Thakre', 'Process', 'kripesh@company.com', 'pkp@agts-in.com'),
('3000032', 'Harshil Patel', 'Piping', 'harshil@company.com', 'krp@agts-in.com'),
('3000057', 'Mitesh Patel', 'Process', 'mitesh@company.com', 'ak@agts-in.com'),
('3000058', 'Sanjay Singh', 'Process', 'sanjay@company.com', 'ak@agts-in.com'),
('3000059', 'Pragnesh Suthar', 'Process', 'pragnesh@company.com', 'sss@agts-in.com'),
('3000060', 'Ruta Modi', 'Civil/Structural/Marine', 'ruta@company.com', 'dbm@agts-in.com'),
('3000061', 'Nirav Gohil', 'Civil/Structural/Marine', 'nirav@company.com', 'dbm@agts-in.com'),
('3000062', 'Shivang Sharma', 'Process', 'shivang@company.com', 'ak@agts-in.com'),
('3000063', 'Darshil Prajapati', 'Process', 'darshil@company.com', 'hvp@agts-in.com'),
('3000064', 'Parthav Gohil', 'Civil/Structural/Marine', 'parthav@company.com', 'dbm@agts-in.com'),
('3000065', 'Aditya Pithadiya', 'Process', 'aditya@company.com', 'hvp@agts-in.com'),
('3000066', 'Harshil Darji', 'Process', 'harshildarji@company.com', 'ak@agts-in.com'),
('Consultant', 'Dheeraj Balamohan', 'Civil/Structural/Marine', 'dbm@agts-in.com', 'ak@agts-in.com')
ON CONFLICT (code) DO NOTHING;

-- Create corresponding user accounts for employees (password: password123)
INSERT INTO users (employee_code, name, email, password_hash, department, role, hod_email, is_active) VALUES
('3000047', 'Hiren Prajapati', 'hiren@company.com', '$2b$10$K7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY', 'Civil/Structural/Marine', 'employee', 'dbm@agts-in.com', true),
('3000052', 'Mehul Chauhan', 'mehul@company.com', '$2b$10$K7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY', 'Process', 'employee', 'krp@agts-in.com', true),
('3000056', 'Vishal D Borade', 'vishal@company.com', '$2b$10$K7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY', 'Process', 'employee', 'krp@agts-in.com', true),
('3000040', 'Shefali Thakkar', 'shefali@company.com', '$2b$10$K7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY', 'Civil/Structural/Marine', 'employee', 'dbm@agts-in.com', true),
('3000051', 'Amit Kumar', 'amit@company.com', '$2b$10$K7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY', 'Process', 'employee', 'ak@agts-in.com', true),
('3000045', 'Pinakini Panda', 'pinakini@company.com', '$2b$10$K7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY', 'Process', 'employee', 'ak@agts-in.com', true),
('3000041', 'Tarang Suthar', 'tarang@company.com', '$2b$10$K7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY', 'Process', 'employee', 'pkp@agts-in.com', true),
('3000032', 'Harshil Patel', 'harshil@company.com', '$2b$10$K7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY', 'Piping', 'employee', 'krp@agts-in.com', true)
ON CONFLICT (employee_code) DO NOTHING;

-- Sample leave requests from exported data (recent ones)
INSERT INTO leave_requests (employee_code, employee_name, department, hod_email, leave_type, from_date, to_date, number_of_days, reason, status, applied_date, approved_by, approved_date) VALUES
('3000047', 'Hiren Prajapati', 'Civil/Structural/Marine', 'dbm@agts-in.com', 'PL', '2024-08-16', '2024-08-16', 1, 'Personal work', 'approved', '2024-08-08', 'Dheeraj Balamohan', '2024-08-08'),
('3000052', 'Mehul Chauhan', 'Process', 'krp@agts-in.com', 'PL', '2024-02-10', '2024-02-10', 1, 'Personal Work', 'approved', '2024-01-10', 'Kalpesh Patel', '2024-01-10'),
('3000045', 'Pinakini Panda', 'Process', 'ak@agts-in.com', 'CL', '2024-06-06', '2024-06-06', 1, 'Due to Power Issue at Home', 'approved', '2024-06-10', 'Arvind Kaushik', '2024-06-10'),
('3000041', 'Tarang Suthar', 'Process', 'pkp@agts-in.com', 'PL', '2024-06-14', '2024-06-17', 4, 'Family Function', 'approved', '2024-06-12', 'Pinakini Panda', '2024-06-12'),
('3000051', 'Amit Kumar', 'Process', 'ak@agts-in.com', 'CL', '2024-06-07', '2024-06-08', 1.5, 'Personal Work', 'approved', '2024-06-07', 'Arvind Kaushik', '2024-06-07'),
('3000032', 'Harshil Patel', 'Piping', 'krp@agts-in.com', 'CL', '2024-08-24', '2024-08-24', 1, 'Personal', 'approved', '2024-08-28', 'Kalpesh Patel', '2024-08-28'),
('3000040', 'Shefali Thakkar', 'Civil/Structural/Marine', 'dbm@agts-in.com', 'CL', '2024-05-07', '2024-05-07', 0.5, 'Personal', 'approved', '2024-05-07', 'Dheeraj Balamohan', '2024-05-07');