"use client";

import React, { useState } from "react";
import { useFormBuilder } from "./FormBuilderContext";
import FieldEditor from "./FieldEditor";
import FieldToolbox from "./FieldToolbox";
import { useRouter } from "next/navigation";
import { useToast } from "../ToastContext";

export default function FormBuilder({
  formId,
  userRole,
}: {
  formId?: string;
  userRole?: string;
}) {
  const { showToast } = useToast();
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
      showToast("Please add at least one field before publishing.", "warning");
      return;
    }

    // Non-admins can only save as draft
    if (!isAdmin && status === "published") {
      showToast("Only administrators can publish forms.", "error");
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
      showToast("Form saved successfully!", "success");
      router.push("/");
    } catch (error) {
      console.error(error);
      showToast("Error saving form", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-12rem)] gap-6">
      <div className="flex-1 overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl lg:text-3xl font-bold text-gray-900 w-full border-none focus:ring-0 placeholder-gray-300 px-0"
            placeholder="Form Title"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-sm lg:text-base text-gray-500 w-full border-none focus:ring-0 placeholder-gray-300 mt-2 px-0"
            placeholder="Form Description (Optional)"
          />
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-10 lg:py-20 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <p className="text-gray-500 px-4">
              No fields added yet. Select a field type from the toolbox.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-8 lg:mb-0">
            {fields.map((field, index) => (
              <FieldEditor key={field.id} field={field} index={index} />
            ))}
          </div>
        )}
      </div>

      <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 sticky top-4">
          <div className="flex flex-col gap-3">
            {isAdmin && (
              <button
                onClick={() => handleSave("published")}
                disabled={saving}
                className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium text-sm lg:text-base"
              >
                {saving ? "Saving..." : "Publish Form"}
              </button>
            )}
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 text-sm lg:text-base font-medium"
            >
              Save as Draft
            </button>
          </div>
        </div>

        <div className="lg:block">
          <FieldToolbox />
        </div>
      </div>
    </div>
  );
}
