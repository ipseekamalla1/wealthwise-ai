"use client"

import { useCategories } from "@/hooks/useTransactions"
import type { TransactionFilters } from "@/hooks/useTransactions"

interface Props {
  filters: TransactionFilters
  onChange: (filters: TransactionFilters) => void
}

export default function FilterBar({ filters, onChange }: Props) {
  const categories = useCategories()

  const hasActiveFilters =
    filters.type || filters.categoryId || filters.from || filters.to

  return (
    <div className="flex flex-wrap items-center gap-3">

      {/* Type filter */}
      <div className="relative">
        <select
          value={filters.type ?? ""}
          onChange={(e) =>
            onChange({ ...filters, type: e.target.value || undefined, page: 1 })
          }
          className={`appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border transition-colors focus:outline-none cursor-pointer ${
            filters.type
              ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300"
              : "bg-[#0f172a] border-[#1e3a5f] text-slate-300 hover:border-slate-500"
          }`}
        >
          <option value="">All types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke={filters.type ? "#818cf8" : "#64748b"}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Category filter */}
      <div className="relative">
        <select
          value={filters.categoryId ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              categoryId: e.target.value || undefined,
              page: 1,
            })
          }
          className={`appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border transition-colors focus:outline-none cursor-pointer ${
            filters.categoryId
              ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300"
              : "bg-[#0f172a] border-[#1e3a5f] text-slate-300 hover:border-slate-500"
          }`}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke={filters.categoryId ? "#818cf8" : "#64748b"}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-[#1e3a5f]" />

      {/* Date from */}
      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke={filters.from ? "#818cf8" : "#64748b"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <input
          type="date"
          value={filters.from ?? ""}
          onChange={(e) =>
            onChange({ ...filters, from: e.target.value || undefined, page: 1 })
          }
          className={`pl-8 pr-3 py-2 text-sm rounded-lg border transition-colors focus:outline-none cursor-pointer ${
            filters.from
              ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300"
              : "bg-[#0f172a] border-[#1e3a5f] text-slate-400 hover:border-slate-500"
          }`}
        />
      </div>

      <span className="text-xs text-slate-600">to</span>

      {/* Date to */}
      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke={filters.to ? "#818cf8" : "#64748b"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <input
          type="date"
          value={filters.to ?? ""}
          onChange={(e) =>
            onChange({ ...filters, to: e.target.value || undefined, page: 1 })
          }
          className={`pl-8 pr-3 py-2 text-sm rounded-lg border transition-colors focus:outline-none cursor-pointer ${
            filters.to
              ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300"
              : "bg-[#0f172a] border-[#1e3a5f] text-slate-400 hover:border-slate-500"
          }`}
        />
      </div>

      {/* Active filter count badge + clear */}
      {hasActiveFilters && (
        <>
          <div className="h-6 w-px bg-[#1e3a5f]" />
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
              {[filters.type, filters.categoryId, filters.from, filters.to].filter(Boolean).length} active
            </span>
            <button
              onClick={() => onChange({ page: 1 })}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors"
            >
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Clear all
            </button>
          </div>
        </>
      )}
    </div>
  )
}