import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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

    const existing = await prisma.budget.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 })
    }

    await prisma.budget.delete({ where: { id } })

    return NextResponse.json({ message: "Budget deleted" })
  } catch (error) {
    console.error("DELETE /api/budgets/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}