export type FieldType =
  | "text"
  | "number"
  | "email"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "date"
  | "file";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, radio, checkbox
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface FormSettings {
  accessLevel: "all" | "restricted";
  allowedRoles?: string[];
  allowedDepartments?: string[];
  notificationEmail?: string;
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  settings: FormSettings;
  status: "draft" | "published" | "archived" | "disabled";
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  user_id: string;
  data: Record<string, any>;
  status: "submitted" | "reviewed" | "approved" | "rejected";
  submitted_at: string;
  updated_at: string;
  // Joins
  user?: {
    name: string;
    email: string;
  };
  form?: {
    title: string;
  };
}
