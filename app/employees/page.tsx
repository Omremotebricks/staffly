"use client";

import { useState, useEffect } from "react";
import AppShell from "../components/hrms/AppShell";
import EmployeeManagement from "../components/EmployeeManagement";
import { getAllUsers } from "../lib/data";
import { User } from "../types";
import Loader from "../components/Loader";
import Modal from "../components/Modal";

export default function EmployeesPage() {
  const ENTRIES_PER_PAGE = 5;
  const [showAddForm, setShowAddForm] = useState(false);
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  const totalPages = Math.ceil(filteredEmployees.length / ENTRIES_PER_PAGE);
  const startIndex = (currentPage - 1) * ENTRIES_PER_PAGE;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + ENTRIES_PER_PAGE
  );

  return (
    <AppShell title="Global Asset Directory">
      <div className="space-y-6">
        <Modal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          title="Initialize Asset Onboarding"
          description="Synchronize new talent assets with the organizational directory."
        >
          <EmployeeManagement
            hideHeader
            onEmployeeCreated={() => {
              setShowAddForm(false);
              loadEmployees();
            }}
          />
        </Modal>

        <div className="bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] overflow-hidden">
          {/* Header & Controls */}
          <div className="p-8 border-b border-[var(--color-border)] bg-[var(--color-bg-main)]/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-[var(--color-text-primary)]">
                  Infrastructure Directory
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium">
                  Monitor and manage multi-departmental talent assets.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative flex-1 sm:min-w-[320px] group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors">
                  <svg
                    className="w-4 h-4"
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
                  placeholder="Identify by name, role, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm font-bold focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all outline-none"
                />
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 text-xs font-black uppercase tracking-widest bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--color-primary-hover)] transition-all shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-3 active:scale-95"
              >
                <svg
                  className="w-4 h-4"
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
                Onboard Talent
              </button>
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-hidden">
            <table className="w-full text-left">
              <thead className="bg-[var(--color-bg-main)]/50 border-b border-[var(--color-border)]">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">
                    Resource Asset
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">
                    Division
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">
                    Access tier
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">
                    System ID
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">
                    Operational
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest text-right">
                    Management
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-black">
                          Synchronizing Enterprise Directory...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-24 text-center">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                        <svg
                          className="w-8 h-8 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-black">
                        No resource assets identified in current scope.
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="group hover:bg-[var(--color-bg-main)] transition-colors cursor-pointer"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-[var(--color-primary)] font-black text-lg transition-transform group-hover:scale-110 shadow-sm">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-[var(--color-text-primary)] mb-0.5">
                              {emp.name}
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)] font-medium">
                              {emp.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-wrap gap-1.5">
                          {emp.department.split(",").map((dept, idx) => (
                            <span
                              key={idx}
                              className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm"
                            >
                              {dept.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                            emp.role === "admin"
                              ? "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800"
                              : emp.role === "hr"
                              ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                              : "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800"
                          }`}
                        >
                          {emp.role}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs text-[var(--color-text-muted)] font-black font-mono tracking-tighter">
                          {emp.employeeCode}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              emp.isActive
                                ? "bg-emerald-500 animate-pulse"
                                : "bg-slate-300 dark:bg-slate-600"
                            }`}
                          />
                          <span
                            className={`text-[10px] font-black uppercase tracking-widest ${
                              emp.isActive
                                ? "text-emerald-600"
                                : "text-slate-400"
                            }`}
                          >
                            {emp.isActive ? "Online" : "Terminated"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="w-10 h-10 inline-flex items-center justify-center text-slate-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-xl transition-all active:scale-95 border border-transparent hover:border-[var(--color-primary-light)] shadow-sm">
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

          {/* Footer Navigation */}
          <div className="px-8 py-6 border-t border-[var(--color-border)] bg-[var(--color-bg-main)]/30 flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-black">
              Showing {Math.min(startIndex + 1, filteredEmployees.length)} -{" "}
              {Math.min(
                startIndex + ENTRIES_PER_PAGE,
                filteredEmployees.length
              )}{" "}
              of {filteredEmployees.length} identified assets
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)] disabled:opacity-30 transition-all shadow-sm"
              >
                Prev Node
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-primary)] hover:border-[var(--color-primary)] disabled:opacity-30 transition-all shadow-sm"
              >
                Next Node
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
