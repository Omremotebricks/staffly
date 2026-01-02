"use client";

import React from "react";
import { FormBuilderProvider } from "../../../components/form-builder/FormBuilderContext";
import FormBuilder from "../../../components/form-builder/FormBuilder";

export default function NewFormPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Form</h1>
        <p className="text-gray-500">
          Design a dynamic form for your employees.
        </p>
      </div>

      <FormBuilderProvider>
        <FormBuilder />
      </FormBuilderProvider>
    </div>
  );
}
