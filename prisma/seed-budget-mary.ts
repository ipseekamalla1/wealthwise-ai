import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const USER_ID = "cmostxkuv0000vlr9benjp6qv";

// -----------------------------
// Budget templates (CAD realistic)
// -----------------------------
const budgetTemplates = [
  { name: "Housing", limit: 1800 },
  { name: "Food & Dining", limit: 600 },
  { name: "Transport", limit: 250 },
  { name: "Healthcare", limit: 200 },
  { name: "Shopping", limit: 700 },
  { name: "Entertainment", limit: 300 },
  { name: "Utilities", limit: 400 },
  { name: "Education", limit: 500 },
  { name: "Savings", limit: 1000 },
];

// -----------------------------
// Months to seed
// -----------------------------
const months = [
  { month: 4, year: 2026 }, // April
  { month: 5, year: 2026 }, // May
];

// -----------------------------
// MAIN
// -----------------------------
async function main() {
  console.log("🌱 Starting budget seeding...");

  // 1. Get all categories for this user
  const categories = await prisma.category.findMany({
    where: { userId: USER_ID },
  });

  const categoryMap = new Map(
    categories.map((c) => [c.name, c])
  );

  let count = 0;

  // 2. Loop months
  for (const m of months) {
    for (const b of budgetTemplates) {
      const category = categoryMap.get(b.name);

      if (!category) continue;

      const existing = await prisma.budget.findUnique({
        where: {
          userId_categoryId_month_year: {
            userId: USER_ID,
            categoryId: category.id,
            month: m.month,
            year: m.year,
          },
        },
      });

      if (!existing) {
        await prisma.budget.create({
          data: {
            userId: USER_ID,
            categoryId: category.id,
            month: m.month,
            year: m.year,
            monthlyLimit: new Prisma.Decimal(b.limit),
            currentSpend: new Prisma.Decimal(
              Math.floor(Math.random() * b.limit * 0.6)
            ),
          },
        });

        count++;
      }
    }
  }

  console.log(`🎉 Budget seeding completed. Created: ${count}`);
}

// -----------------------------
main()
  .catch((e) => {
    console.error("❌ Error seeding budgets:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });