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

  const getFieldIcon = (type: string) => {
    switch (type) {
      case "text":
      case "textarea":
        return (
          <svg
            className="w-3.5 h-3.5"
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
        );
      case "number":
        return (
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
            />
          </svg>
        );
      case "email":
        return (
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case "select":
      case "radio":
      case "checkbox":
        return (
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        );
      case "date":
      case "month":
      case "datetime-local":
        return (
          <svg
            className="w-3.5 h-3.5"
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
      case "time":
        return (
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Form Header */}
      <div className="bg-[var(--color-bg-card)] p-8 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border)] relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-primary)]" />
        <div className="flex items-center gap-5">
          <div className="p-4 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-2xl shadow-sm">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
              {form.title}
            </h1>
            {form.description && (
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1 opacity-80 max-w-2xl">
                {form.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-bg-card)] p-8 rounded-[var(--radius-lg)] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[var(--color-border)]">
        <div className="space-y-10">
          {form.fields.map((field) => (
            <div key={field.id} className="flex flex-col gap-4 group/field">
              {/* Field Label */}
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] group-focus-within/field:text-[var(--color-primary)] transition-colors flex items-center gap-2">
                  <span className="p-1.5 bg-[var(--color-bg-main)] rounded-lg text-[var(--color-primary)]">
                    {getFieldIcon(field.type)}
                  </span>
                  {field.label}
                  {field.required && (
                    <span className="text-rose-500 font-bold">*</span>
                  )}
                </label>
              </div>

              {/* Render dynamic input */}
              <div className="relative">
                {field.type === "textarea" ? (
                  <textarea
                    required={field.required}
                    placeholder={field.placeholder}
                    className="w-full px-5 py-4 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all outline-none text-sm font-bold leading-relaxed resize-none shadow-sm"
                    rows={4}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  />
                ) : field.type === "select" ? (
                  <div className="relative group/select">
                    <select
                      required={field.required}
                      className="w-full px-5 py-4 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all outline-none text-sm font-bold appearance-none cursor-pointer shadow-sm pr-12"
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select an option...
                      </option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within/select:text-[var(--color-primary)] transition-colors">
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
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                ) : field.type === "radio" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {field.options?.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-4 p-4 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] cursor-pointer hover:border-[var(--color-primary)] hover:bg-white transition-all group/radio shadow-sm"
                      >
                        <div className="relative flex items-center">
                          <input
                            type="radio"
                            name={field.id}
                            value={opt}
                            required={field.required}
                            onChange={(e) =>
                              handleChange(field.id, e.target.value)
                            }
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 border-2 border-[var(--color-border)] rounded-full peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary-light)] flex items-center justify-center transition-all">
                            <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-primary)] group-hover/radio:text-[var(--color-primary)] transition-colors">
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : field.type === "checkbox" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {field.options?.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-4 p-4 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] cursor-pointer hover:border-[var(--color-primary)] hover:bg-white transition-all group/check shadow-sm"
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
                          className="peer sr-only"
                        />
                        <div className="w-5 h-5 border-2 border-[var(--color-border)] rounded-lg flex items-center justify-center peer-checked:bg-[var(--color-primary)] peer-checked:border-[var(--color-primary)] transition-all shadow-sm">
                          <svg
                            className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-primary)] group-hover/check:text-[var(--color-primary)] transition-colors">
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="relative group/input">
                    <input
                      type={field.type}
                      required={field.required}
                      placeholder={field.placeholder}
                      className={`w-full ${
                        ["date", "time", "month", "datetime-local"].includes(
                          field.type
                        )
                          ? "pr-14"
                          : ""
                      } px-5 py-4 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all outline-none text-sm font-bold shadow-sm`}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      onClick={(e) => {
                        if (
                          ["date", "time", "month", "datetime-local"].includes(
                            field.type
                          )
                        ) {
                          try {
                            if (
                              typeof (e.currentTarget as any).showPicker ===
                              "function"
                            ) {
                              (e.currentTarget as any).showPicker();
                            }
                          } catch (err) {
                            console.log("showPicker not supported");
                          }
                        }
                      }}
                    />
                    {["date", "time", "month", "datetime-local"].includes(
                      field.type
                    ) && (
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within/input:text-[var(--color-primary)] transition-colors">
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
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Submission Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-primary)]">
              Form Submission
            </p>
            <p className="text-[10px] font-medium text-[var(--color-text-secondary)] mt-0.5">
              Please ensure all required fields are correctly filled before
              submitting.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full md:w-auto min-w-[240px] bg-[var(--color-primary)] text-white px-10 py-4 rounded-[var(--radius-md)] hover:bg-[var(--color-primary-hover)] transition-all disabled:opacity-50 text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-3 active:scale-95"
        >
          {submitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
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
              Submit Form
            </>
          )}
        </button>
      </div>
    </form>
  );
}
