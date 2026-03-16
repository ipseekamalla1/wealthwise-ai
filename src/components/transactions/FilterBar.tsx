"use client"

import { useCategories } from "@/hooks/useTransactions"
import type { TransactionFilters } from "@/hooks/useTransactions"

interface Props {
  filters: TransactionFilters
  onChange: (filters: TransactionFilters) => void
}

export default function FilterBar({ filters, onChange }: Props) {
  const categories = useCategories()

  const inputClass = "px-3 py-2 bg-[#1e293b] border border-[#1e3a5f] rounded-lg text-slate-300 text-sm focus:outline-none focus:border-indigo-500 transition-colors"

  return (
    <div className="flex flex-wrap items-center gap-3">

      {/* Type filter */}
      <select
        value={filters.type ?? ""}
        onChange={(e) => onChange({ ...filters, type: e.target.value || undefined, page: 1 })}
        className={inputClass}
      >
        <option value="">All types</option>
        <option value="INCOME">Income</option>
        <option value="EXPENSE">Expense</option>
      </select>

      {/* Category filter */}
      <select
        value={filters.categoryId ?? ""}
        onChange={(e) => onChange({ ...filters, categoryId: e.target.value || undefined, page: 1 })}
        className={inputClass}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Date from */}
      <input
        type="date"
        value={filters.from ?? ""}
        onChange={(e) => onChange({ ...filters, from: e.target.value || undefined, page: 1 })}
        className={inputClass}
        placeholder="From"
      />

      {/* Date to */}
      <input
        type="date"
        value={filters.to ?? ""}
        onChange={(e) => onChange({ ...filters, to: e.target.value || undefined, page: 1 })}
        className={inputClass}
        placeholder="To"
      />

      {/* Clear */}
      {(filters.type || filters.categoryId || filters.from || filters.to) && (
        <button
          onClick={() => onChange({ page: 1 })}
          className="px-3 py-2 text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}