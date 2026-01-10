"use client";

import { useState } from "react";
import { createEmployee } from "../lib/data";
import Loader from "./Loader";

interface EmployeeManagementProps {
  onEmployeeCreated: () => void;
  hideHeader?: boolean;
}

export default function EmployeeManagement({
  onEmployeeCreated,
  hideHeader = false,
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
    <div
      className={`${
        hideHeader
          ? ""
          : "bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] rounded-[var(--radius-lg)]"
      } overflow-hidden max-w-4xl mx-auto`}
    >
      {!hideHeader && (
        <div className="p-8 border-b border-[var(--color-border)] bg-[var(--color-bg-main)]/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-[var(--radius-lg)] shadow-sm">
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
              <h2 className="text-xl font-black text-[var(--color-text-primary)]">
                Enterprise Onboarding
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] font-medium">
                Synchronize new talent assets with the organizational directory.
              </p>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`${hideHeader ? "p-6" : "p-8"} space-y-8`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Employee Code */}
          <div className="relative group/field">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 block group-focus-within/field:text-[var(--color-primary)] transition-colors">
              Employee Identification Code
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.employeeCode}
                onChange={(e) =>
                  setFormData({ ...formData, employeeCode: e.target.value })
                }
                className="w-full px-4 py-3 pr-12 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all outline-none text-sm font-bold"
                placeholder="e.g. EMP-2026"
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within/field:text-[var(--color-primary)] transition-colors">
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
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="relative group/field">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 block group-focus-within/field:text-[var(--color-primary)] transition-colors">
              Full Legal Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 pr-12 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all outline-none text-sm font-bold"
                placeholder="Johnathan Doe"
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within/field:text-[var(--color-primary)] transition-colors">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Work Email */}
          <div className="relative group/field">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 block group-focus-within/field:text-[var(--color-primary)] transition-colors">
              Organizational Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 pr-12 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all outline-none text-sm font-bold"
                placeholder="j.doe@enterprise.com"
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within/field:text-[var(--color-primary)] transition-colors">
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Department */}
          <div className="relative group/field">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 block group-focus-within/field:text-[var(--color-primary)] transition-colors">
              Assigned Department(s)
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="w-full px-4 py-3 pr-12 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all outline-none text-sm font-bold"
                placeholder="Engineering, Architecture..."
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within/field:text-[var(--color-primary)] transition-colors">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* System Role */}
          <div className="relative group/field">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 block group-focus-within/field:text-[var(--color-primary)] transition-colors">
              Access & Infrastructure Role
            </label>
            <div className="relative">
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as any })
                }
                className="w-full px-4 py-3 pr-12 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all outline-none text-sm font-black appearance-none"
              >
                <option value="employee">Standard </option>
                <option value="hr">Resource Manager</option>
                {/* <option value="admin">Infrastructure Admin</option> */}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within/field:text-[var(--color-primary)] transition-colors pointer-events-none">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* HOD Email */}
          <div className="relative group/field">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 block group-focus-within/field:text-[var(--color-primary)] transition-colors">
              Approval Authority (HOD)
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.hodEmail}
                onChange={(e) =>
                  setFormData({ ...formData, hodEmail: e.target.value })
                }
                className="w-full px-4 py-3 pr-12 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all outline-none text-sm font-bold"
                placeholder="authority@enterprise.com"
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within/field:text-[var(--color-primary)] transition-colors">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 bg-[var(--color-primary)] text-white text-sm font-black rounded-[var(--radius-md)] shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-[var(--color-primary-hover)] hover:shadow-1xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
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
              Initialize Asset Onboarding
            </>
          )}
        </button>
      </form>
    </div>
  );
}
