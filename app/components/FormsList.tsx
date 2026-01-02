"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Form } from "../types/forms";
import { useAuth } from "../lib/auth";

export default function FormsList() {
  const { user } = useAuth();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/forms", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setForms(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading forms...</div>;

  const canCreateForms =
    user?.role === "admin" || user?.can_create_forms === true;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Available Forms</h2>
          <p className="text-sm text-gray-500">
            Select a form to fill and submit.
          </p>
        </div>

        {canCreateForms && (
          <Link
            href="/forms/builder"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            + Create New Form
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms
          .filter((f) => f.status === "published" || canCreateForms)
          .map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                    {form.title}
                  </h3>
                  {canCreateForms && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        form.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {form.status}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm line-clamp-2 h-10">
                  {form.description || "No description provided."}
                </p>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                {form.status === "published" && (
                  <Link
                    href={`/forms/${form.id}`}
                    className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition"
                  >
                    Fill Form
                  </Link>
                )}

                {canCreateForms && (
                  <Link
                    href={`/forms/builder?id=${form.id}`}
                    className="flex-1 text-center bg-white border border-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium transition"
                  >
                    Edit
                  </Link>
                )}
              </div>
            </div>
          ))}

        {forms.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">No forms available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
