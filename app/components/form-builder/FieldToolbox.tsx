"use client";

import React from "react";
import { FieldType } from "../../types/forms";
import { useFormBuilder } from "./FormBuilderContext";

const FIELD_TYPES: { type: FieldType; label: string; icon: string }[] = [
  { type: "text", label: "Short Text", icon: "📝" },
  { type: "textarea", label: "Long Text", icon: "📄" },
  { type: "number", label: "Number", icon: "🔢" },
  { type: "email", label: "Email", icon: "📧" },
  { type: "select", label: "Dropdown", icon: "▼" },
  { type: "radio", label: "Single Choice", icon: "◉" },
  { type: "checkbox", label: "Multiple Choice", icon: "☑" },
  { type: "date", label: "Date", icon: "📅" },
  { type: "file", label: "File Upload", icon: "📎" },
];

export default function FieldToolbox() {
  const { addField } = useFormBuilder();

  return (
    <div className="bg-[var(--color-bg-card)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-6 bg-[var(--color-primary)] rounded-full" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-primary)]">
          Available Fields
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {FIELD_TYPES.map((field) => (
          <button
            key={field.type}
            onClick={() => addField(field.type)}
            className="group flex flex-col items-center justify-center p-4 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] hover:border-[var(--color-primary)] hover:bg-[var(--color-bg-card)] transition-all active:scale-95 shadow-sm"
          >
            <span className="text-2xl mb-2 transition-transform group-hover:scale-110">
              {field.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors text-center">
              {field.label}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-2 mb-3">
          <svg
            className="w-3.5 h-3.5 text-[var(--color-primary)]"
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
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-primary)]">
            Builder Hints
          </h3>
        </div>
        <p className="text-[10px] text-[var(--color-text-secondary)] font-medium leading-relaxed">
          Select a field type to add it to your form. You can customize
          properties like labels and validation in the main workspace.
        </p>
      </div>
    </div>
  );
}
