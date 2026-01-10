"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "../../lib/auth";
import Login from "../Login";
import Loader from "../Loader";

export default function AppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader fullPage label="Securing enterprise session..." />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-main)] transition-colors relative">
      {/* Subtle background grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-text-muted) 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      <Sidebar />
      <div className="flex-1 ml-[var(--sidebar-width)] flex flex-col relative z-10 transition-all duration-300">
        <Header title={title} />
        <main className="flex-1 p-[var(--spacing-xl)] overflow-y-auto w-full max-w-[1600px] mx-auto min-h-[calc(100vh-var(--header-height))]">
          {children}
        </main>
      </div>
    </div>
  );
}
