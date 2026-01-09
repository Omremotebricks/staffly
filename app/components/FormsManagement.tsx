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

  const handlePublish = async (formId: string) => {
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
      <div className="flex justify-between items-center bg-[var(--color-bg-card)] p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
        <div>
          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
            Enterprise Dynamic Forms
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] font-medium">
            Create and manage custom data collection forms.
          </p>
        </div>
        <Link
          href="/forms/builder"
          className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-[var(--radius-md)] text-sm font-bold shadow-sm hover:bg-[var(--color-primary-hover)] transition-all flex items-center gap-2"
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
        <div className="md:hidden divide-y divide-gray-100">
          {forms.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-slate-400"
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
              <p className="text-sm font-medium text-[var(--color-text-muted)]">
                No forms created yet.
              </p>
            </div>
          ) : (
            forms.map((form) => (
              <div
                key={form.id}
                className="p-4 space-y-4 border-b border-[var(--color-border)]"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-[var(--color-text-primary)]">
                      {form.title}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      {form.description}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full ${
                      form.status === "published"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {form.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/forms/builder?id=${form.id}`}
                    className="flex-1 text-center py-2 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/forms/${form.id}/submissions`}
                    className="flex-1 text-center py-2 bg-indigo-50 border border-indigo-100 rounded-[var(--radius-sm)] text-[10px] font-bold uppercase tracking-wider text-indigo-600"
                  >
                    Submissions
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-bg-main)] text-[var(--color-text-muted)] uppercase text-[10px] font-black tracking-widest border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4">Form Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Fields</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {forms.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No forms created yet.
                  </td>
                </tr>
              ) : (
                forms.map((form) => (
                  <tr key={form.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {form.title}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1">
                        {form.description || "No description"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          form.status === "published"
                            ? "bg-green-100 text-green-700"
                            : form.status === "draft"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {form.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {form.fields?.length || 0} fields
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(form.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-4 justify-end">
                        <Link
                          href={`/forms/builder?id=${form.id}`}
                          className={`text-indigo-600 hover:text-indigo-700 text-xs font-bold uppercase tracking-wider transition-all ${
                            actionLoading === form.id
                              ? "opacity-50 pointer-events-none"
                              : ""
                          }`}
                        >
                          Edit
                        </Link>
                        {form.status === "draft" ? (
                          <button
                            onClick={() => handlePublish(form.id)}
                            disabled={actionLoading === form.id}
                            className="text-emerald-600 hover:text-emerald-700 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                          >
                            {actionLoading === form.id ? "..." : "Publish"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnpublish(form.id)}
                            disabled={actionLoading === form.id}
                            className="text-amber-600 hover:text-amber-700 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                          >
                            {actionLoading === form.id ? "..." : "Unpublish"}
                          </button>
                        )}
                        <Link
                          href={`/forms/${form.id}/submissions`}
                          className={`text-slate-600 hover:text-slate-800 text-xs font-bold uppercase tracking-wider transition-all ${
                            actionLoading === form.id
                              ? "opacity-50 pointer-events-none"
                              : ""
                          }`}
                        >
                          Reports
                        </Link>
                        <button
                          onClick={() => handleDelete(form.id)}
                          disabled={actionLoading === form.id}
                          className="text-red-600 hover:text-red-700 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                        >
                          {actionLoading === form.id ? "..." : "Delete"}
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
