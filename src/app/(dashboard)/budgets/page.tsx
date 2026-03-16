"use client"

import { useState } from "react"
import TopBar from "@/components/layout/TopBar"
import BudgetCard from "@/components/budgets/BudgetCard"
import BudgetForm from "@/components/budgets/BudgetForm"
import { useBudgets } from "@/hooks/useBudgets"
import { formatCurrency } from "@/lib/utils"

export default function BudgetsPage() {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const { budgets, loading, refetch } = useBudgets(month, year)
  const [showForm, setShowForm] = useState(false)

  const monthName = now.toLocaleString("default", {
    month: "long",
    year: "numeric",
  })

  const totalBudgeted = budgets.reduce((s, b) => s + b.monthlyLimit, 0)
  const totalSpent = budgets.reduce((s, b) => s + b.currentSpend, 0)
  const overBudgetCount = budgets.filter(
    (b) => b.currentSpend > b.monthlyLimit
  ).length

  const handleSuccess = () => {
    setShowForm(false)
    refetch()
  }

  const handleDelete = () => {
    refetch()
  }

  return (
    <div>
      <TopBar
        title="Budgets"
        subtitle={monthName}
        action={
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add budget
          </button>
        }
      />

      {/* Slide-in form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/50"
            onClick={() => setShowForm(false)}
          />
          <div className="w-full max-w-md bg-[#1e293b] border-l border-[#1e3a5f] h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-100">
                Set budget
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <BudgetForm
              month={month}
              year={year}
              onSuccess={handleSuccess}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Total budgeted
          </p>
          <p className="text-2xl font-semibold text-slate-100">
            {formatCurrency(totalBudgeted)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            across {budgets.length} categories
          </p>
        </div>
        <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Total spent
          </p>
          <p className="text-2xl font-semibold text-slate-100">
            {formatCurrency(totalSpent)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {totalBudgeted > 0
              ? `${Math.round((totalSpent / totalBudgeted) * 100)}% of budget used`
              : "No budget set"}
          </p>
        </div>
        <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Over budget
          </p>
          <p
            className={`text-2xl font-semibold ${
              overBudgetCount > 0 ? "text-red-400" : "text-green-400"
            }`}
          >
            {overBudgetCount}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {overBudgetCount === 0
              ? "All categories on track"
              : `${overBudgetCount} categories exceeded`}
          </p>
        </div>
      </div>

      {/* Budget cards grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-[#1e293b] border border-[#1e3a5f] rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-16 text-center">
          <div className="w-12 h-12 rounded-full bg-[#0f172a] border border-[#1e3a5f] flex items-center justify-center mx-auto mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <p className="text-sm text-slate-400 mb-1">No budgets set yet</p>
          <p className="text-xs text-slate-600 mb-6">
            Set monthly limits for your spending categories
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Set your first budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}