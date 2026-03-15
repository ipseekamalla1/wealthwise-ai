import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { isDefault: true },
          { userId: session.user.id },
        ],
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json({ data: categories })
  } catch (error) {
    console.error("GET /api/categories error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}