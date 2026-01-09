"use client";

import AppShell from "./hrms/AppShell";
import { useAuth } from "../lib/auth";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  // Map pathname to a human-readable title
  const getTitle = () => {
    if (pathname.includes("/employees")) return "Employee Directory";
    if (pathname.includes("/attendance")) return "Attendance Management";
    if (pathname.includes("/payroll")) return "Payroll & Compensation";
    if (pathname.includes("/forms")) return "Dynamic Forms";
    return "Dashboard";
  };

  return <AppShell title={getTitle()}>{children}</AppShell>;
}
