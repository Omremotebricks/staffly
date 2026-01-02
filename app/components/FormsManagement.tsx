import React, { useEffect, useState } from "react";
import { Form } from "../types/forms";
import Link from "next/link";
import { useToast } from "./ToastContext";
import { useConfirm } from "./ConfirmationContext";
import Loader from "./Loader";

interface FormsManagementProps {
  onFormPublished?: () => void;
}

export default function FormsManagement({
  onFormPublished,
}: FormsManagementProps) {
  const { showToast } = useToast();
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

      showToast("Form published successfully!", "success");
      await loadForms();
      onFormPublished?.();
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Error publishing form", "error");
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

      showToast("Form unpublished successfully!", "success");
      await loadForms();
      onFormPublished?.();
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Error unpublishing form", "error");
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

      showToast("Form deleted successfully!", "success");
      await loadForms();
    } catch (error) {
      console.error(error);
      showToast("Error deleting form", "error");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <Loader label="Fetching forms..." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">All Forms</h3>
        <Link
          href="/forms/builder"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          + Create New Form
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {forms.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No forms created yet.
            </div>
          ) : (
            forms.map((form) => (
              <div key={form.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {form.title}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {form.description}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                      form.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {form.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{form.fields?.length || 0} fields</span>
                  <span>{new Date(form.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href={`/forms/builder?id=${form.id}`}
                    className={`text-blue-600 font-medium text-xs ${
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
                      className="text-green-600 font-medium text-xs disabled:opacity-50"
                    >
                      {actionLoading === form.id ? "..." : "Publish"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnpublish(form.id)}
                      disabled={actionLoading === form.id}
                      className="text-yellow-600 font-medium text-xs disabled:opacity-50"
                    >
                      {actionLoading === form.id ? "..." : "Unpublish"}
                    </button>
                  )}
                  <Link
                    href={`/forms/${form.id}/submissions`}
                    className={`text-purple-600 font-medium text-xs ${
                      actionLoading === form.id
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                  >
                    Submissions
                  </Link>
                  <button
                    onClick={() => handleDelete(form.id)}
                    disabled={actionLoading === form.id}
                    className="text-red-600 font-medium text-xs disabled:opacity-50"
                  >
                    {actionLoading === form.id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Form Title</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Fields</th>
                <th className="px-6 py-3 font-semibold">Created</th>
                <th className="px-6 py-3 font-semibold">Actions</th>
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
                      <div className="flex gap-4">
                        <Link
                          href={`/forms/builder?id=${form.id}`}
                          className={`text-blue-600 hover:text-blue-700 text-sm font-medium ${
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
                            className="text-green-600 hover:text-green-700 text-sm font-medium disabled:opacity-50"
                          >
                            {actionLoading === form.id ? "..." : "Publish"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnpublish(form.id)}
                            disabled={actionLoading === form.id}
                            className="text-yellow-600 hover:text-yellow-700 text-sm font-medium disabled:opacity-50"
                          >
                            {actionLoading === form.id ? "..." : "Unpublish"}
                          </button>
                        )}
                        <Link
                          href={`/forms/${form.id}/submissions`}
                          className={`text-purple-600 hover:text-purple-700 text-sm font-medium ${
                            actionLoading === form.id
                              ? "opacity-50 pointer-events-none"
                              : ""
                          }`}
                        >
                          Submissions
                        </Link>
                        <button
                          onClick={() => handleDelete(form.id)}
                          disabled={actionLoading === form.id}
                          className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
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
