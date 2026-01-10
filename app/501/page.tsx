"use client";

import Link from "next/link";
import AppShell from "../components/hrms/AppShell";

export default function NotImplemented() {
  return (
    <AppShell title="Feature Coming Soon">
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-sm border border-amber-100">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
            Under Development
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-10 leading-relaxed font-medium">
            We're currently building this module to bring you a world-class HR
            experience. This feature will be available in the next system
            update.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3 bg-[var(--color-primary)] text-white font-black rounded-[var(--radius-md)] hover:bg-[var(--color-primary-hover)] transition-all shadow-lg shadow-indigo-100 dark:shadow-none uppercase tracking-wider text-xs"
            >
              Back to Safety
            </Link>
            <button className="w-full sm:w-auto px-8 py-3 bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-bg-main)] transition-all text-xs uppercase tracking-wider">
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
