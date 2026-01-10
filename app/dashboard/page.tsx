"use client";

import AppShell from "../components/hrms/AppShell";

const stats = [
  {
    label: "Total Employees",
    value: "5,241",
    change: "+12%",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    label: "On Leave Today",
    value: "35",
    change: "-2%",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    label: "Open Roles",
    value: "18",
    change: "0%",
    icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    label: "Pending Approvals",
    value: "12",
    change: "+5",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

const recentEmployees = [
  {
    id: 1,
    name: "Alex Chen",
    department: "Engineering",
    role: "Senior Developer",
    status: "Active",
    avatar: "AC",
  },
  {
    id: 2,
    name: "Sarah Miller",
    department: "Marketing",
    role: "Manager",
    status: "On Leave",
    avatar: "SM",
  },
  {
    id: 3,
    name: "Michael Ross",
    department: "Finance",
    role: "Analyst",
    status: "Active",
    avatar: "MR",
  },
  {
    id: 4,
    name: "Emily Davis",
    department: "HR",
    role: "Specialist",
    status: "Active",
    avatar: "ED",
  },
  {
    id: 5,
    name: "David Wilson",
    department: "Engineering",
    role: "Junior dev",
    status: "Onboarding",
    avatar: "DW",
  },
];

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard">
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[var(--color-bg-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-[var(--shadow-sm)] hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
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
                      d={stat.icon}
                    />
                  </svg>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--color-bg-main)] border border-[var(--color-border)]">
                  <span
                    className={`text-[10px] font-black tracking-tighter ${
                      stat.change.startsWith("+")
                        ? "text-emerald-600"
                        : stat.change === "0%"
                        ? "text-slate-400"
                        : "text-rose-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">
                {stat.label}
              </p>
              <h3 className="text-2xl font-black mt-1 text-[var(--color-text-primary)] tabular-nums">
                {stat.value}
              </h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Table Section */}
          <div className="lg:col-span-2 bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)] shadow-[var(--shadow-sm)] overflow-hidden">
            <div className="px-8 py-6 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg-main)]/30">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text-primary)]">
                Recent Joiners
              </h4>
              <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                View Directory
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[var(--color-bg-main)]/50">
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
                      Employee
                    </th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
                      Dept • Role
                    </th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {recentEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="group hover:bg-[var(--color-bg-main)]/50 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-black shadow-sm ring-2 ring-white dark:ring-slate-800">
                            {emp.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[var(--color-text-primary)]">
                              {emp.name}
                            </p>
                            <p className="text-[10px] text-[var(--color-text-muted)] font-medium">
                              ID: EMP-{emp.id}0924
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-xs font-bold text-[var(--color-text-secondary)]">
                          {emp.department}
                        </div>
                        <div className="text-[10px] text-[var(--color-text-muted)] font-medium uppercase tracking-wider">
                          {emp.role}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                            emp.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400"
                              : emp.status === "On Leave"
                              ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400"
                              : "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400"
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar Widgets Section */}
          <div className="space-y-8">
            <div className="bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)] shadow-[var(--shadow-sm)] overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg-main)]/30">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-primary)]">
                  Upcoming Birthdays
                </h4>
              </div>
              <div className="p-6 space-y-5">
                {[
                  { name: "John Doe", date: "Today", avatar: "JD" },
                  { name: "Jane Smith", date: "Tomorrow", avatar: "JS" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--color-bg-main)] border border-[var(--color-border)] text-xs flex items-center justify-center font-black group-hover:border-indigo-300 group-hover:text-indigo-600 transition-colors">
                        {item.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--color-text-primary)]">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider font-medium">
                          Corporate Office
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 animate-pulse">
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-2xl text-white relative overflow-hidden shadow-xl shadow-indigo-200 dark:shadow-none transition-transform hover:scale-[1.02]">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-1 bg-white/40 rounded-full" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
                    Annual Review
                  </h4>
                </div>
                <p className="text-xl font-black mb-6 leading-tight">
                  Complete your
                  <br />
                  self-assessment
                </p>
                <button className="w-full bg-white text-indigo-700 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg active:scale-95">
                  Launch Assessment
                </button>
              </div>
              {/* Abstract shapes */}
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-indigo-400 opacity-20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
