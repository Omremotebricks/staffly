import React, { useEffect, useState } from "react";
import { Form } from "../types/forms";
import Link from "next/link";
import { toast } from "sonner";
import { useConfirm } from "./ConfirmationContext";
import Loader from "./Loader";

interface FormsManagementProps {
  onFormPublished?: () => void;
}

export default function FormsManagement({
  onFormPublished,
}: FormsManagementProps) {
  const { askConfirm } = useConfirm();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadForms = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/forms", { credentials: "include" });
      const data = await res.json();
      if (Array.isArray(data)) setForms(data);
    } catch (err) {
      console.error("Failed to load forms:", err);
      toast.error("Failed to load forms");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadForms();
  }, [loadForms]);

  const getFormIcon = (title: string, iconName?: string) => {
    const name = (iconName || title).toLowerCase();
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

  const handlePublish = async (formId: string) => {
    const form = forms.find((f) => f.id === formId);
    if (form && (!form.fields || form.fields.length === 0)) {
      toast.error("Cannot publish an empty form. Please add fields first.");
      return;
    }

    const confirmed = await askConfirm({
      title: "Confirm Publication",
      message:
        "Are you sure you want to publish this form? It will be visible to all assigned users.",
      type: "info",
    });
    if (!confirmed) return;

    setActionLoading(formId);
    try {
      const res = await fetch(`/api/forms/${formId}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "published" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to publish form");
      }

      toast.success("Form published successfully!");
      await loadForms();
      onFormPublished?.();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error publishing form");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnpublish = async (formId: string) => {
    const confirmed = await askConfirm({
      title: "Unpublish Form",
      message:
        "Are you sure you want to unpublish this form? It will be moved back to drafts.",
      type: "warning",
    });
    if (!confirmed) return;

    setActionLoading(formId);
    try {
      const res = await fetch(`/api/forms/${formId}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "draft" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to unpublish form");
      }

      toast.success("Form unpublished successfully!");
      await loadForms();
      onFormPublished?.();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error unpublishing form");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (formId: string) => {
    const confirmed = await askConfirm({
      title: "Delete Form",
      message:
        "Are you sure you want to delete this form? This action cannot be undone.",
      type: "danger",
      confirmText: "Delete",
    });
    if (!confirmed) return;

    setActionLoading(formId);
    try {
      const res = await fetch(`/api/forms/${formId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete form");

      toast.success("Form deleted successfully!");
      await loadForms();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting form");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <Loader label="Fetching forms..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--color-bg-card)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
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
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-black text-[var(--color-text-primary)]">
              Enterprise Form Management
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] font-medium">
              Create, configure, and monitor dynamic data collection assets.
            </p>
          </div>
        </div>
        <Link
          href="/forms/builder"
          className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-[var(--radius-md)] text-sm font-black shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-[var(--color-primary-hover)] transition-all flex items-center justify-center gap-2"
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
          Build New Form
        </Link>
      </div>

      <div className="bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] overflow-hidden">
        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-[var(--color-border)]">
          {forms.length === 0 ? (
            <div className="p-10 text-center">
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
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-widest">
                No forms created yet
              </p>
            </div>
          ) : (
            forms.map((form) => (
              <div key={form.id} className="p-5 space-y-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0 border border-slate-100 dark:border-slate-700">
                    {getFormIcon(form.title, form.icon)}
                  </div>
                  <div>
                    <div className="font-black text-[var(--color-text-primary)] text-base">
                      {form.title}
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)] font-medium mt-1 leading-relaxed">
                      {form.description || "No description provided."}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${
                      form.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}
                  >
                    {form.status}
                  </span>
                </div>

                <div className="flex bg-[var(--color-bg-main)] p-3 rounded-[var(--radius-md)] border border-[var(--color-border)] divide-x divide-[var(--color-border)]">
                  <div className="flex-1 text-center">
                    <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">
                      Fields
                    </p>
                    <p className="font-bold text-[var(--color-text-primary)]">
                      {form.fields?.length || 0}
                    </p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">
                      Responses
                    </p>
                    <p className="font-bold text-[var(--color-text-primary)]">
                      -
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href={`/forms/builder?id=${form.id}`}
                    className="flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-slate-800 border border-[var(--color-border)] rounded-[var(--radius-md)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-primary)] hover:bg-slate-50 transition-all"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </Link>
                  <Link
                    href={`/forms/${form.id}/submissions`}
                    className="flex items-center justify-center gap-2 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 rounded-[var(--radius-md)] text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-all"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Reports
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[var(--color-bg-main)] text-[var(--color-text-muted)] uppercase text-[10px] font-black tracking-widest border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-5">Asset Identification</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Infrastructure</th>
                <th className="px-6 py-5">Created On</th>
                <th className="px-6 py-5 text-right">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {forms.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center text-[var(--color-text-muted)] font-bold italic"
                  >
                    No enterprise form assets currently synchronized.
                  </td>
                </tr>
              ) : (
                forms.map((form) => (
                  <tr
                    key={form.id}
                    className="hover:bg-[var(--color-bg-main)]/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0 border border-slate-100 dark:border-slate-700 group-hover:bg-[var(--color-primary-light)] group-hover:text-[var(--color-primary)] transition-colors">
                          {getFormIcon(form.title, form.icon)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-[var(--color-text-primary)] truncate">
                            {form.title}
                          </div>
                          <div className="text-[10px] text-[var(--color-text-secondary)] font-medium truncate max-w-[200px]">
                            {form.description ||
                              "No metadata description provided."}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${
                          form.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : form.status === "draft"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {form.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[var(--color-text-primary)]">
                          {form.fields?.length || 0}
                        </span>
                        <span className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-wider">
                          Parameters
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-text-secondary)] text-xs font-bold whitespace-nowrap">
                      {new Date(form.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-4 justify-end">
                        <Link
                          href={`/forms/builder?id=${form.id}`}
                          title="Configuration"
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                        >
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Link>

                        {form.status === "draft" ? (
                          <button
                            onClick={() => handlePublish(form.id)}
                            disabled={actionLoading === form.id}
                            title="Deploy to Enterprise"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-all disabled:opacity-50"
                          >
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
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnpublish(form.id)}
                            disabled={actionLoading === form.id}
                            title="Deactivate Asset"
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md transition-all disabled:opacity-50"
                          >
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
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </button>
                        )}

                        <Link
                          href={`/forms/${form.id}/submissions`}
                          title="Data Analytics"
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-all"
                        >
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
                              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </Link>

                        <button
                          onClick={() => handleDelete(form.id)}
                          disabled={actionLoading === form.id}
                          title="Purge Asset"
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-all disabled:opacity-50"
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
