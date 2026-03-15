import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import TopBar from "@/components/layout/TopBar"
import MetricCard from "@/components/dashboard/MetricCard"
import RecentTransactions from "@/components/dashboard/RecentTransactions"
import IncomeExpenseBar from "@/components/charts/IncomeExpenseBar"
import SpendingDonut from "@/components/charts/SpendingDonut"
import { formatCurrency } from "@/lib/utils"

async function getSummary(userId: string) {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0, 23, 59, 59)

  const transactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: startDate, lte: endDate } },
    include: { category: { select: { id: true, name: true, color: true } } },
    orderBy: { date: "desc" },
  })

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((s, t) => s + Number(t.amount), 0)

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((s, t) => s + Number(t.amount), 0)

  const netSavings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0
    ? Math.round((netSavings / totalIncome) * 100)
    : 0

  const categoryMap = new Map<string, {
    categoryId: string
    categoryName: string
    color: string
    total: number
  }>()

  transactions
    .filter((t) => t.type === "EXPENSE" && t.category)
    .forEach((t) => {
      const key = t.categoryId ?? "uncategorised"
      const existing = categoryMap.get(key)
      if (existing) {
        existing.total += Number(t.amount)
      } else {
        categoryMap.set(key, {
          categoryId: key,
          categoryName: t.category?.name ?? "Uncategorised",
          color: t.category?.color ?? "#94a3b8",
          total: Number(t.amount),
        })
      }
    })

  const categoryBreakdown = Array.from(categoryMap.values())
    .map((c) => ({
      ...c,
      percentage: totalExpenses > 0
        ? Math.round((c.total / totalExpenses) * 100)
        : 0,
    }))
    .sort((a, b) => b.total - a.total)

  const last6Months = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(year, month - 1 - i, 1)
    const m = d.getMonth() + 1
    const y = d.getFullYear()
    const monthTx = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: new Date(y, m - 1, 1),
          lte: new Date(y, m, 0, 23, 59, 59),
        },
      },
      select: { type: true, amount: true },
    })
    last6Months.push({
      month: m,
      year: y,
      income: monthTx.filter((t) => t.type === "INCOME").reduce((s, t) => s + Number(t.amount), 0),
      expenses: monthTx.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0),
    })
  }

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    categoryBreakdown,
    monthlyTrend: last6Months,
    recentTransactions: transactions.slice(0, 8),
  }
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const summary = await getSummary(session.user.id)

  const now = new Date()
  const monthName = now.toLocaleString("default", { month: "long" })
  const year = now.getFullYear()

  return (
    <div>
      <TopBar
        title="Dashboard"
        subtitle={`${monthName} ${year}`}
      />

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Total income"
          value={formatCurrency(summary.totalIncome)}
          delta={summary.totalIncome > 0 ? "This month" : "No income yet"}
          deltaType="positive"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          }
        />
        <MetricCard
          label="Total expenses"
          value={formatCurrency(summary.totalExpenses)}
          delta={summary.totalExpenses > 0 ? "This month" : "No expenses yet"}
          deltaType="negative"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
              <polyline points="17 18 23 18 23 12" />
            </svg>
          }
        />
        <MetricCard
          label="Net savings"
          value={formatCurrency(summary.netSavings)}
          delta={summary.netSavings >= 0 ? "On track" : "Over budget"}
          deltaType={summary.netSavings >= 0 ? "positive" : "negative"}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
              <path d="M12 6v6l4 2" />
            </svg>
          }
        />
        <MetricCard
          label="Savings rate"
          value={`${summary.savingsRate}%`}
          delta={summary.savingsRate >= 20 ? "Healthy rate" : "Aim for 20%+"}
          deltaType={summary.savingsRate >= 20 ? "positive" : "neutral"}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2 bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-5">
          <h2 className="text-sm font-medium text-slate-400 mb-4">
            Income vs expenses
          </h2>
          <IncomeExpenseBar data={summary.monthlyTrend} />
        </div>

        <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-5">
          <h2 className="text-sm font-medium text-slate-400 mb-4">
            Spending by category
          </h2>
          <SpendingDonut data={summary.categoryBreakdown} />
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-slate-400">
            Recent transactions
          </h2>
        </div>
        <RecentTransactions
          transactions={summary.recentTransactions.map((t) => ({
            ...t,
            amount: Number(t.amount),
          }))}
        />
      </div>
    </div>
  )
}