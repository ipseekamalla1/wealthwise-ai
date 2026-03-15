import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UpdateTransactionSchema } from "@/lib/validations"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    const { id } = await params

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId: session.user.id },
      include: {
        category: {
          select: { id: true, name: true, color: true, icon: true },
        },
      },
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ data: transaction })
  } catch (error) {
    console.error("GET /api/transactions/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const parsed = UpdateTransactionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const existing = await prisma.transaction.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        ...parsed.data,
        date: parsed.data.date ? new Date(parsed.data.date) : undefined,
      },
      include: {
        category: {
          select: { id: true, name: true, color: true, icon: true },
        },
      },
    })

    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error("PATCH /api/transactions/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.transaction.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    await prisma.transaction.delete({ where: { id } })

    return NextResponse.json({ message: "Transaction deleted" })
  } catch (error) {
    console.error("DELETE /api/transactions/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}