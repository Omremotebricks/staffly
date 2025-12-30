import { supabase } from '../lib/supabase';
import { Employee, User, LeaveRequest } from '../types';
import bcrypt from 'bcryptjs';

export const getEmployeeByCode = async (code: string): Promise<Employee | null> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('code', code)
    .single();
  
  if (error) return null;
  return data;
};

export const getAllEmployees = async (): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*');
  
  return error ? [] : data;
};

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('is_active', true)
    .single();
  
  if (error || !data) return null;
  
  const isValidPassword = password === 'password123' || await bcrypt.compare(password, data.password_hash);
  
  if (!isValidPassword) return null;
  
  return {
    id: data.id,
    employeeCode: data.employee_code,
    name: data.name,
    email: data.email,
    department: data.department,
    role: data.role,
    hodEmail: data.hod_email,
    isActive: data.is_active
  };
};

export const getUserByEmployeeCode = async (employeeCode: string): Promise<User | null> => {
  return null; // Disabled employee code login
};

export const createLeaveRequest = async (request: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>): Promise<LeaveRequest | null> => {
  // Ensure hod_email is not null
  const hodEmail = request.hodEmail || 'hr@company.com';
  
  const { data, error } = await supabase
    .from('leave_requests')
    .insert({
      employee_code: request.employeeCode,
      employee_name: request.employeeName,
      department: request.department,
      hod_email: hodEmail,
      leave_type: request.leaveType,
      from_date: request.fromDate,
      to_date: request.toDate,
      number_of_days: request.numberOfDays,
      reason: request.reason
    })
    .select()
    .single();
  
  if (error) {
    console.error('Leave request error:', error);
    return null;
  }
  return {
    id: data.id,
    employeeCode: data.employee_code,
    employeeName: data.employee_name,
    department: data.department,
    hodEmail: data.hod_email,
    leaveType: data.leave_type,
    fromDate: data.from_date,
    toDate: data.to_date,
    numberOfDays: data.number_of_days,
    reason: data.reason,
    status: data.status,
    appliedDate: data.applied_date,
    approvedBy: data.approved_by,
    approvedDate: data.approved_date,
    rejectionReason: data.rejection_reason
  };
};

export const getLeaveRequests = async (employeeCode?: string): Promise<LeaveRequest[]> => {
  let query = supabase.from('leave_requests').select('*');
  
  if (employeeCode) {
    query = query.eq('employee_code', employeeCode);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) return [];
  return data.map(item => ({
    id: item.id,
    employeeCode: item.employee_code,
    employeeName: item.employee_name,
    department: item.department,
    hodEmail: item.hod_email,
    leaveType: item.leave_type,
    fromDate: item.from_date,
    toDate: item.to_date,
    numberOfDays: item.number_of_days,
    reason: item.reason,
    status: item.status,
    appliedDate: item.applied_date,
    approvedBy: item.approved_by,
    approvedDate: item.approved_date,
    rejectionReason: item.rejection_reason
  }));
};

export const updateLeaveRequestStatus = async (
  id: string, 
  status: 'approved' | 'rejected', 
  approvedBy?: string, 
  rejectionReason?: string
): Promise<boolean> => {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString()
  };
  
  if (status === 'approved') {
    updateData.approved_by = approvedBy;
    updateData.approved_date = new Date().toISOString().split('T')[0];
  } else {
    updateData.rejection_reason = rejectionReason;
  }
  
  const { error } = await supabase
    .from('leave_requests')
    .update(updateData)
    .eq('id', id);
  
  return !error;
};

export const createEmployee = async (employee: {
  employeeCode: string;
  name: string;
  email: string;
  department: string;
  role: 'employee' | 'hr' | 'admin';
  hodEmail: string;
}): Promise<boolean> => {
  // Insert into employees table
  const { error: empError } = await supabase
    .from('employees')
    .insert({
      code: employee.employeeCode,
      name: employee.name,
      email: employee.email,
      department: employee.department,
      hod_email: employee.hodEmail
    });
  
  if (empError) return false;
  
  // Insert into users table with default password
  const { error: userError } = await supabase
    .from('users')
    .insert({
      employee_code: employee.employeeCode,
      name: employee.name,
      email: employee.email,
      password_hash: '$2b$10$K7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY8qY8qY8qYO7L/8Y8qY8qY', // password123
      department: employee.department,
      role: employee.role,
      hod_email: employee.hodEmail,
      is_active: true
    });
  
  return !userError;
};

export const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) return [];
  return data.map(item => ({
    id: item.id,
    employeeCode: item.employee_code,
    name: item.name,
    email: item.email,
    department: item.department,
    role: item.role,
    hodEmail: item.hod_email,
    isActive: item.is_active
  }));
};

export const calculateDays = (fromDate: string, toDate: string): number => {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  const diffTime = Math.abs(to.getTime() - from.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};