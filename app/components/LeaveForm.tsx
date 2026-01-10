"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../lib/auth";
import { getEmployeeByCode, calculateDays } from "../lib/data";
import { LeaveRequest, Employee } from "../types";

interface LeaveFormProps {
  onSubmit: (
    request: Omit<LeaveRequest, "id" | "status" | "appliedDate">
  ) => Promise<void>;
}

export default function LeaveForm({ onSubmit }: LeaveFormProps) {
  const { user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeCode: user?.employeeCode || "",
    leaveType: "CL" as const,
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const fromDateRef = useRef<HTMLInputElement>(null);
  const toDateRef = useRef<HTMLInputElement>(null);

  const handleDateClick = (ref: React.RefObject<HTMLInputElement | null>) => {
    const input = ref.current;
    if (input) {
      try {
        if (typeof (input as any).showPicker === "function") {
          (input as any).showPicker();
        } else {
          input.focus();
          input.click();
        }
      } catch (e) {
        input.focus();
        input.click();
      }
    }
  };

  useEffect(() => {
    if (formData.employeeCode) {
      getEmployeeByCode(formData.employeeCode).then(setEmployee);
    }
  }, [formData.employeeCode]);

  const numberOfDays =
    formData.fromDate && formData.toDate
      ? calculateDays(formData.fromDate, formData.toDate)
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const employeeData = employee || {
      name: user?.name || "",
      department: user?.department || "",
      hodEmail: user?.hodEmail || "hr@company.com",
    };

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
        reason: formData.reason,
      });

      setFormData({
        employeeCode: user?.employeeCode || "",
        leaveType: "CL",
        fromDate: "",
        toDate: "",
        reason: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] rounded-[var(--radius-lg)] p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            Apply for Leave
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] font-medium">
            Fill in the details below to submit your leave request.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 bg-[var(--color-bg-main)] rounded-[var(--radius-lg)] border border-[var(--color-border)] flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {(employee?.name || user?.name || "?").charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-[var(--color-text-primary)] text-lg">
              {employee?.name || user?.name || "Loading..."}
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">
              {formData.employeeCode}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              Employee Code
            </label>
            <input
              type="text"
              value={formData.employeeCode}
              readOnly
              className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm font-bold text-[var(--color-text-secondary)] cursor-not-allowed"
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              Department(s)
            </label>
            <div className="flex flex-wrap gap-2">
              {(() => {
                const depts = (
                  employee?.department ||
                  user?.department ||
                  "N/A"
                )
                  .split(",")
                  .map((d) => d.trim())
                  .filter(Boolean);
                if (depts.length <= 1) {
                  return (
                    <div className="w-full px-4 cursor-not-allowed py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm font-semibold text-[var(--color-text-secondary)]">
                      {depts[0] || "N/A"}
                    </div>
                  );
                }
                return depts.map((dept) => (
                  <span
                    key={dept}
                    className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-bold"
                  >
                    {dept}
                  </span>
                ));
              })()}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider block">
            Leave Category
          </label>
          <div className="flex flex-wrap gap-3">
            {[
              { id: "CL", label: "Casual Leave" },
              { id: "PL", label: "Privilege Leave" },
              { id: "LWP", label: "Without Pay" },
              { id: "Comp OFF", label: "Comp Off" },
            ].map((type) => (
              <label
                key={type.id}
                className="flex-1 min-w-[120px] cursor-pointer group"
              >
                <input
                  type="radio"
                  name="leaveType"
                  value={type.id}
                  checked={formData.leaveType === type.id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      leaveType: e.target.value as any,
                    })
                  }
                  className="hidden"
                />
                <div
                  className={`px-3 py-3 text-center rounded-[var(--radius-md)] border transition-all flex items-center justify-center min-h-[56px] ${
                    formData.leaveType === type.id
                      ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md shadow-indigo-100 dark:shadow-none translate-y-[-2px]"
                      : "bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">
                    {type.label}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              From Date
            </label>
            <div
              onClick={() => handleDateClick(fromDateRef)}
              className="relative cursor-pointer group"
            >
              <input
                ref={fromDateRef}
                type="date"
                value={formData.fromDate}
                onChange={(e) =>
                  setFormData({ ...formData, fromDate: e.target.value })
                }
                className="block w-full pl-4 pr-10 py-2.5 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all cursor-pointer"
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              To Date
            </label>
            <div
              onClick={() => handleDateClick(toDateRef)}
              className="relative cursor-pointer group"
            >
              <input
                ref={toDateRef}
                type="date"
                value={formData.toDate}
                onChange={(e) =>
                  setFormData({ ...formData, toDate: e.target.value })
                }
                className="block w-full pl-4 pr-10 py-2.5 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all cursor-pointer"
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {numberOfDays > 0 && (
          <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-[var(--radius-md)]">
            <span className="text-sm font-bold text-indigo-900">
              Total Duration
            </span>
            <span className="text-lg font-black text-indigo-600">
              {numberOfDays} {numberOfDays === 1 ? "Day" : "Days"}
            </span>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
            Reason for Leave
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
            rows={3}
            className="block w-full px-4 py-2.5 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all resize-none"
            placeholder="Please provide a brief explanation..."
            required
          />
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Submit Application
            </>
          )}
        </button>
      </form>
    </div>
  );
}
