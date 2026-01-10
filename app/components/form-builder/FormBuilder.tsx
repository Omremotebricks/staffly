"use client";

import React, { useState } from "react";
import { useFormBuilder } from "./FormBuilderContext";
import FieldEditor from "./FieldEditor";
import FieldToolbox from "./FieldToolbox";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function FormBuilder({
  formId,
  userRole,
}: {
  formId?: string;
  userRole?: string;
}) {
  const {
    title,
    setTitle,
    description,
    setDescription,
    fields,
    settings,
    resetForm,
    fields: formFields,
  } = useFormBuilder();
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const isAdmin = userRole === "admin";

  const handleSave = async (status: "draft" | "published" = "draft") => {
    // Enforce at least one field for publication
    if (status === "published" && fields.length === 0) {
      toast.warning("Please add at least one field before publishing.");
      return;
    }

    // Non-admins can only save as draft
    if (!isAdmin && status === "published") {
      toast.error("Only administrators can publish forms.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title,
        description,
        fields,
        settings,
        status,
      };

      const url = formId ? `/api/forms/${formId}` : "/api/forms";
      const method = formId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      const data = await res.json();

      // Redirect to dashboard after saving
      toast.success("Form saved successfully!");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Error saving form");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-14rem)] gap-8 overflow-hidden">
      {/* Control Panel (Left Sidebar) */}
      <div className="w-full lg:w-[320px] lg:h-full flex-shrink-0 overflow-y-auto custom-scrollbar pr-0 lg:pr-2 space-y-6">
        <div className="space-y-6 pb-8">
          <div className="bg-[var(--color-bg-card)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-[var(--color-primary)] rounded-full" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-primary)]">
                Form Actions
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              {isAdmin && (
                <button
                  onClick={() => handleSave("published")}
                  disabled={saving}
                  className="w-full bg-[var(--color-primary)] text-white py-4 px-6 rounded-[var(--radius-md)] hover:bg-[var(--color-primary-hover)] transition-all disabled:opacity-50 font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-3 active:scale-95"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  Publish Form
                </button>
              )}
              <button
                onClick={() => handleSave("draft")}
                disabled={saving}
                className="w-full bg-[var(--color-bg-main)] text-[var(--color-text-primary)] border border-[var(--color-border)] py-4 px-6 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-card)] hover:border-[var(--color-primary)] transition-all disabled:opacity-50 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 shadow-sm"
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
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                Save as Draft
              </button>
            </div>
          </div>

          <FieldToolbox />
        </div>
      </div>

      {/* Main Workspace (Right Canvas) */}
      <div className="flex-1 overflow-y-auto pl-0 lg:pl-4 custom-scrollbar space-y-8">
        {/* Header Configuration Section */}
        <div className="bg-[var(--color-bg-card)] p-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-primary)] opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="flex items-center gap-4 mb-6">
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                Form Configuration
              </h3>
            </div>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl font-bold text-[var(--color-text-primary)] w-full bg-transparent border-none focus:ring-0 placeholder-slate-300 dark:placeholder-slate-700 p-0"
              placeholder="Enter Form Title"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-sm font-medium text-[var(--color-text-secondary)] w-full bg-transparent border-none focus:ring-0 placeholder-slate-300 dark:placeholder-slate-700 p-0"
              placeholder="Enter a brief description of this form..."
            />
          </div>
        </div>

        {/* Fields Container */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                Form Elements ({fields.length})
              </h4>
            </div>
          </div>

          {fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] bg-[var(--color-bg-main)]/30 group">
              <div className="w-20 h-20 bg-[var(--color-bg-card)] rounded-3xl border border-[var(--color-border)] shadow-sm flex items-center justify-center mb-6 text-slate-300 group-hover:scale-110 group-hover:text-[var(--color-primary)] transition-all">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                No fields added yet
              </p>
              <p className="text-[10px] font-medium text-[var(--color-text-secondary)]">
                Select a field type from the toolbox to start building.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {fields.map((field, index) => (
                <FieldEditor key={field.id} field={field} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
