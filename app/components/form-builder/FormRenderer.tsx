"use client";

import React, { useState } from "react";
import { Form, FormField } from "../../types/forms";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function FormRenderer({ form }: { form: Form }) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/forms/${form.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ data: formData }),
      });

      if (!res.ok) throw new Error("Submission failed");

      toast.success("Form submitted successfully!");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Error submitting form");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.title}</h1>
        {form.description && (
          <p className="text-gray-500 mb-6">{form.description}</p>
        )}

        <div className="space-y-6">
          {form.fields.map((field) => (
            <div key={field.id} className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {/* Render input based on type */}
              {field.type === "textarea" ? (
                <textarea
                  required={field.required}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              ) : field.type === "select" ? (
                <select
                  required={field.required}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === "radio" ? (
                <div className="space-y-2">
                  {field.options?.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={field.id}
                        value={opt}
                        required={field.required}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              ) : field.type === "checkbox" ? (
                <div className="space-y-2">
                  {field.options?.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={opt}
                        onChange={(e) => {
                          const current = formData[field.id] || [];
                          const newValue = e.target.checked
                            ? [...current, opt]
                            : current.filter((v: string) => v !== opt);
                          handleChange(field.id, newValue);
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type={field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
        >
          {submitting ? "Submitting..." : "Submit Form"}
        </button>
      </div>
    </form>
  );
}
