"use client";

import { LeaveRequest } from "../types";

const balances = [
  { type: "Casual Leave", code: "CL", total: 12, used: 3 },
  { type: "Privilege Leave", code: "PL", total: 18, used: 2 },
  { type: "Leave Without Pay", code: "LWP", total: 365, used: 0 },
  { type: "Comp Off", code: "Comp OFF", total: 4, used: 1 },
];

export default function LeaveBalance() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {balances.map((item) => {
          const remaining = item.total - item.used;
          const percentage = (remaining / item.total) * 100;

          return (
            <div
              key={item.code}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] p-5 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] hover-lift transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-0.5">
                    {item.type}
                  </p>
                  <p className="text-2xl font-black text-[var(--color-text-primary)]">
                    {remaining}
                  </p>
                </div>
                <div
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    percentage > 50
                      ? "bg-emerald-50 text-emerald-600"
                      : percentage > 20
                      ? "bg-amber-50 text-amber-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {remaining}/{item.total}
                </div>
              </div>

              <div className="w-full bg-[var(--color-bg-main)] h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    percentage > 50
                      ? "bg-emerald-500"
                      : percentage > 20
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase italic">
                  Available
                </span>
                <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase">
                  Used: {item.used}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
