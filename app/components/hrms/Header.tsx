import { useState } from "react";
import { useAuth } from "../../lib/auth";

export default function Header({ title }: { title: string }) {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Form Published",
      message:
        'Admin has published "Annual Feedback 2026". Please complete it by EOD.',
      time: "Just now",
      read: false,
      type: "form",
    },
    {
      id: 2,
      title: "Leave Request Approved",
      message: "Your leave request for Jan 15-17 has been approved by HR.",
      time: "2 hours ago",
      read: false,
      type: "approval",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const searchResults =
    searchQuery.trim() === ""
      ? []
      : [
          {
            id: 1,
            type: "employee",
            title: "John Doe",
            subtitle: "Senior Infrastructure Admin",
            icon: "user",
          },
          {
            id: 2,
            type: "employee",
            title: "Sarah Wilson",
            subtitle: "HR Manager",
            icon: "user",
          },
          {
            id: 3,
            type: "form",
            title: "Annual Feedback 2026",
            subtitle: "Active Personnel Form",
            icon: "document",
          },
          {
            id: 4,
            type: "form",
            title: "Asset Declaration",
            subtitle: "Hardware Compliance",
            icon: "document",
          },
          {
            id: 5,
            type: "doc",
            title: "Employee Handbook",
            subtitle: "Policy & Guidelines",
            icon: "book",
          },
        ].filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return (
    <header className="sticky top-0 right-0 h-[var(--header-height)] bg-[var(--color-bg-header)] border-b border-[var(--color-border)] flex items-center justify-between px-[var(--spacing-xl)] z-50 transition-colors">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <svg
              className="w-4 h-4 text-[var(--color-text-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearch(true);
            }}
            onFocus={() => setShowSearch(true)}
            onKeyDown={(e) => e.key === "Escape" && setShowSearch(false)}
            placeholder="Search assets, forms, docs..."
            className="block w-64 pl-10 pr-3 py-1.5 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all font-medium relative z-0"
          />

          {/* Search Results Dropdown */}
          {showSearch && searchQuery.trim() !== "" && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowSearch(false)}
              />
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {searchResults.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-xs font-medium text-[var(--color-text-muted)]">
                        No matches found for "{searchQuery}"
                      </p>
                    </div>
                  ) : (
                    <div className="py-2">
                      {searchResults.map((result) => (
                        <div
                          key={`${result.type}-${result.id}`}
                          className="px-4 py-3 hover:bg-[var(--color-bg-main)] cursor-pointer transition-colors flex items-center gap-3 group"
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              result.type === "employee"
                                ? "bg-indigo-50 text-indigo-600"
                                : result.type === "form"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {result.type === "employee" ? (
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                />
                              </svg>
                            ) : result.type === "form" ? (
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.254 18.477 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors leading-tight">
                              {result.title}
                            </p>
                            <p className="text-[10px] font-medium text-[var(--color-text-muted)] mt-0.5 uppercase tracking-wider">
                              {result.type} • {result.subtitle}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-2 bg-[var(--color-bg-main)] text-center border-t border-[var(--color-border)]">
                  <p className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.1em]">
                    Press{" "}
                    <span className="text-[var(--color-text-primary)]">
                      ESC
                    </span>{" "}
                    to Close
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-full transition-all relative group/notif"
            >
              <svg
                className="w-5 h-5 transition-transform group-active/notif:scale-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {/* Notification Badge */}
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-[var(--color-bg-header)] rounded-full animate-pulse shadow-sm" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-3 w-80 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all animate-in fade-in zoom-in duration-200">
                  <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-main)] flex items-center justify-between">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                      Notifications {unreadCount > 0 && `(${unreadCount})`}
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] font-bold text-[var(--color-primary)] hover:underline uppercase tracking-wider"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="text-xs font-medium text-[var(--color-text-muted)]">
                          No notifications yet
                        </p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`p-4 transition-all cursor-pointer border-b border-[var(--color-border)] relative group ${
                            !notif.read
                              ? "bg-[var(--color-primary-light)]/30"
                              : "hover:bg-[var(--color-bg-main)]"
                          }`}
                        >
                          {!notif.read && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-primary)]" />
                          )}
                          <div className="flex gap-4">
                            <div
                              className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm ${
                                notif.type === "form"
                                  ? "bg-indigo-50 text-indigo-600"
                                  : "bg-emerald-50 text-emerald-600"
                              }`}
                            >
                              {notif.type === "form" ? (
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
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              ) : (
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
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-0.5">
                                <p
                                  className={`text-xs font-bold leading-none ${
                                    !notif.read
                                      ? "text-[var(--color-text-primary)]"
                                      : "text-[var(--color-text-secondary)]"
                                  }`}
                                >
                                  {notif.title}
                                </p>
                                <span className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase shrink-0">
                                  {notif.time}
                                </span>
                              </div>
                              <p className="text-[11px] font-medium text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
                                {notif.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 text-center bg-[var(--color-bg-main)]">
                    <button className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                      View all activities
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={logout}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-error)] hover:bg-red-50 rounded-full transition-all group relative"
            title="Logout"
          >
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
