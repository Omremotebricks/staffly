"use client";

import { useState, useEffect } from "react";
import AppShell from "../../components/hrms/AppShell";
import LeaveRequestsList from "../../components/LeaveRequestsList";
import { useAuth } from "../../lib/auth";
import { getLeaveRequests } from "../../lib/data";
import Loader from "../../components/Loader";
import { LeaveRequest } from "../../types";

export default function MyRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getLeaveRequests(user.employeeCode);
      setRequests(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="My Leave Requests">
      {loading ? (
        <Loader label="Fetching requests..." />
      ) : (
        <div className="space-y-6">
          <div className="bg-[var(--color-bg-card)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">
              Request History
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] font-medium">
              View the status and details of your submitted leave applications.
            </p>
          </div>
          <LeaveRequestsList
            requests={requests}
            onApprove={() => {}}
            onReject={() => {}}
            canManage={false}
          />
        </div>
      )}
    </AppShell>
  );
}
