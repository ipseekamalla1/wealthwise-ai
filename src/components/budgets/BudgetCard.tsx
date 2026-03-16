"use client"

import { formatCurrency } from "@/lib/utils"
import type { Budget } from "@/hooks/useBudgets"

interface Props {
  budget: Budget
  onDelete: (id: string) => void
}

export default function BudgetCard({ budget, onDelete }: Props) {
  const percentage =
    budget.monthlyLimit > 0
      ? Math.min(
          Math.round((budget.currentSpend / budget.monthlyLimit) * 100),
          100
        )
      : 0

  const isOver = budget.currentSpend > budget.monthlyLimit
  const isWarning = percentage >= 80 && !isOver
  const remaining = budget.monthlyLimit - budget.currentSpend

  const barColor = isOver
    ? "#ef4444"
    : isWarning
    ? "#f59e0b"
    : "#6366f1"

  const handleDelete = async () => {
    const res = await fetch(`/api/budgets/${budget.id}`, {
      method: "DELETE",
    })
    if (res.ok) onDelete(budget.id)
  }

  return (
    <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold"
            style={{
              background: `${budget.category.color}20`,
              color: budget.category.color,
            }}
          >
            {budget.category.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">
              {budget.category.name}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {isOver
                ? `$${Math.abs(remaining).toFixed(2)} over budget`
                : isWarning
                ? `$${remaining.toFixed(2)} remaining`
                : `$${remaining.toFixed(2)} left`}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-md text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1.5">
          <span style={{ color: barColor }} className="font-medium">
            {percentage}% used
          </span>
          <span className="text-slate-500">
            {formatCurrency(budget.currentSpend)} /{" "}
            {formatCurrency(budget.monthlyLimit)}
          </span>
        </div>
        <div className="w-full h-2 bg-[#0f172a] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              background: barColor,
            }}
          />
        </div>
      </div>

      {isOver && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Over budget by {formatCurrency(Math.abs(remaining))}
        </div>
      )}

      {isWarning && !isOver && (
        <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 rounded-lg px-3 py-2">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Approaching limit — {100 - percentage}% remaining
        </div>
      )}
    </div>
  )
}