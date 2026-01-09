"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { FormField, FormSettings, FieldType } from "../../types/forms";

interface FormBuilderContextType {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  fields: FormField[];
  addField: (type: FieldType) => void;
  removeField: (id: string) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  moveField: (dragIndex: number, hoverIndex: number) => void;
  settings: FormSettings;
  updateSettings: (settings: Partial<FormSettings>) => void;
  resetForm: () => void;
  loadForm: (data: any) => void;
}

const FormBuilderContext = createContext<FormBuilderContextType | undefined>(
  undefined
);

export function FormBuilderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [settings, setSettings] = useState<FormSettings>({
    accessLevel: "all",
  });

  const addField = React.useCallback((type: FieldType) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type,
      label: `New ${type} field`,
      required: false,
      options:
        type === "select" || type === "radio" || type === "checkbox"
          ? ["Option 1", "Option 2"]
          : undefined,
    };
    setFields((prev) => [...prev, newField]);
  }, []);

  const removeField = React.useCallback((id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const updateField = React.useCallback(
    (id: string, updates: Partial<FormField>) => {
      setFields((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
      );
    },
    []
  );

  const moveField = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setFields((prev) => {
        const newFields = [...prev];
        const dragField = newFields[dragIndex];
        newFields.splice(dragIndex, 1);
        newFields.splice(hoverIndex, 0, dragField);
        return newFields;
      });
    },
    []
  );

  const updateSettings = React.useCallback((updates: Partial<FormSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetForm = React.useCallback(() => {
    setTitle("Untitled Form");
    setDescription("");
    setFields([]);
    setSettings({ accessLevel: "all" });
  }, []);

  const loadForm = React.useCallback((data: any) => {
    setTitle(data.title || "Untitled Form");
    setDescription(data.description || "");
    setFields(data.fields || []);
    setSettings(data.settings || { accessLevel: "all" });
  }, []);

  return (
    <FormBuilderContext.Provider
      value={{
        title,
        setTitle,
        description,
        setDescription,
        fields,
        addField,
        removeField,
        updateField,
        moveField,
        settings,
        updateSettings,
        resetForm,
        loadForm,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
}

export function useFormBuilder() {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error("useFormBuilder must be used within a FormBuilderProvider");
  }
  return context;
}
