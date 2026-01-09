import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../lib/auth";

const baseMenuItems = [
  {
    name: "Dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    path: "/",
  },
  {
    name: "Attendance",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    path: "/attendance",
  },
  {
    name: "Employees",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    path: "/employees",
    roles: ["admin", "hr"],
  },
];

const leaveItems = [
  {
    name: "Apply Leave",
    icon: "M12 9v3m0 0v3m0-3h3m-3 0h-3m-9 3l3-3m0 0l3 3m-3-3V15a2 2 0 012-2h.09a2 2 0 012 2v.09a2 2 0 01-2 2H9a2 2 0 01-2-2v-.09z",
    path: "/leave/apply",
  },
  {
    name: "My Requests",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01",
    path: "/leave/requests",
  },
  {
    name: "Manage Leave",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    path: "/leave/manage",
    roles: ["admin", "hr"],
  },
];

const secondaryItems = [
  {
    name: "Payroll",
    icon: "M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z M12 2a10 10 0 100 20 10 10 0 000-20z",
    path: "/payroll",
  },
  {
    name: "Forms",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    path: "/forms",
  },
  {
    name: "Performance",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    path: "/501",
  },
  {
    name: "Recruitment",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 01-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    path: "/501",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const filterItems = (items: any[]) =>
    items.filter(
      (item) => !item.roles || (user && item.roles.includes(user.role))
    );

  const renderLink = (item: any) => {
    const isActive =
      pathname === item.path ||
      (item.path !== "/" && pathname.startsWith(item.path));
    return (
      <li key={item.name}>
        <Link
          href={item.path}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] transition-all group ${
            isActive
              ? "text-[var(--color-primary)] bg-[var(--color-primary-light)] font-semibold shadow-sm"
              : "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-main)]"
          }`}
        >
          <svg
            className={`w-5 h-5 transition-colors ${
              isActive
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={isActive ? 2 : 1.5}
              d={item.icon}
            />
          </svg>
          <span className="text-sm">{item.name}</span>
        </Link>
      </li>
    );
  };

  return (
    <aside className="fixed left-0 top-0 h-full bg-[var(--color-bg-sidebar)] border-r border-[var(--color-border)] w-[var(--sidebar-width)] flex flex-col z-20 transition-colors">
      <div className="p-[var(--spacing-lg)] flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-white font-bold transition-transform group-hover:scale-110">
            S
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Staffly
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-[var(--spacing-md)] overflow-y-auto thin-scroll py-[var(--spacing-sm)]">
        <div className="mb-6">
          <p className="px-3 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
            Main Menu
          </p>
          <ul className="space-y-1">
            {filterItems(baseMenuItems).map(renderLink)}
          </ul>
        </div>

        <div className="mb-6">
          <p className="px-3 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
            Leave Management
          </p>
          <ul className="space-y-1">
            {filterItems(leaveItems).map(renderLink)}
          </ul>
        </div>

        <div className="mb-6">
          <p className="px-3 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
            Operations
          </p>
          <ul className="space-y-1">
            {filterItems(secondaryItems).map(renderLink)}
          </ul>
        </div>
      </nav>

      <div className="p-[var(--spacing-md)] border-t border-[var(--color-border)]">
        <div className="flex items-center gap-3 p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-main)] transition-colors cursor-pointer group">
          <div className="w-9 h-9 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full flex items-center justify-center font-black transition-transform group-hover:scale-105">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-[var(--color-text-primary)]">
              {user?.name || "User"}
            </p>
            <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)] truncate">
              {user?.role || "Employee"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
