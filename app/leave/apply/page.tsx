"use client";

import AppShell from "../../components/hrms/AppShell";
import LeaveForm from "../../components/LeaveForm";
import LeaveBalance from "../../components/LeaveBalance";
import { useAuth } from "../../lib/auth";
import { createLeaveRequest } from "../../lib/data";
import { toast } from "sonner";
import { LeaveRequest } from "../../types";
import { useRouter } from "next/navigation";

export default function ApplyLeavePage() {
  const { user } = useAuth();
  const router = useRouter();
  const handleLeaveSubmit = async (
    request: Omit<LeaveRequest, "id" | "status" | "appliedDate">
  ) => {
    try {
      const result = await createLeaveRequest(request);
      if (result) {
        toast.success("Leave request submitted successfully!");
        router.push("/leave/requests");
      } else {
        toast.error("Failed to submit leave request.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <AppShell title="Apply for Leave">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Application Form (Left) */}
        <div className="flex-1 w-full order-2 lg:order-1">
          <LeaveForm onSubmit={handleLeaveSubmit} />
        </div>

        {/* Leave Summary Sidebar (Right) */}
        <div className="w-full lg:w-[320px] lg:sticky lg:top-24 space-y-6 order-1 lg:order-2">
          <div className="bg-[var(--color-bg-card)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse" />
              Leave Summary
            </h3>
            <LeaveBalance />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
