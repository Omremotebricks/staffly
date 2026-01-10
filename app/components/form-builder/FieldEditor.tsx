"use client";

import React from "react";
import { FormField } from "../../types/forms";
import { useFormBuilder } from "./FormBuilderContext";

interface FieldEditorProps {
  field: FormField;
  index: number;
}

export default function FieldEditor({ field, index }: FieldEditorProps) {
  const { updateField, removeField, moveField } = useFormBuilder();

  // Simple drag and drop handle visualization (implementation would require dnd library, but keeping it simple for now or using buttons)

  return (
    <div className="bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] overflow-hidden transition-all hover:shadow-md group/field">
      {/* Field Header */}
      <div className="px-6 py-4 bg-[var(--color-bg-main)]/50 border-b border-[var(--color-border)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-[var(--color-border)] text-[10px] font-bold text-[var(--color-primary)] shadow-sm">
            {index + 1}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] border-r border-[var(--color-border)] pr-3 mr-1">
              {field.type}
            </span>
            <input
              type="text"
              value={field.label || ""}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
              className="bg-transparent border-none focus:ring-0 text-sm font-bold text-[var(--color-text-primary)] p-0 w-auto min-w-[120px]"
              placeholder="Field Label..."
            />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => index > 0 && moveField(index, index - 1)}
            disabled={index === 0}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-lg transition-all disabled:opacity-0"
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
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
          <button
            onClick={() => moveField(index, index + 1)}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-lg transition-all"
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div className="w-px h-4 bg-[var(--color-border)] mx-1" />
          <button
            onClick={() => removeField(field.id)}
            className="w-8 h-8 flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-lg transition-all"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] flex items-center gap-2">
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              Standard Label
            </label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm font-bold focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all outline-none"
              placeholder="Display text for this field..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] flex items-center gap-2">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Placeholder
            </label>
            <input
              type="text"
              value={field.placeholder || ""}
              onChange={(e) =>
                updateField(field.id, { placeholder: e.target.value })
              }
              className="w-full px-4 py-3 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm font-bold focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all outline-none"
              placeholder="Instructional placeholder text..."
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex items-center gap-6 pt-2">
            <label className="flex items-center gap-3 cursor-pointer group/toggle">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) =>
                    updateField(field.id, { required: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-[var(--color-primary)] transition-colors" />
                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-primary)] group-hover/toggle:text-[var(--color-primary)] transition-colors">
                Required Field
              </span>
            </label>
          </div>

          {/* Options Editor for Select, Radio, Checkbox */}
          {(field.type === "select" ||
            field.type === "radio" ||
            field.type === "checkbox") && (
            <div className="col-span-1 md:col-span-2 bg-[var(--color-bg-main)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] space-y-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] flex items-center gap-2">
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  Field Options
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {field.options?.map((option, optIndex) => (
                  <div key={optIndex} className="flex gap-2 group/opt">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(field.options || [])];
                        newOptions[optIndex] = e.target.value;
                        updateField(field.id, { options: newOptions });
                      }}
                      className="flex-1 px-4 py-2 text-xs bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] font-bold focus:border-[var(--color-primary)] outline-none transition-all"
                    />
                    <button
                      onClick={() => {
                        const newOptions = field.options?.filter(
                          (_, i) => i !== optIndex
                        );
                        updateField(field.id, { options: newOptions });
                      }}
                      className="text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover/opt:opacity-100"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    updateField(field.id, {
                      options: [
                        ...(field.options || []),
                        `Option ${(field.options?.length || 0) + 1}`,
                      ],
                    })
                  }
                  className="flex items-center justify-center gap-2 py-2 px-4 border border-dashed border-[var(--color-border)] rounded-[var(--radius-md)] text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all active:scale-95"
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
                      strokeWidth={3}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Option
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
