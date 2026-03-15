import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { BudgetSchema } from "@/lib/validations"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const month = parseInt(searchParams.get("month") ?? String(new Date().getMonth() + 1))
    const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()))

    const budgets = await prisma.budget.findMany({
      where: { userId: session.user.id, month, year },
      include: {
        category: {
          select: { id: true, name: true, color: true, icon: true },
        },
      },
    })

    return NextResponse.json({ data: budgets })
  } catch (error) {
    console.error("GET /api/budgets error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = BudgetSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { categoryId, monthlyLimit, month, year } = parsed.data

    const budget = await prisma.budget.upsert({
      where: {
        userId_categoryId_month_year: {
          userId: session.user.id,
          categoryId,
          month,
          year,
        },
      },
      update: { monthlyLimit },
      create: {
        userId: session.user.id,
        categoryId,
        monthlyLimit,
        month,
        year,
      },
      include: {
        category: {
          select: { id: true, name: true, color: true, icon: true },
        },
      },
    })

    return NextResponse.json({ data: budget }, { status: 201 })
  } catch (error) {
    console.error("POST /api/budgets error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}