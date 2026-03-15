import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const defaultCategories = [
  { name: "Housing",       icon: "home",          color: "#6366f1", isDefault: true },
  { name: "Food & Dining", icon: "utensils",       color: "#f59e0b", isDefault: true },
  { name: "Transport",     icon: "car",            color: "#3b82f6", isDefault: true },
  { name: "Healthcare",    icon: "heart-pulse",    color: "#ef4444", isDefault: true },
  { name: "Shopping",      icon: "shopping-bag",   color: "#ec4899", isDefault: true },
  { name: "Entertainment", icon: "tv",             color: "#8b5cf6", isDefault: true },
  { name: "Utilities",     icon: "zap",            color: "#14b8a6", isDefault: true },
  { name: "Education",     icon: "graduation-cap", color: "#f97316", isDefault: true },
  { name: "Savings",       icon: "piggy-bank",     color: "#22c55e", isDefault: true },
  { name: "Income",        icon: "trending-up",    color: "#10b981", isDefault: true },
  { name: "Freelance",     icon: "briefcase",      color: "#06b6d4", isDefault: true },
  { name: "Other",         icon: "circle",         color: "#94a3b8", isDefault: true },
]

async function main() {
  console.log("Seeding default categories...")

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: {
        id: category.name,
      },
      update: {},
      create: category,
    })
  }

  console.log("Seed complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })