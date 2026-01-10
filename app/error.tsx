"use client";

import { useEffect } from "react";
import AppShell from "./components/hrms/AppShell";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-main)] p-4">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-[var(--color-text-primary)] mb-2">
          Something went wrong
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-8 font-medium">
          An unexpected error occurred while processing your request. Please try
          again or contact support if the issue persists.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-8 py-3 bg-[var(--color-primary)] text-white font-black rounded-[var(--radius-md)] hover:bg-[var(--color-primary-hover)] transition-all shadow-lg shadow-indigo-100 dark:shadow-none uppercase tracking-wider text-xs"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3 bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-bg-main)] transition-all text-xs uppercase tracking-wider"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
