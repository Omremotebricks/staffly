'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { getEmployeeByCode, calculateDays } from '../lib/data';
import { LeaveRequest, Employee } from '../types';

interface LeaveFormProps {
  onSubmit: (request: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>) => Promise<void>;
}

export default function LeaveForm({ onSubmit }: LeaveFormProps) {
  const { user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeCode: user?.employeeCode || '',
    leaveType: 'CL' as const,
    fromDate: '',
    toDate: '',
    reason: ''
  });

  useEffect(() => {
    if (formData.employeeCode) {
      getEmployeeByCode(formData.employeeCode).then(setEmployee);
    }
  }, [formData.employeeCode]);

  const numberOfDays = formData.fromDate && formData.toDate 
    ? calculateDays(formData.fromDate, formData.toDate) 
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use employee data if available, otherwise use user data
    const employeeData = employee || {
      name: user?.name || '',
      department: user?.department || '',
      hodEmail: user?.hodEmail || 'hr@company.com'
    };

    console.log('Form submission data:', {
      employeeCode: formData.employeeCode,
      employeeName: employeeData.name,
      department: employeeData.department,
      hodEmail: employeeData.hodEmail,
      user: user
    });

    setLoading(true);
    try {
      await onSubmit({
        employeeCode: formData.employeeCode,
        employeeName: employeeData.name,
        department: employeeData.department,
        hodEmail: employeeData.hodEmail,
        leaveType: formData.leaveType,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        numberOfDays,
        reason: formData.reason
      });

      // Reset form
      setFormData({
        employeeCode: user?.employeeCode || '',
        leaveType: 'CL',
        fromDate: '',
        toDate: '',
        reason: ''
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Apply for Leave</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Employee Code</label>
          <input
            type="text"
            value={formData.employeeCode}
            onChange={(e) => setFormData({...formData, employeeCode: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            required
          />
        </div>

        {(employee || user) && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Employee Name</label>
              <input
                type="text"
                value={employee?.name || user?.name || ''}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                value={employee?.department || user?.department || ''}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 border"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Leave Type</label>
          <div className="mt-2 space-x-4">
            {['CL', 'PL', 'LWP', 'Comp OFF'].map((type) => (
              <label key={type} className="inline-flex items-center">
                <input
                  type="radio"
                  name="leaveType"
                  value={type}
                  checked={formData.leaveType === type}
                  onChange={(e) => setFormData({...formData, leaveType: e.target.value as any})}
                  className="form-radio"
                />
                <span className="ml-2">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={formData.fromDate}
              onChange={(e) => setFormData({...formData, fromDate: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={formData.toDate}
              onChange={(e) => setFormData({...formData, toDate: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              required
            />
          </div>
        </div>

        {numberOfDays > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Days</label>
            <input
              type="number"
              value={numberOfDays}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 border"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Reason for Leave</label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Leave Request'}
        </button>
      </form>
    </div>
  );
}