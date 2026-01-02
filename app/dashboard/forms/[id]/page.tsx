"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Form as FormType } from "../../../types/forms";
import FormRenderer from "../../../components/form-builder/FormRenderer";

export default function SubmitFormPage() {
  const params = useParams();
  const id = params.id as string;
  const [form, setForm] = useState<FormType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/forms/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setForm(data);
      })
      .catch((err) => setError("Failed to load form"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading form...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!form) return <div className="p-6">Form not found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <FormRenderer form={form} />
    </div>
  );
}
