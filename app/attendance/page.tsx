"use client";

import AppShell from "../components/hrms/AppShell";
import AttendanceCalendar from "../components/AttendanceCalendar";
import { useState } from "react";
import { toast } from "sonner";

export default function AttendancePage() {
  const [isClockedIn, setIsClockedIn] = useState(false);

  const handleClockAction = () => {
    const newStatus = !isClockedIn;
    setIsClockedIn(newStatus);
    toast.success(
      `Successfully ${
        newStatus ? "Clocked In" : "Clocked Out"
      } at ${new Date().toLocaleTimeString()}`
    );
  };

  return (
    <AppShell title="Attendance Management">
      <div className="bg-[var(--color-bg-card)] p-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
              My Attendance
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Track your daily clock-in/out and work hours.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClockAction}
              className={`px-4 py-2 rounded-[var(--radius-md)] font-bold text-sm transition-all flex items-center gap-2 shadow-lg ${
                isClockedIn
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-red-100"
                  : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-indigo-100"
              }`}
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {isClockedIn ? "Clock Out" : "Clock In"}
            </button>
          </div>
        </div>

        <AttendanceCalendar />
      </div>
    </AppShell>
  );
}
