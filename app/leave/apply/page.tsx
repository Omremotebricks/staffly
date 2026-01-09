"use client";

import AppShell from "../../components/hrms/AppShell";
import LeaveForm from "../../components/LeaveForm";
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
      <div className="max-w-3xl mx-auto">
        <LeaveForm onSubmit={handleLeaveSubmit} />
      </div>
    </AppShell>
  );
}
