"use client";

import { useState } from "react";
import { useAuth } from "../lib/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password);

    if (!success) {
      setError("Invalid credentials or account not approved by admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-main)] transition-colors relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)] opacity-[0.03] rounded-full -mr-64 -mt-64 transition-all"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[var(--color-primary)] opacity-[0.03] rounded-full -ml-32 -mb-32 transition-all"></div>

      <div className="max-w-md w-full p-8 bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-md)] relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg shadow-indigo-200 dark:shadow-none">
            S
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            Staffly
          </h2>
          <p className="mt-2 text-[var(--color-text-secondary)] font-medium">
            Advanced HR Management System
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-[var(--radius-md)] text-center animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
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
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  disabled={loading}
                  className="block w-full pl-10 pr-3 py-2.5 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all disabled:opacity-50"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  required
                  disabled={loading}
                  className="block w-full pl-10 pr-3 py-2.5 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all disabled:opacity-50"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
              />
              <span className="text-xs text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors font-medium">
                Remember me
              </span>
            </label>
            <button
              type="button"
              className="text-xs font-bold text-[var(--color-primary)] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 bg-[var(--color-primary)] text-white text-sm font-bold rounded-[var(--radius-md)] shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all disabled:opacity-50"
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
              "Sign in to Dashboard"
            )}
          </button>

          <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
            <p className="text-[10px] text-[var(--color-text-muted)] text-center uppercase font-bold tracking-widest mb-3">
              Enterprise Access Points
            </p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: "HR Admin", email: "hr@company.com" },
                { label: "Global Admin", email: "admin@company.com" },
                { label: "Standard Employee", email: "employee@company.com" },
              ].map((acc) => (
                <div
                  key={acc.email}
                  className="flex items-center justify-between px-3 py-1.5 bg-[var(--color-bg-main)] rounded-[var(--radius-sm)] border border-transparent hover:border-[var(--color-border)] transition-colors cursor-help group"
                >
                  <span className="text-[10px] font-bold text-[var(--color-text-secondary)]">
                    {acc.label}
                  </span>
                  <span className="text-[10px] text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors">
                    {acc.email}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
