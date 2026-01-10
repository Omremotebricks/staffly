import { useState } from "react";
import { LeaveRequest } from "../types";
import { useAuth } from "../lib/auth";

interface LeaveRequestsListProps {
  requests: LeaveRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  canManage: boolean;
}

export default function LeaveRequestsList({
  requests,
  onApprove,
  onReject,
  canManage,
}: LeaveRequestsListProps) {
  const { user } = useAuth();
  const ENTRIES_PER_PAGE = 5;
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null
  );
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(
    null
  );

  const handleFilterChange = (f: any) => {
    setFilter(f);
    setCurrentPage(1);
  };

  const statusColors: { [key: string]: string } = {
    approved:
      "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
    rejected:
      "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800",
    pending:
      "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  };

  const getStatusColor = (status: string) =>
    statusColors[status] || statusColors.pending;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return "✓";
      case "rejected":
        return "✕";
      default:
        return "⏳";
    }
  };

  const getLeaveTypeStyle = (type: string) => {
    switch (type) {
      case "CL":
        return "bg-sky-100 text-sky-700 border-sky-200";
      case "PL":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "LWP":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Comp OFF":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const getLeaveTypeLabel = (type: string) => {
    switch (type) {
      case "CL":
        return "Casual Leave";
      case "PL":
        return "Privileged Leave";
      case "LWP":
        return "Leave Without Pay";
      case "Comp OFF":
        return "Compensatory Off";
      default:
        return type;
    }
  };

  const handleRejectTrigger = (id: string) => {
    setRejectingRequestId(id);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const confirmRejection = () => {
    if (rejectingRequestId && rejectReason.trim()) {
      onReject(rejectingRequestId, rejectReason);
      setShowRejectModal(false);
      setRejectingRequestId(null);
      setRejectReason("");
    }
  };

  const filteredRequests = requests.filter((req) =>
    filter === "all" ? true : req.status === filter
  );

  const totalPages = Math.ceil(filteredRequests.length / ENTRIES_PER_PAGE);
  const startIndex = (currentPage - 1) * ENTRIES_PER_PAGE;
  const paginatedRequests = filteredRequests.slice(
    startIndex,
    startIndex + ENTRIES_PER_PAGE
  );

  // Business Rule: Check if current user can approve/reject this specific request
  const canUserApprove = (request: LeaveRequest) => {
    if (!user || request.status !== "pending") return false;

    // 1. Cannot self-approve
    if (user.employeeCode === request.employeeCode) return false;

    // 2. Admin can approve anything else
    if (user.role === "admin") return true;

    // 3. HR can only approve 'employee' role requests
    if (user.role === "hr") {
      return request.employeeRole === "employee";
    }

    return false;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => handleFilterChange(f as any)}
            className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all border ${
              filter === f
                ? "bg-[var(--color-primary)] text-white shadow-md border-[var(--color-primary)]"
                : "bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-bg-main)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] bg-[var(--color-bg-main)]">
          <div className="text-4xl mb-4 opacity-50">📭</div>
          <h4 className="text-[var(--color-text-primary)] font-bold mb-2">
            No Requests Found
          </h4>
          <p className="text-[var(--color-text-secondary)] text-sm">
            {filter === "all"
              ? "You don't have any leave requests yet."
              : `No ${filter} requests to show.`}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
            <table className="min-w-full divide-y divide-[var(--color-border)]">
              <thead className="bg-[var(--color-bg-main)]">
                <tr>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest border-b border-[var(--color-border)]">
                    Employee Asset
                  </th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest border-b border-[var(--color-border)]">
                    Leave Framework
                  </th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest border-b border-[var(--color-border)]">
                    Temporal Range
                  </th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest border-b border-[var(--color-border)]">
                    Operational Status
                  </th>
                  {canManage && (
                    <th className="px-6 py-5 text-right text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest border-b border-[var(--color-border)]">
                      Management Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {paginatedRequests.map((request) => (
                  <tr
                    key={request.id}
                    onClick={() => setSelectedRequest(request)}
                    className="hover:bg-[var(--color-bg-main)] transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs mr-3">
                          {request.employeeName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[var(--color-text-primary)]">
                            {request.employeeName}
                          </div>
                          <div className="text-xs text-[var(--color-text-secondary)] font-medium">
                            {request.department} •{" "}
                            <span className="uppercase text-[var(--color-text-muted)]">
                              {request.employeeRole}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        title={getLeaveTypeLabel(request.leaveType)}
                        className={`text-xs font-bold px-2 py-1 rounded-[var(--radius-sm)] border ${getLeaveTypeStyle(
                          request.leaveType
                        )}`}
                      >
                        {request.leaveType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--color-text-primary)] font-medium">
                        {request.fromDate}{" "}
                        <span className="text-[var(--color-text-muted)] mx-1">
                          →
                        </span>{" "}
                        {request.toDate}
                      </div>
                      <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                        {request.numberOfDays} days
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {getStatusIcon(request.status)}{" "}
                        <span className="capitalize">{request.status}</span>
                      </span>
                    </td>
                    {canManage && (
                      <td
                        className="px-6 py-4 whitespace-nowrap text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {canUserApprove(request) ? (
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => onApprove(request.id)}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-[var(--radius-md)] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectTrigger(request.id)}
                              className="px-3 py-1.5 bg-white text-rose-600 border border-rose-100 rounded-[var(--radius-md)] text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all shadow-sm"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          request.status === "pending" && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-muted)] bg-[var(--color-bg-main)] px-2 py-1 rounded border border-[var(--color-border)] italic">
                              {request.employeeCode === user?.employeeCode
                                ? "Self-Approval Restricted"
                                : "Limited Access"}
                            </span>
                          )
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {paginatedRequests.map((request) => (
              <div
                key={request.id}
                onClick={() => setSelectedRequest(request)}
                className="bg-[var(--color-bg-card)] p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] active:scale-98 transition-transform"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm mr-3 shadow-sm">
                      {request.employeeName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-[var(--color-text-primary)]">
                        {request.employeeName}
                      </div>
                      <div className="text-xs text-[var(--color-text-secondary)]">
                        {request.department} •{" "}
                        <span className="uppercase">
                          {request.employeeRole}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {getStatusIcon(request.status)}{" "}
                    <span className="capitalize">{request.status}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="bg-[var(--color-bg-main)] p-2 rounded-[var(--radius-md)] border border-[var(--color-border)] flex flex-col justify-center">
                    <p className="text-xs text-[var(--color-text-muted)] uppercase font-black mb-1">
                      Type
                    </p>
                    <div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full border ${getLeaveTypeStyle(
                          request.leaveType
                        )}`}
                      >
                        {request.leaveType}
                      </span>
                    </div>
                  </div>
                  <div className="bg-[var(--color-bg-main)] p-2 rounded-[var(--radius-md)] border border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-text-muted)] uppercase font-black mb-1">
                      Duration
                    </p>
                    <p className="font-medium text-[var(--color-text-primary)]">
                      {request.numberOfDays} Days
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-sm text-[var(--color-text-secondary)] mb-4 bg-[var(--color-bg-main)] px-3 py-2 rounded-md border border-dashed border-[var(--color-border)]">
                  <span className="mr-2">🗓️</span>
                  <span>{request.fromDate}</span>
                  <span className="mx-2 text-[var(--color-text-muted)]">➜</span>
                  <span>{request.toDate}</span>
                </div>

                {canManage && request.status === "pending" && (
                  <div
                    className="flex gap-3 mt-4 pt-4 border-t border-[var(--color-border)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {canUserApprove(request) ? (
                      <>
                        <button
                          onClick={() => onApprove(request.id)}
                          className="flex-1 py-2 bg-green-50 text-green-700 font-bold rounded-[var(--radius-md)] border border-green-200 hover:bg-green-100 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectTrigger(request.id)}
                          className="flex-1 py-2 bg-red-50 text-red-700 font-bold rounded-[var(--radius-md)] border border-red-200 hover:bg-red-100 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <div className="w-full text-center py-2 bg-[var(--color-bg-main)] rounded-md border text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] italic">
                        {request.employeeCode === user?.employeeCode
                          ? "Self-Approval Restricted"
                          : "Management Only"}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Details Modal */}
          {selectedRequest && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => setSelectedRequest(null)}
              ></div>
              <div className="relative bg-[var(--color-bg-card)] rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-[var(--color-border)] flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-bg-main)]">
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                    Leave Request Details
                  </h3>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="p-2 rounded-full hover:bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] transition-colors border border-transparent hover:border-[var(--color-border)]"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto space-y-6">
                  {/* Status Banner */}
                  <div
                    className={`p-4 rounded-[var(--radius-lg)] border flex items-start gap-3 ${getStatusColor(
                      selectedRequest.status
                    )}`}
                  >
                    <div className="text-xl mt-0.5">
                      {getStatusIcon(selectedRequest.status)}
                    </div>
                    <div>
                      <p className="font-bold capitalize text-lg">
                        {selectedRequest.status}
                      </p>
                      {selectedRequest.status === "rejected" &&
                        selectedRequest.rejectionReason && (
                          <p className="mt-1 text-sm opacity-90">
                            <strong>Reason:</strong>{" "}
                            {selectedRequest.rejectionReason}
                          </p>
                        )}
                      {selectedRequest.status === "approved" &&
                        selectedRequest.approvedBy && (
                          <p className="mt-1 text-sm opacity-90">
                            Approved by{" "}
                            <strong>{selectedRequest.approvedBy}</strong>
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Employee Info */}
                  <div className="flex items-center p-4 bg-[var(--color-bg-main)] rounded-[var(--radius-lg)] border border-[var(--color-border)]">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg mr-4 shadow-sm">
                      {selectedRequest.employeeName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--color-text-primary)] text-lg">
                        {selectedRequest.employeeName}
                      </h4>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {selectedRequest.department} •{" "}
                        {selectedRequest.employeeCode} •{" "}
                        <span className="uppercase font-bold">
                          {selectedRequest.employeeRole}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Leave Details Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-[var(--color-bg-main)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
                      <p className="text-xs text-[var(--color-text-muted)] uppercase font-black mb-1">
                        Leave Type
                      </p>
                      <span
                        className={`text-sm font-bold px-2 py-0.5 rounded-full border ${getLeaveTypeStyle(
                          selectedRequest.leaveType
                        )}`}
                      >
                        {getLeaveTypeLabel(selectedRequest.leaveType)}
                      </span>
                    </div>
                    <div className="p-3 bg-[var(--color-bg-main)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
                      <p className="text-xs text-[var(--color-text-muted)] uppercase font-black mb-1">
                        Duration
                      </p>
                      <p className="font-bold text-[var(--color-text-primary)]">
                        {selectedRequest.numberOfDays} Days
                      </p>
                    </div>
                    <div className="col-span-2 p-3 bg-[var(--color-bg-main)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
                      <p className="text-xs text-[var(--color-text-muted)] uppercase font-black mb-1">
                        Date Range
                      </p>
                      <p className="font-mono font-medium text-[var(--color-text-primary)]">
                        {selectedRequest.fromDate}{" "}
                        <span className="text-[var(--color-text-muted)] mx-2">
                          to
                        </span>{" "}
                        {selectedRequest.toDate}
                      </p>
                    </div>
                  </div>

                  {/* Reason Section */}
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)] uppercase font-black mb-2">
                      Reason for Leave
                    </p>
                    <div className="p-4 bg-[var(--color-bg-main)] rounded-[var(--radius-lg)] border border-[var(--color-border)] italic text-[var(--color-text-secondary)]">
                      "{selectedRequest.reason}"
                    </div>
                  </div>
                </div>

                {/* Modal Footer (Admin Actions) */}
                {canManage && selectedRequest.status === "pending" && (
                  <div className="p-4 bg-[var(--color-bg-main)] border-t border-[var(--color-border)] flex gap-3">
                    {canUserApprove(selectedRequest) ? (
                      <>
                        <button
                          onClick={() => {
                            onApprove(selectedRequest.id);
                            setSelectedRequest(null);
                          }}
                          className="flex-1 py-2.5 bg-green-600 text-white font-bold rounded-[var(--radius-md)] hover:bg-green-700 transition-colors shadow-sm"
                        >
                          Approve Request
                        </button>
                        <button
                          onClick={() => {
                            handleRejectTrigger(selectedRequest.id);
                            setSelectedRequest(null);
                          }}
                          className="flex-1 py-2.5 bg-white text-red-600 border border-red-200 font-bold rounded-[var(--radius-md)] hover:bg-red-50 transition-colors"
                        >
                          Reject Request
                        </button>
                      </>
                    ) : (
                      <div className="w-full text-center py-3 bg-[var(--color-bg-main)] rounded-xl border border-dashed text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">
                        {selectedRequest.employeeCode === user?.employeeCode
                          ? "Self-Approval Restricted"
                          : "Administrative Approval Required"}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Footer Navigation */}
          <div className="px-8 py-6 border-t border-[var(--color-border)] bg-[var(--color-bg-main)]/30 flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-black">
              Showing {Math.min(startIndex + 1, filteredRequests.length)} -{" "}
              {Math.min(startIndex + ENTRIES_PER_PAGE, filteredRequests.length)}{" "}
              of {filteredRequests.length} identified requests
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)] disabled:opacity-30 transition-all shadow-sm"
              >
                Prev Batch
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-primary)] hover:border-[var(--color-primary)] disabled:opacity-30 transition-all shadow-sm"
              >
                Next Batch
              </button>
            </div>
          </div>

          {/* Rejection Modal */}
          {showRejectModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300"
                onClick={() => setShowRejectModal(false)}
              />
              <div className="relative bg-[var(--color-bg-card)] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[var(--color-border)] animate-in zoom-in-95 fade-in duration-200">
                <div className="px-6 py-5 border-b border-[var(--color-border)] bg-[var(--color-bg-main)]">
                  <h3 className="text-sm font-black uppercase tracking-widest text-rose-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                    Reject Application
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 block px-1">
                      Reason for Rejection
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Please specify why this request is being declined..."
                      className="w-full h-32 px-4 py-3 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all resize-none placeholder:text-[var(--color-text-muted)]/50"
                    />
                    <p className="text-[10px] mt-2 text-[var(--color-text-muted)] italic px-1">
                      Required for official record keeping
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-[var(--color-bg-main)] border-t border-[var(--color-border)] flex gap-3">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-full hover:bg-[var(--color-bg-card)] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmRejection}
                    disabled={!rejectReason.trim()}
                    className="flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Reject
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
