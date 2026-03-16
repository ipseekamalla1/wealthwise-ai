import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { openai } from "@/lib/openai"

interface TxItem {
  type: string
  amount: unknown
  category: { name: string } | null
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    const reports = await prisma.report.findMany({
      where: { userId: session.user.id },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    })

    return NextResponse.json({ data: reports })
  } catch (error) {
    console.error("GET /api/reports error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    const { month, year } = await req.json()

    if (!month || !year) {
      return NextResponse.json(
        { error: "Month and year are required" },
        { status: 400 }
      )
    }

    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    const transactions: TxItem[] = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        date: { gte: startDate, lte: endDate },
      },
      include: { category: { select: { name: true } } },
    })

    const totalIncome = transactions
      .filter((t: TxItem) => t.type === "INCOME")
      .reduce((s: number, t: TxItem) => s + Number(t.amount), 0)

    const totalExpenses = transactions
      .filter((t: TxItem) => t.type === "EXPENSE")
      .reduce((s: number, t: TxItem) => s + Number(t.amount), 0)

    const netSavings = totalIncome - totalExpenses

    const categoryTotals: Record<string, number> = {}
    transactions
      .filter((t: TxItem) => t.type === "EXPENSE" && t.category)
      .forEach((t: TxItem) => {
        const name = t.category?.name ?? "Other"
        categoryTotals[name] = (categoryTotals[name] ?? 0) + Number(t.amount)
      })

    const breakdown = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([name, total]) => `${name}: $${total.toFixed(2)}`)
      .join(", ")

    const monthName = new Date(year, month - 1, 1).toLocaleString("default", {
      month: "long",
      year: "numeric",
    })

    const prompt = `You are a personal finance advisor. Write a concise monthly financial report summary for ${monthName}.

Data:
- Total Income: $${totalIncome.toFixed(2)}
- Total Expenses: $${totalExpenses.toFixed(2)}
- Net Savings: $${netSavings.toFixed(2)}
- Savings Rate: ${totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0}%
- Spending by category: ${breakdown || "No expenses recorded"}

Write 2 to 3 sentences summarising the month, highlighting key spending patterns and one actionable recommendation. Be specific and use the actual numbers.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 200,
    })

    const aiSummary = completion.choices[0].message.content ?? ""

    const report = await prisma.report.upsert({
      where: {
        userId_month_year: {
          userId: session.user.id,
          month,
          year,
        },
      },
      update: {
        totalIncome,
        totalExpenses,
        netSavings,
        aiSummary,
      },
      create: {
        userId: session.user.id,
        month,
        year,
        totalIncome,
        totalExpenses,
        netSavings,
        aiSummary,
      },
    })

    return NextResponse.json({ data: report }, { status: 201 })
  } catch (error) {
    console.error("POST /api/reports error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}