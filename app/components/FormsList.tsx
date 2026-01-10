"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Form } from "../types/forms";
import { useAuth } from "../lib/auth";

export default function FormsList() {
  const { user } = useAuth();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/forms", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setForms(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading forms...</div>;

  const getFormIcon = (title: string, iconName?: string) => {
    const name = (iconName || title).toLowerCase();

    // Icon Mapping
    if (
      name.includes("asset") ||
      name.includes("equipment") ||
      name.includes("hardware")
    ) {
      return (
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
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
          />
        </svg>
      );
    }
    if (
      name.includes("survey") ||
      name.includes("feedback") ||
      name.includes("review")
    ) {
      return (
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
            d="M11 5h8M11 12h8M11 19h8M5 6h.01M5 12h.01M5 18h.01"
          />
        </svg>
      );
    }
    if (
      name.includes("travel") ||
      name.includes("expense") ||
      name.includes("claim")
    ) {
      return (
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    }
    if (
      name.includes("onboarding") ||
      name.includes("hiring") ||
      name.includes("recruit")
    ) {
      return (
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
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
      );
    }
    if (
      name.includes("event") ||
      name.includes("request") ||
      name.includes("booking")
    ) {
      return (
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
      );
    }

    // Default File Icon
    return (
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
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    );
  };

  const canCreateForms =
    user?.role === "admin" || user?.can_create_forms === true;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--color-bg-card)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-[var(--radius-lg)] shadow-sm">
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-black text-[var(--color-text-primary)]">
              Enterprise Portals
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] font-medium">
              Access and manage localized dynamic submission workflows.
            </p>
          </div>
        </div>

        {canCreateForms && (
          <Link
            href="/forms/builder"
            className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-[var(--radius-md)] hover:bg-[var(--color-primary-hover)] transition-all text-sm font-black shadow-lg shadow-indigo-100 dark:shadow-none"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Form
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms
          .filter((f) => f.status === "published" || canCreateForms)
          .map((form) => (
            <div
              key={form.id}
              className="group bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border)] overflow-hidden hover:shadow-xl hover:border-[var(--color-primary)] transition-all flex flex-col hover-lift"
            >
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[var(--color-primary-light)] group-hover:text-[var(--color-primary)] group-hover:border-[var(--color-primary-light)] transition-colors shadow-sm">
                    {getFormIcon(form.title, form.icon)}
                  </div>
                  {canCreateForms && (
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${
                        form.status === "published"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}
                    >
                      {form.status}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                  {form.title}
                </h3>
                <p className="text-[var(--color-text-secondary)] text-sm line-clamp-2 h-10 font-medium leading-relaxed">
                  {form.description ||
                    "No description provided for this enterprise form."}
                </p>
              </div>

              <div className="px-6 py-4 bg-[var(--color-bg-main)] border-t border-[var(--color-border)] flex gap-3">
                {form.status === "published" && (
                  <Link
                    href={`/forms/${form.id}`}
                    className="flex-1 text-center bg-[var(--color-primary)] text-white py-2.5 rounded-[var(--radius-md)] hover:bg-[var(--color-primary-hover)] text-xs font-black uppercase tracking-wider transition-all shadow-sm"
                  >
                    Fill Form
                  </Link>
                )}

                {canCreateForms && (
                  <Link
                    href={`/forms/builder?id=${form.id}`}
                    className="flex-1 text-center bg-white dark:bg-slate-800 border border-[var(--color-border)] text-[var(--color-text-primary)] py-2.5 rounded-[var(--radius-md)] hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-black uppercase tracking-wider transition-all"
                  >
                    Edit
                  </Link>
                )}
              </div>
            </div>
          ))}

        {forms.length === 0 && (
          <div className="col-span-full text-center py-20 bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border)]">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
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
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h4 className="font-bold text-[var(--color-text-primary)] mb-1">
              No Enterprise Forms
            </h4>
            <p className="text-sm text-[var(--color-text-secondary)] font-medium">
              There are currently no published forms available for your account.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
