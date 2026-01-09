"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Form } from "../../types/forms";
import { useAuth } from "../../lib/auth";

export default function FormsListPage() {
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

  const isAdmin = user?.role === "admin";

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
          <p className="text-gray-500">Manage and submit forms.</p>
        </div>

        {isAdmin && (
          <Link
            href="/dashboard/forms/builder"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span>+ Create New Form</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => (
          <div
            key={form.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                  {form.title}
                </h3>
                {isAdmin && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      form.status === "published"
                        ? "bg-green-100 text-green-700"
                        : form.status === "draft"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {form.status}
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
                {form.description || "No description provided."}
              </p>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                {/* Actions based on role */}
                {form.status === "published" && (
                  <Link
                    href={`/dashboard/forms/${form.id}`}
                    className="flex-1 text-center bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 text-sm font-medium"
                  >
                    Fill Form
                  </Link>
                )}

                {isAdmin && (
                  <>
                    <Link
                      href={`/dashboard/forms/builder/${form.id}`}
                      className="flex-1 text-center bg-gray-50 text-gray-700 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/dashboard/forms/${form.id}/submissions`}
                      className="flex-1 text-center bg-gray-50 text-gray-700 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium"
                    >
                      Submissions
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {forms.length === 0 && (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">No forms available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
