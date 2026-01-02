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
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded font-mono uppercase">
            {field.type}
          </span>
          <h3 className="font-medium text-gray-900">Field #{index + 1}</h3>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => index > 0 && moveField(index, index - 1)}
            disabled={index === 0}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
            title="Move Up"
          >
            ↑
          </button>
          <button
            onClick={() => moveField(index, index + 1)} // Check bounds in parent or just let it fail silently if at end
            className="text-gray-400 hover:text-gray-600"
            title="Move Down"
          >
            ↓
          </button>
          <button
            onClick={() => removeField(field.id)}
            className="text-red-400 hover:text-red-600 ml-2"
            title="Delete Field"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Label
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => updateField(field.id, { label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Field Label"
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Placeholder
          </label>
          <input
            type="text"
            value={field.placeholder || ""}
            onChange={(e) =>
              updateField(field.id, { placeholder: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Placeholder text"
          />
        </div>

        <div className="col-span-2 flex items-center gap-4 py-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) =>
                updateField(field.id, { required: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Required</span>
          </label>
        </div>

        {/* Options Editor for Select, Radio, Checkbox */}
        {(field.type === "select" ||
          field.type === "radio" ||
          field.type === "checkbox") && (
          <div className="col-span-2 border-t pt-4 mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options
            </label>
            <div className="space-y-2">
              {field.options?.map((option, optIndex) => (
                <div key={optIndex} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(field.options || [])];
                      newOptions[optIndex] = e.target.value;
                      updateField(field.id, { options: newOptions });
                    }}
                    className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => {
                      const newOptions = field.options?.filter(
                        (_, i) => i !== optIndex
                      );
                      updateField(field.id, { options: newOptions });
                    }}
                    className="text-gray-400 hover:text-red-500 px-1"
                  >
                    ×
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
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add Option
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
