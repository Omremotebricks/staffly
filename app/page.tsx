"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./lib/auth";
import { LeaveRequest, User } from "./types";
import { getLeaveRequests, getAllUsers } from "./lib/data";
import Link from "next/link";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./components/Login";
import { toast } from "sonner";
import { useToast } from "./components/ToastContext";
import Loader from "./components/Loader";
import { useCallback, useRef } from "react";

export default function Home() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const isFetching = useRef(false);

  const loadData = useCallback(async () => {
    if (!user || isFetching.current) return;

    isFetching.current = true;
    setLoading(true);
    try {
      // Step 1: Fetch users first
      const users = await getAllUsers();
      setAllUsers(users);

      // Step 2: Fetch leave requests using the already fetched users to avoid redundancy
      const requests = await getLeaveRequests(
        user.role === "employee" ? user.employeeCode : undefined,
        users,
      );
      setLeaveRequests(requests);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [user?.id, user?.role, user?.employeeCode]);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id, loadData]);

  if (authLoading || (isAuthenticated && loading)) {
    return <Loader fullPage label="Syncing enterprise data..." />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Hero */}
        <div className="relative overflow-hidden bg-[var(--color-bg-card)] p-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)] opacity-[0.03] rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)] mb-2">
              Welcome back, {user?.name.split(" ")[0]}!
            </h1>
            <p className="text-[var(--color-text-secondary)] font-medium max-w-2xl">
              You are currently logged in as{" "}
              <span className="text-[var(--color-primary)] font-bold">
                {user?.role}
              </span>
              . Here is what's happening in your organization today.
            </p>
          </div>
        </div>

        {/* Dash Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] p-5 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-1">
              Total Workforce
            </p>
            <p className="text-3xl font-black text-[var(--color-text-primary)]">
              {allUsers.length}
            </p>
          </div>
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] p-5 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-1">
              Departments
            </p>
            <p className="text-3xl font-black text-[var(--color-text-primary)]">
              {new Set(allUsers.map((u) => u.department)).size}
            </p>
          </div>
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] p-5 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-1">
              Active Leaves
            </p>
            <p className="text-3xl font-black text-amber-600">
              {leaveRequests.filter((r) => r.status === "approved").length}
            </p>
          </div>
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] p-5 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-1">
              Forms Live
            </p>
            <p className="text-3xl font-black text-indigo-600">12</p>
          </div>
        </div>

        {/* Tactical KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-[var(--radius-md)]">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">
                Active Requests
              </span>
            </div>
            <p className="text-4xl font-black text-[var(--color-text-primary)] mb-1">
              {leaveRequests.length}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] font-bold">
              Total instances recorded
            </p>
          </div>

          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-[var(--radius-md)]">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">
                Awaiting Action
              </span>
            </div>
            <p className="text-4xl font-black text-[var(--color-text-primary)] mb-1">
              {leaveRequests.filter((req) => req.status === "pending").length}
            </p>
            <p className="text-xs text-amber-600 font-bold">
              Requires immediate review
            </p>
          </div>

          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-[var(--radius-md)]">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">
                Approved
              </span>
              <button
                onClick={() => toast.info("Report generation coming soon...")}
                className="text-indigo-600 hover:text-indigo-700 text-xs font-bold uppercase tracking-wider transition-all"
              >
                Report
              </button>
            </div>
            <p className="text-4xl font-black text-[var(--color-text-primary)] mb-1">
              {leaveRequests.filter((req) => req.status === "approved").length}
            </p>
            <p className="text-xs text-emerald-600 font-bold">
              Finalized applications
            </p>
          </div>
        </div>

        {/* Feature Grid / Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/leave/apply"
                className="p-4 bg-[var(--color-bg-main)] rounded-[var(--radius-md)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all group"
              >
                <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-5 h-5 text-[var(--color-primary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">
                  Apply Leave
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] font-medium">
                  Request time off
                </p>
              </Link>
              <Link
                href="/attendance"
                className="p-4 bg-[var(--color-bg-main)] rounded-[var(--radius-md)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all group"
              >
                <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-5 h-5 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">
                  Attendance
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] font-medium">
                  Clock in/out
                </p>
              </Link>
            </div>
          </div>

          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
              System Notice
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] font-medium max-w-xs">
              The performance review cycle for Q1 2026 will begin on February
              1st. Please ensure all objective settings are finalized by next
              week.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
