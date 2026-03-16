"use client"

import { useState, useEffect } from "react"
import TopBar from "@/components/layout/TopBar"
import IncomeExpenseBar from "@/components/charts/IncomeExpenseBar"
import SpendingDonut from "@/components/charts/SpendingDonut"
import NetWorthLine from "@/components/charts/NetWorthLine"
import CategoryTrends from "@/components/charts/CategoryTrends"
import { formatCurrency } from "@/lib/utils"

interface SummaryData {
  totalIncome: number
  totalExpenses: number
  netSavings: number
  savingsRate: number
  categoryBreakdown: {
    categoryId: string
    categoryName: string
    color: string
    total: number
    percentage: number
  }[]
  monthlyTrend: {
    month: number
    year: number
    income: number
    expenses: number
  }[]
}

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(true)

  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  const monthName = now.toLocaleString("default", {
    month: "long",
    year: "numeric",
  })

  useEffect(() => {
    fetch(`/api/summary?month=${month}&year=${year}`)
      .then((r) => r.json())
      .then((d) => setSummary(d.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [month, year])

  if (loading) {
    return (
      <div>
        <TopBar title="Analytics" subtitle={monthName} />
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 bg-[#1e293b] border border-[#1e3a5f] rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (!summary) return null

  const topCategory = summary.categoryBreakdown[0]

  return (
    <div>
      <TopBar title="Analytics" subtitle={monthName} />

      {/* Key stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Total income
          </p>
          <p className="text-2xl font-semibold text-green-400">
            {formatCurrency(summary.totalIncome)}
          </p>
        </div>
        <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Total expenses
          </p>
          <p className="text-2xl font-semibold text-red-400">
            {formatCurrency(summary.totalExpenses)}
          </p>
        </div>
        <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Net savings
          </p>
          <p
            className={`text-2xl font-semibold ${
              summary.netSavings >= 0 ? "text-indigo-400" : "text-red-400"
            }`}
          >
            {formatCurrency(summary.netSavings)}
          </p>
        </div>
        <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Top category
          </p>
          <p className="text-2xl font-semibold text-slate-100">
            {topCategory?.categoryName ?? "None"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {topCategory
              ? `${formatCurrency(topCategory.total)} · ${topCategory.percentage}%`
              : "No expenses yet"}
          </p>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-5">
          <h2 className="text-sm font-medium text-slate-400 mb-4">
            Income vs expenses — last 6 months
          </h2>
          <IncomeExpenseBar data={summary.monthlyTrend} />
        </div>

        <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-5">
          <h2 className="text-sm font-medium text-slate-400 mb-4">
            Income and savings trend
          </h2>
          <NetWorthLine data={summary.monthlyTrend} />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-5">
          <h2 className="text-sm font-medium text-slate-400 mb-4">
            Spending by category
          </h2>
          <SpendingDonut data={summary.categoryBreakdown} />
        </div>

        <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-5">
          <h2 className="text-sm font-medium text-slate-400 mb-4">
            Category breakdown
          </h2>
          <CategoryTrends
            data={summary.categoryBreakdown.map((c) => ({
              categoryName: c.categoryName,
              total: c.total,
              color: c.color,
              percentage: c.percentage,
            }))}
          />
        </div>
      </div>
    </div>
  )
}