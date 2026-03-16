import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { openai } from "@/lib/openai"
import { buildInsightsPrompt } from "@/lib/prompts"

interface TxItem {
  type: string
  amount: unknown
  category: { name: string; color: string } | null
}

interface InsightItem {
  type: string
  title: string
  content: string
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    const existing = await prisma.aiInsight.findMany({
      where: {
        userId: session.user.id,
        isDismissed: false,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { createdAt: "desc" },
    })

    if (existing.length > 0) {
      return NextResponse.json({ data: existing })
    }

    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    const transactions: TxItem[] = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        date: { gte: startDate, lte: endDate },
      },
      include: {
        category: { select: { name: true, color: true } },
      },
    })

    if (transactions.length === 0) {
      return NextResponse.json({ data: [] })
    }

    const totalIncome = transactions
      .filter((t: TxItem) => t.type === "INCOME")
      .reduce((s: number, t: TxItem) => s + Number(t.amount), 0)

    const totalExpenses = transactions
      .filter((t: TxItem) => t.type === "EXPENSE")
      .reduce((s: number, t: TxItem) => s + Number(t.amount), 0)

    const netSavings = totalIncome - totalExpenses
    const savingsRate =
      totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0

    const categoryTotals: Record<string, { name: string; total: number }> = {}

    transactions
      .filter((t: TxItem) => t.type === "EXPENSE" && t.category)
      .forEach((t: TxItem) => {
        const name = t.category?.name ?? "Other"
        if (!categoryTotals[name]) {
          categoryTotals[name] = { name, total: 0 }
        }
        categoryTotals[name].total += Number(t.amount)
      })

    const categoryBreakdown = Object.values(categoryTotals)
      .map((c) => ({
        categoryName: c.name,
        total: c.total,
        percentage:
          totalExpenses > 0 ? Math.round((c.total / totalExpenses) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total)

    const monthName = now.toLocaleString("default", {
      month: "long",
      year: "numeric",
    })

    const prompt = buildInsightsPrompt(
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      categoryBreakdown,
      monthName
    )

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    })

    const raw = completion.choices[0].message.content ?? "[]"

    let insightsArray: InsightItem[] = []
    try {
      const parsed = JSON.parse(raw)
      insightsArray = Array.isArray(parsed) ? parsed : parsed.insights ?? []
    } catch {
      insightsArray = []
    }

    await prisma.aiInsight.deleteMany({
      where: { userId: session.user.id },
    })

    const created = await prisma.aiInsight.createMany({
      data: insightsArray.map((insight: InsightItem) => ({
        userId: session.user.id,
        type: insight.type ?? "info",
        title: insight.title ?? "Insight",
        content: insight.content ?? "",
        isDismissed: false,
      })),
    })

    const insights = await prisma.aiInsight.findMany({
      where: { userId: session.user.id, isDismissed: false },
      orderBy: { createdAt: "desc" },
    })

    console.log(`Generated ${created.count} insights`)

    return NextResponse.json({ data: insights })
  } catch (error) {
    console.error("GET /api/ai/insights error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    const { id } = await req.json()

    await prisma.aiInsight.update({
      where: { id, userId: session.user.id },
      data: { isDismissed: true },
    })

    return NextResponse.json({ message: "Dismissed" })
  } catch (error) {
    console.error("DELETE /api/ai/insights error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}