"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FormSubmission, Form } from "../../../../types/forms";

export default function FormSubmissionsPage() {
  const params = useParams();
  const id = params.id as string;
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch form details
    fetch(`/api/forms/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setForm(data);
      });

    // Fetch submissions
    fetch(`/api/forms/${id}/submissions`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSubmissions(data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading submissions...</div>;

  const exportToCSV = () => {
    if (!submissions.length) return;

    // Helper to flatten data for CSV
    const headers = [
      "Submitted At",
      "Employee",
      "Email",
      "Status",
      ...Object.keys(submissions[0].data || {}),
    ];
    const rows = submissions.map((sub) => [
      new Date(sub.submitted_at).toLocaleString(),
      sub.user?.name || "N/A",
      sub.user?.email || "N/A",
      sub.status,
      ...Object.keys(submissions[0].data || {}).map((key) => sub.data[key]),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `submissions_${form?.title || "form"}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
          <p className="text-gray-500">
            {form?.title
              ? `Viewing submissions for "${form.title}"`
              : "Form Submissions"}
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-700 uppercase">
              <tr>
                <th className="px-6 py-3 font-semibold">Submitted At</th>
                <th className="px-6 py-3 font-semibold">Employee</th>
                <th className="px-6 py-3 font-semibold">Data Review</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {submissions.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No submissions found.
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(sub.submitted_at).toLocaleDateString()}{" "}
                      {new Date(sub.submitted_at).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {sub.user?.name || "Unknown"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {sub.user?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                        {/* Show a preview of the data */}
                        {Object.entries(sub.data || {}).map(([key, value]) => (
                          <span
                            key={key}
                            className="mr-2 inline-block bg-gray-100 px-2 py-0.5 rounded text-xs"
                          >
                            <span className="font-semibold">{key}:</span>{" "}
                            {String(value)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
