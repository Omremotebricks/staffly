"use client";

import React, { useEffect, useState } from "react";
import {
  FormBuilderProvider,
  useFormBuilder,
} from "../../../../components/form-builder/FormBuilderContext";
import FormBuilder from "../../../../components/form-builder/FormBuilder";
import { useParams } from "next/navigation";

function EditFormLoader({ id }: { id: string }) {
  const { loadForm } = useFormBuilder();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/forms/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          loadForm(data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id, loadForm]);

  if (loading) return <div className="text-center py-20">Loading form...</div>;

  return <FormBuilder formId={id} />;
}

export default function EditFormPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Form</h1>
        <p className="text-gray-500">Modify existing form structure.</p>
      </div>

      <FormBuilderProvider>
        <EditFormLoader id={id} />
      </FormBuilderProvider>
    </div>
  );
}
