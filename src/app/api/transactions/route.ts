import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { TransactionSchema } from "@/lib/validations"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") ?? "1")
    const limit = parseInt(searchParams.get("limit") ?? "20")
    const type = searchParams.get("type")
    const categoryId = searchParams.get("categoryId")
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    const where: Record<string, unknown> = {
      userId: session.user.id,
    }

    if (type) where.type = type
    if (categoryId) where.categoryId = categoryId
    if (from || to) {
      where.date = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      }
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, color: true, icon: true },
          },
        },
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ])

    return NextResponse.json({
      data: transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("GET /api/transactions error:", error)
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
    const parsed = TransactionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { amount, type, description, merchant, categoryId, date, notes } =
      parsed.data

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        description,
        merchant: merchant ?? null,
        categoryId: categoryId ?? null,
        date: new Date(date),
        notes: notes ?? null,
        userId: session.user.id,
      },
      include: {
        category: {
          select: { id: true, name: true, color: true, icon: true },
        },
      },
    })

    return NextResponse.json({ data: transaction }, { status: 201 })
  } catch (error) {
    console.error("POST /api/transactions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}