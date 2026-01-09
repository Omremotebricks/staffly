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
      <div className="space-y-[var(--spacing-xl)]">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-lg)]">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[var(--color-bg-card)] p-[var(--spacing-lg)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-[var(--color-primary-light)] rounded-[var(--radius-md)] text-[var(--color-primary)]">
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
                <span
                  className={`text-xs font-medium ${
                    stat.change.startsWith("+")
                      ? "text-[var(--color-success)]"
                      : stat.change === "0%"
                      ? "text-[var(--color-text-muted)]"
                      : "text-[var(--color-error)]"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--spacing-lg)]">
          {/* Main Table Section */}
          <div className="lg:col-span-2 bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <h4 className="font-semibold">Recent Employees</h4>
              <button className="text-sm text-[var(--color-primary)] font-medium hover:underline">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--color-bg-main)] text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                    <th className="px-6 py-3 font-semibold">Employee</th>
                    <th className="px-6 py-3 font-semibold">Department</th>
                    <th className="px-6 py-3 font-semibold">Role</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {recentEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-[var(--color-bg-main)] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center text-xs font-bold">
                            {emp.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{emp.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
                        {emp.department}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
                        {emp.role}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            emp.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : emp.status === "On Leave"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
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
          <div className="space-y-[var(--spacing-lg)]">
            <div className="bg-[var(--color-bg-card)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
              <h4 className="font-semibold mb-4">Upcoming Birthdays</h4>
              <div className="space-y-4">
                {[
                  { name: "John Doe", date: "Today", avatar: "JD" },
                  { name: "Jane Smith", date: "Tomorrow", avatar: "JS" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-border)] text-xs flex items-center justify-center font-bold">
                        {item.avatar}
                      </div>
                      <p className="text-sm font-medium">{item.name}</p>
                    </div>
                    <span className="text-xs text-[var(--color-primary)] font-medium bg-[var(--color-primary-light)] px-2 py-0.5 rounded-full">
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[var(--color-primary)] p-6 rounded-[var(--radius-lg)] text-white relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-semibold mb-1 text-indigo-100">
                  Annual Review
                </h4>
                <p className="text-2xl font-bold mb-4">
                  Complete your self-assessment
                </p>
                <button className="bg-white text-[var(--color-primary)] px-4 py-2 rounded-[var(--radius-md)] text-sm font-bold hover:bg-indigo-50 transition-colors">
                  Start Now
                </button>
              </div>
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-400 opacity-20 rounded-full"></div>
              <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-16 h-16 bg-indigo-300 opacity-20 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
