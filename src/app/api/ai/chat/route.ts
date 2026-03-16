import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { openai } from "@/lib/openai"
import { buildChatSystemPrompt } from "@/lib/prompts"

interface TxItem {
  type: string
  amount: unknown
  category: { name: string } | null
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    const { messages } = await req.json()

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
      include: { category: { select: { name: true } } },
    })

    const totalIncome = transactions
      .filter((t: TxItem) => t.type === "INCOME")
      .reduce((s: number, t: TxItem) => s + Number(t.amount), 0)

    const totalExpenses = transactions
      .filter((t: TxItem) => t.type === "EXPENSE")
      .reduce((s: number, t: TxItem) => s + Number(t.amount), 0)

    const netSavings = totalIncome - totalExpenses
    const savingsRate =
      totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0

    const categoryTotals: Record<string, number> = {}
    transactions
      .filter((t: TxItem) => t.type === "EXPENSE" && t.category)
      .forEach((t: TxItem) => {
        const name = t.category?.name ?? "Other"
        categoryTotals[name] = (categoryTotals[name] ?? 0) + Number(t.amount)
      })

    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([categoryName, total]) => ({
        categoryName,
        total,
        percentage:
          totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total)

    const monthName = now.toLocaleString("default", {
      month: "long",
      year: "numeric",
    })

    const systemPrompt = buildChatSystemPrompt(
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      categoryBreakdown,
      monthName
    )

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m: ChatMessage) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 500,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? ""
          if (text) {
            controller.enqueue(encoder.encode(text))
          }
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("POST /api/ai/chat error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}