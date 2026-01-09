"use client";

import Link from "next/link";
import AppShell from "./components/hrms/AppShell";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-main)] p-4">
      <div className="text-center">
        <div className="text-9xl font-black text-[var(--color-primary)] opacity-10 mb-[-4rem]">
          404
        </div>
        <div className="bg-[var(--color-bg-card)] p-12 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-md)] relative z-10">
          <div className="w-20 h-20 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            Page Not Found
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-8 max-w-xs mx-auto">
            The requested module or resource could not be found. It might have
            been moved or doesn't exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-primary-hover)] transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
