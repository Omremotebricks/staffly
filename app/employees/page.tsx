"use client";

import { useState, useEffect } from "react";
import AppShell from "../components/hrms/AppShell";
import EmployeeManagement from "../components/EmployeeManagement";
import { getAllUsers } from "../lib/data";
import { User } from "../types";
import Loader from "../components/Loader";

export default function EmployeesPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setEmployees(data);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell title="Employee Directory">
      <div className="space-y-6">
        {showAddForm && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black text-[var(--color-text-primary)]">
                Add New Employee
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
              >
                Cancel
              </button>
            </div>
            <EmployeeManagement
              onEmployeeCreated={() => {
                setShowAddForm(false);
                loadEmployees();
              }}
            />
          </div>
        )}

        <div className="bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] overflow-hidden">
          <div className="p-6 border-b border-[var(--color-border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-[var(--color-text-muted)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Filter by name, department, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-semibold border border-[var(--color-border)] rounded-[var(--radius-md)] hover:bg-[var(--color-bg-main)] transition-colors">
                Export
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 text-sm font-black uppercase tracking-wider bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--color-primary-hover)] transition-all shadow-md shadow-indigo-100 dark:shadow-none"
              >
                + Add Employee
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-bg-main)] text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                  <th className="px-6 py-4 font-semibold">Employee</th>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold">Designation</th>
                  <th className="px-6 py-4 font-semibold">Join Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-[var(--color-text-muted)] font-medium">
                          Loading enterprise directory...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-[var(--color-text-muted)] font-medium"
                    >
                      No employees found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary-light)] flex items-center justify-center text-xs font-black transition-transform group-hover:scale-110">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {emp.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {emp.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {emp.department}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 lowercase capitalize">
                          {emp.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-500 font-mono">
                          {emp.employeeCode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                            emp.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-red-50 text-red-700 border-red-100"
                          }`}
                        >
                          {emp.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-[var(--color-primary)] transition-colors px-2">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-[var(--color-border)] flex items-center justify-between text-sm text-[var(--color-text-muted)]">
            <p>
              Showing {filteredEmployees.length} of {employees.length} employees
            </p>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border border-[var(--color-border)] rounded hover:bg-[var(--color-bg-main)] disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button className="px-3 py-1 border border-[var(--color-border)] rounded hover:bg-[var(--color-bg-main)]">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
