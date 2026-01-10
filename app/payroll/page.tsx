"use client";

import AppShell from "../components/hrms/AppShell";

const payrollData = [
  {
    id: 1,
    month: "December 2025",
    status: "Paid",
    amount: "$5,200",
    date: "Dec 31, 2025",
  },
  {
    id: 2,
    month: "November 2025",
    status: "Paid",
    amount: "$5,200",
    date: "Nov 30, 2025",
  },
  {
    id: 3,
    month: "October 2025",
    status: "Paid",
    amount: "$5,200",
    date: "Oct 31, 2025",
  },
];

export default function PayrollPage() {
  return (
    <AppShell title="Payroll & Compensation">
      <div className="space-y-[var(--spacing-xl)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-lg)]">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-[var(--radius-lg)] text-white shadow-lg">
            <p className="text-indigo-100 text-sm font-medium mb-1">
              Next Payday
            </p>
            <h3 className="text-3xl font-bold mb-4">January 31, 2026</h3>
            <div className="flex items-center gap-2 text-indigo-100 text-xs">
              <span className="bg-indigo-500/30 px-2 py-0.5 rounded">
                22 Days Remaining
              </span>
            </div>
          </div>
          <div className="bg-[var(--color-bg-card)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
            <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-1">
              Year-to-Date Earnings
            </p>
            <h3 className="text-3xl font-bold">$62,400.00</h3>
            <p className="text-[var(--color-success)] text-xs mt-2">
              ↑ 4.5% vs Last Year
            </p>
          </div>
          <div className="bg-[var(--color-bg-card)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
            <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-1">
              Pending Reimbursements
            </p>
            <h3 className="text-3xl font-bold">$420.50</h3>
            <button className="text-[var(--color-primary)] text-xs mt-2 font-bold hover:underline">
              View Claims →
            </button>
          </div>
        </div>

        <div className="bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-border)]">
            <h4 className="font-semibold text-lg">Payslip History</h4>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--color-bg-main)] text-xs uppercase text-[var(--color-text-muted)] font-bold">
                <th className="px-6 py-4">Pay Period</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Net Amount</th>
                <th className="px-6 py-4">Pay Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {payrollData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[var(--color-bg-main)] transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium">
                    {item.month}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-emerald-100">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    {item.amount}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[var(--color-primary)] text-sm font-bold hover:underline">
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
