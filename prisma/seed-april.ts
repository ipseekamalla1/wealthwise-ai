import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userId = "cmnp9h5gd000qvlrdsl7t74rk"; // Replace with actual User ID

  console.log("Seeding April transactions...");

  const transactions = [
    // --- April 2 ---
    { date: "2026-04-02", description: "FreshCo #3894", amount: 32.07, type: "EXPENSE", categoryName: "Groceries" },
    { date: "2026-04-02", description: "Cashback/Remise En Argent", amount: 30.00, type: "INCOME", categoryName: "Cashback/Rewards" },
    { date: "2026-04-02", description: "Barburrito Milton", amount: 15.80, type: "EXPENSE", categoryName: "Dining/Fast Food" },

    // --- April 3 ---
    { date: "2026-04-03", description: "TT* Milton Tra Mar31", amount: 3.85, type: "EXPENSE", categoryName: "Transportation" },
    { date: "2026-04-03", description: "Uber Canada/UberTrip", amount: 4.47, type: "EXPENSE", categoryName: "Transportation" },

    // --- April 4 ---
    { date: "2026-04-04", description: "TT* Milton Tra Mar31", amount: 62.00, type: "EXPENSE", categoryName: "Transportation" },
    { date: "2026-04-04", description: "Uber Canada/UberTrip", amount: 4.69, type: "EXPENSE", categoryName: "Transportation" },
    { date: "2026-04-04", description: "Uber Canada/UberTrip", amount: 4.21, type: "EXPENSE", categoryName: "Transportation" },
    { date: "2026-04-04", description: "Uber Canada/UberEats", amount: 0, type: "EXPENSE", categoryName: "Dining/Fast Food" }, // Unknown amount

    // --- April 5 ---
    { date: "2026-04-05", description: "Uber Canada/UberTrip", amount: 5.23, type: "EXPENSE", categoryName: "Transportation" },
    { date: "2026-04-05", description: "Red Swan Pizza", amount: 3.38, type: "EXPENSE", categoryName: "Dining/Fast Food" },
    { date: "2026-04-05", description: "Presto Mobi", amount: 10.00, type: "EXPENSE", categoryName: "Transportation" },
    { date: "2026-04-05", description: "Presto Mobi", amount: 10.00, type: "EXPENSE", categoryName: "Transportation" },
    { date: "2026-04-05", description: "Tim Hortons #5617", amount: 15.90, type: "EXPENSE", categoryName: "Dining/Fast Food" },
    { date: "2026-04-05", description: "Uber Canada/UberTrip", amount: 5.16, type: "EXPENSE", categoryName: "Transportation" },

    // --- April 6 ---
    { date: "2026-04-06", description: "Uber Canada/UberTrip", amount: 3.69, type: "EXPENSE", categoryName: "Transportation" },
    { date: "2026-04-06", description: "Uber Canada/UberTrip", amount: 3.49, type: "EXPENSE", categoryName: "Transportation" },
    { date: "2026-04-06", description: "FreshCo #3894", amount: 8.64, type: "EXPENSE", categoryName: "Groceries" },
  ];

  for (const t of transactions) {
    const category = await prisma.category.findFirst({
      where: { name: t.categoryName },
    });

    await prisma.transaction.create({
      data: {
        userId,
        amount: t.amount,
        type: t.type,
        description: t.description,
        date: new Date(t.date),
        categoryId: category?.id,
        isAiCategorised: true,
      },
    });
  }

  console.log("April transactions seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


