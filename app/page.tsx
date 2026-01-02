"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./lib/auth";
import { LeaveRequest, User } from "./types";
import {
  getLeaveRequests,
  createLeaveRequest,
  updateLeaveRequestStatus,
} from "./lib/data";
import DashboardLayout from "./components/DashboardLayout";
import LeaveForm from "./components/LeaveForm";
import LeaveRequestsList from "./components/LeaveRequestsList";
import EmployeeManagement from "./components/EmployeeManagement";
import AttendanceCalendar from "./components/AttendanceCalendar";
import FormsManagement from "./components/FormsManagement";
import FormsList from "./components/FormsList";
import Login from "./components/Login";
import { useToast } from "./components/ToastContext";
import Loader from "./components/Loader";

export default function Home() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadLeaveRequests();
    }
  }, [user]);

  const loadLeaveRequests = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const requests = await getLeaveRequests(
        user.role === "employee" ? user.employeeCode : undefined
      );
      setLeaveRequests(requests);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveSubmit = async (
    request: Omit<LeaveRequest, "id" | "status" | "appliedDate">
  ) => {
    const newRequest = await createLeaveRequest(request);
    if (newRequest) {
      setLeaveRequests((prev) => [newRequest, ...prev]);
      showToast("Leave request submitted successfully!", "success");
    } else {
      showToast("Failed to submit leave request", "error");
    }
  };

  const handleApprove = async (id: string) => {
    const success = await updateLeaveRequestStatus(id, "approved", user?.name);
    if (success) {
      await loadLeaveRequests();
      showToast("Leave request approved!", "success");
    } else {
      showToast("Failed to approve leave request", "error");
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
      await loadLeaveRequests();
      showToast("Leave request rejected!", "success");
    } else {
      showToast("Failed to reject leave request", "error");
    }
  };

  const exportToExcel = () => {
    const headers = [
      "Employee Code",
      "Employee Name",
      "Department",
      "Leave Type",
      "From Date",
      "To Date",
      "Days",
      "Status",
      "Applied Date",
    ];

    const escapeCSV = (val: string) => {
      if (val === null || val === undefined) return "";
      const s = String(val);
      if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const rows = leaveRequests.map((req) => [
      escapeCSV(req.employeeCode),
      escapeCSV(req.employeeName),
      escapeCSV(req.department),
      escapeCSV(req.leaveType),
      escapeCSV(req.fromDate),
      escapeCSV(req.toDate),
      req.numberOfDays.toString(),
      escapeCSV(req.status),
      escapeCSV(req.appliedDate),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leave_requests_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getTabs = () => {
    const baseTabs = [
      { id: "overview", name: "Overview" },
      { id: "apply", name: "Apply Leave" },
      { id: "requests", name: "My Requests" },
      { id: "attendance", name: "Attendance" },
    ];

    if (user?.role === "hr" || user?.role === "admin") {
      baseTabs.push({ id: "manage", name: "Manage Requests" });
    }

    if (user?.role === "admin") {
      baseTabs.push({ id: "employees", name: "Employee Management" });
    }

    // Show Forms to all users
    baseTabs.push({ id: "forms", name: "Forms" });

    return baseTabs;
  };

  if (authLoading || (isAuthenticated && loading)) {
    return <Loader fullPage label="Loading your dashboard..." />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-0">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto pb-1 no-scrollbar">
            {getTabs().map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-semibold">T</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Requests
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {leaveRequests.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-semibold">P</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pending
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {
                          leaveRequests.filter(
                            (req) => req.status === "pending"
                          ).length
                        }
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-semibold">A</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Approved
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {
                          leaveRequests.filter(
                            (req) => req.status === "approved"
                          ).length
                        }
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "apply" && <LeaveForm onSubmit={handleLeaveSubmit} />}

        {activeTab === "requests" && (
          <LeaveRequestsList
            requests={leaveRequests}
            onApprove={handleApprove}
            onReject={handleReject}
            canManage={false}
          />
        )}

        {activeTab === "attendance" && <AttendanceCalendar />}

        {activeTab === "manage" &&
          (user?.role === "hr" || user?.role === "admin") && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  Manage Leave Requests
                </h2>
                <button
                  onClick={exportToExcel}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Export to Excel
                </button>
              </div>
              <LeaveRequestsList
                requests={leaveRequests}
                onApprove={handleApprove}
                onReject={handleReject}
                canManage={true}
              />
            </div>
          )}

        {activeTab === "employees" && user?.role === "admin" && (
          <EmployeeManagement onEmployeeCreated={loadLeaveRequests} />
        )}

        {activeTab === "forms" &&
          (user?.role === "admin" ? <FormsManagement /> : <FormsList />)}
      </div>
    </DashboardLayout>
  );
}
