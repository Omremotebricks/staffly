"use client";

import { useState } from "react";
import { createEmployee } from "../lib/data";
import Loader from "./Loader";

interface EmployeeManagementProps {
  onEmployeeCreated: () => void;
}

export default function EmployeeManagement({
  onEmployeeCreated,
}: EmployeeManagementProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeCode: "",
    name: "",
    email: "",
    department: "",
    role: "employee" as "employee" | "hr" | "admin",
    hodEmail: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createEmployee(formData);
      setFormData({
        employeeCode: "",
        name: "",
        email: "",
        department: "",
        role: "employee",
        hodEmail: "",
      });
      onEmployeeCreated();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] rounded-[var(--radius-lg)] p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[var(--color-border)]">
        <div className="p-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-[var(--radius-md)]">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            Onboard New Employee
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] font-medium">
            Add a new member to the organization directory.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              Employee Code
            </label>
            <input
              type="text"
              value={formData.employeeCode}
              onChange={(e) =>
                setFormData({ ...formData, employeeCode: e.target.value })
              }
              className="block w-full px-4 py-2.5 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
              placeholder="e.g. EMP-101"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="block w-full px-4 py-2.5 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
              placeholder="John Doe"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              Work Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="block w-full px-4 py-2.5 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
              placeholder="john@company.com"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              Department
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              className="block w-full px-4 py-2.5 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
              placeholder="Engineering"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              System Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as any })
              }
              className="block w-full px-4 py-2.5 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all cursor-pointer"
            >
              <option value="employee">Standard Employee</option>
              <option value="hr">HR Manager</option>
              <option value="admin">System Admin</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              HOD Email (for approvals)
            </label>
            <input
              type="email"
              value={formData.hodEmail}
              onChange={(e) =>
                setFormData({ ...formData, hodEmail: e.target.value })
              }
              className="block w-full px-4 py-2.5 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
              placeholder="manager@company.com"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-[var(--color-primary)] text-white text-sm font-black rounded-[var(--radius-md)] shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <>
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Onboard Employee
            </>
          )}
        </button>
      </form>
    </div>
  );
}
