"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FormBuilderProvider,
  useFormBuilder,
} from "../../components/form-builder/FormBuilderContext";
import FormBuilder from "../../components/form-builder/FormBuilder";
import { useAuth } from "../../lib/auth";
import { useToast } from "../../components/ToastContext";
import Loader from "../../components/Loader";

function FormBuilderPageContent() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get("id");
  const { loadForm } = useFormBuilder();

  // Check permissions
  useEffect(() => {
    if (user && user.role !== "admin" && !user.can_create_forms) {
      showToast("You don't have permission to create forms.", "error");
      router.push("/");
    }
  }, [user, router]);

  const [loaded, setLoaded] = React.useState(false);

  // Load existing form if editing
  useEffect(() => {
    if (formId && !loaded) {
      fetch(`/api/forms/${formId}`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            loadForm(data);
            setLoaded(true);
          }
        })
        .catch((err) => console.error("Failed to load form:", err));
    }
  }, [formId, loadForm, loaded]);

  if (!user) {
    return <Loader fullPage label="Authenticating..." />;
  }

  if (user.role !== "admin" && !user.can_create_forms) {
    return null; // Will redirect
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {formId ? "Edit Form" : "Create New Form"}
        </h1>
        <p className="text-gray-500">
          Design a dynamic form for your employees.
        </p>
      </div>

      <FormBuilder formId={formId || undefined} userRole={user?.role} />
    </div>
  );
}

export default function NewFormPage() {
  return (
    <FormBuilderProvider>
      <Suspense fallback={<Loader fullPage label="Loading builder..." />}>
        <FormBuilderPageContent />
      </Suspense>
    </FormBuilderProvider>
  );
}
