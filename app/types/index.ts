export interface User {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  department: string;
  role: 'employee' | 'hr' | 'admin';
  hodEmail?: string;
  isActive: boolean;
}

export interface LeaveRequest {
  id: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  hodEmail: string;
  leaveType: 'CL' | 'PL' | 'LWP' | 'Comp OFF';
  fromDate: string;
  toDate: string;
  numberOfDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
}

export interface Employee {
  code: string;
  name: string;
  department: string;
  email: string;
  hodEmail: string;
}