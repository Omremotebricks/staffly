"use client";

import { useState, useEffect } from "react";
import AppShell from "../../components/hrms/AppShell";
import LeaveRequestsList from "../../components/LeaveRequestsList";
import { useAuth } from "../../lib/auth";
import { getLeaveRequests, updateLeaveRequestStatus } from "../../lib/data";
import { toast } from "sonner";
import Loader from "../../components/Loader";
import { LeaveRequest } from "../../types";

export default function ManageLeavePage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getLeaveRequests();
      setRequests(data);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    const success = await updateLeaveRequestStatus(id, "approved", user?.name);
    if (success) {
      await loadRequests();
      toast.success("Leave request approved!");
    }
  };

  const handleReject = async (id: string, reason: string) => {
    const success = await updateLeaveRequestStatus(
      id,
      "rejected",
      undefined,
      reason
    );
    if (success) {
      await loadRequests();
      toast.success("Leave request rejected!");
    }
  };

  const exportToExcel = () => {
    // Standard CSV export logic
    const headers = [
      "Employee Code",
      "Employee Name",
      "Department",
      "Leave Type",
      "From Date",
      "To Date",
      "Days",
      "Status",
    ];
    const rows = requests.map((req) => [
      `"${req.employeeCode}"`,
      `"${req.employeeName}"`,
      `"${req.department}"`,
      `"${req.leaveType}"`,
      `"${req.fromDate}"`,
      `"${req.toDate}"`,
      req.numberOfDays,
      `"${req.status}"`,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leave_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (user && user.role === "employee") {
    return <div className="p-10 text-center font-bold">Access Denied</div>;
  }

  return (
    <AppShell title="Administrative Leave Management">
      {loading ? (
        <Loader label="Processing records..." />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--color-bg-card)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                Approvals Queue
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] font-medium">
                Review and process leave applications from across the
                organization.
              </p>
            </div>
            <button
              onClick={exportToExcel}
              className="inline-flex items-center px-4 py-2 border border-[var(--color-border)] text-sm font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-bg-main)] hover:shadow-sm transition-all gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export Records
            </button>
          </div>
          <LeaveRequestsList
            requests={requests}
            onApprove={handleApprove}
            onReject={handleReject}
            canManage={true}
          />
        </div>
      )}
    </AppShell>
  );
}
