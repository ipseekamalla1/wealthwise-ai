import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { openai } from "@/lib/openai"
import { buildCategorisePrompt } from "@/lib/prompts"

interface CategoryItem {
  id: string
  name: string
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    const { transactionId, description, merchant } = await req.json()

    if (!transactionId || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const categories: CategoryItem[] = await prisma.category.findMany({
      where: {
        OR: [
          { isDefault: true },
          { userId: session.user.id },
        ],
      },
      select: { id: true, name: true },
    })

    const categoryNames = categories.map((c: CategoryItem) => c.name)
    const prompt = buildCategorisePrompt(description, merchant, categoryNames)

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0,
    })

    const raw = completion.choices[0].message.content ?? "{}"
    const parsed = JSON.parse(raw)
    const categoryName = parsed.category as string

    const matched = categories.find(
      (c: CategoryItem) =>
        c.name.toLowerCase() === categoryName.toLowerCase()
    )

    if (!matched) {
      return NextResponse.json(
        { error: "No matching category found" },
        { status: 404 }
      )
    }

    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        categoryId: matched.id,
        isAiCategorised: true,
      },
    })

    return NextResponse.json({
      data: { categoryId: matched.id, categoryName: matched.name },
    })
  } catch (error) {
    console.error("POST /api/ai/categorise error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}