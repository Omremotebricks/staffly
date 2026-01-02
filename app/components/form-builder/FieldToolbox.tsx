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
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">Form Fields</h3>
      <div className="grid grid-cols-2 gap-2">
        {FIELD_TYPES.map((field) => (
          <button
            key={field.type}
            onClick={() => addField(field.type)}
            className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
          >
            <span className="text-2xl mb-1">{field.icon}</span>
            <span className="text-xs font-medium">{field.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-gray-900 mb-2">Form Settings</h3>
        <p className="text-xs text-gray-500">
          Configure access control and notifications in the main settings tab.
        </p>
      </div>
    </div>
  );
}
