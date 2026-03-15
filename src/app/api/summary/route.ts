import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface Transaction {
  type: string
  amount: unknown
  categoryId: string | null
  category: { id: string; name: string; color: string } | null
}

interface MonthlyTransaction {
  type: string
  amount: unknown
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const month = parseInt(
      searchParams.get("month") ?? String(new Date().getMonth() + 1)
    )
    const year = parseInt(
      searchParams.get("year") ?? String(new Date().getFullYear())
    )

    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        date: { gte: startDate, lte: endDate },
      },
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
      },
    })

    const totalIncome = transactions
      .filter((t: Transaction) => t.type === "INCOME")
      .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0)

    const totalExpenses = transactions
      .filter((t: Transaction) => t.type === "EXPENSE")
      .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0)

    const netSavings = totalIncome - totalExpenses
    const savingsRate =
      totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0
const categoryMap = new Map<string, {
  categoryId: string
  categoryName: string
  color: string
  total: number
}>()
    transactions
      .filter((t: Transaction) => t.type === "EXPENSE" && t.category)
      .forEach((t: Transaction) => {
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
        percentage:
          totalExpenses > 0
            ? Math.round((c.total / totalExpenses) * 100)
            : 0,
      }))
      .sort((a, b) => b.total - a.total)

    const last6Months = []

    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - 1 - i, 1)
      const m = d.getMonth() + 1
      const y = d.getFullYear()
      const start = new Date(y, m - 1, 1)
      const end = new Date(y, m, 0, 23, 59, 59)

      const monthTx = await prisma.transaction.findMany({
        where: {
          userId: session.user.id,
          date: { gte: start, lte: end },
        },
        select: { type: true, amount: true },
      })

      last6Months.push({
        month: m,
        year: y,
        income: monthTx
          .filter((t: MonthlyTransaction) => t.type === "INCOME")
          .reduce((s: number, t: MonthlyTransaction) => s + Number(t.amount), 0),
        expenses: monthTx
          .filter((t: MonthlyTransaction) => t.type === "EXPENSE")
          .reduce((s: number, t: MonthlyTransaction) => s + Number(t.amount), 0),
      })
    }

    return NextResponse.json({
      data: {
        totalIncome,
        totalExpenses,
        netSavings,
        savingsRate,
        categoryBreakdown,
        monthlyTrend: last6Months,
      },
    })
  } catch (error) {
    console.error("GET /api/summary error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}