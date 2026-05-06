import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const USER_ID = "cmostxkuv0000vlr9benjp6qv";

// -----------------------------
// Helpers
// -----------------------------
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

// -----------------------------
// Categories (YOUR EXISTING STRUCTURE)
// -----------------------------
const defaultCategories = [
  { name: "Housing", icon: "home", color: "#6366f1" },
  { name: "Food & Dining", icon: "utensils", color: "#f59e0b" },
  { name: "Transport", icon: "car", color: "#3b82f6" },
  { name: "Healthcare", icon: "heart-pulse", color: "#ef4444" },
  { name: "Shopping", icon: "shopping-bag", color: "#ec4899" },
  { name: "Entertainment", icon: "tv", color: "#8b5cf6" },
  { name: "Utilities", icon: "zap", color: "#14b8a6" },
  { name: "Education", icon: "graduation-cap", color: "#f97316" },
  { name: "Savings", icon: "piggy-bank", color: "#22c55e" },
  { name: "Income", icon: "trending-up", color: "#10b981" },
  { name: "Freelance", icon: "briefcase", color: "#06b6d4" },
  { name: "Other", icon: "circle", color: "#94a3b8" },
];

// -----------------------------
// Merchants
// -----------------------------
const merchants = {
  food: ["Tim Hortons", "Starbucks", "McDonald's", "Subway", "Pizza Pizza"],
  transport: ["Uber", "Presto Transit", "Gas Station"],
  shopping: ["Amazon", "Walmart", "Costco", "Best Buy"],
  entertainment: ["Netflix", "Spotify", "Cinema", "YouTube Premium"],
  health: ["Shoppers Drug Mart", "Pharmacy"],
  utilities: ["Hydro One", "Bell", "Rogers"],
};

// -----------------------------
// Date Generator
// -----------------------------
function generateDates(year: number, month: number) {
  const dates = [];
  const days = new Date(year, month, 0).getDate();

  for (let d = 1; d <= days; d++) {
    dates.push(new Date(year, month - 1, d));
  }

  return dates;
}

// -----------------------------
// Create Transaction
// -----------------------------
async function createTransaction(data: {
  amount: number;
  type: "income" | "expense";
  description: string;
  merchant?: string;
  date: Date;
  categoryId: string;
}) {
  return prisma.transaction.create({
    data: {
      amount: new Prisma.Decimal(data.amount),
      type: data.type,
      description: data.description,
      merchant: data.merchant,
      date: data.date,
      userId: USER_ID,
      categoryId: data.categoryId,
      isAiCategorised: Math.random() > 0.3,
    },
  });
}

// -----------------------------
// MAIN MONTH GENERATOR
// -----------------------------
async function generateMonth(
  year: number,
  month: number,
  categories: Record<string, any>
) {
  const dates = generateDates(year, month);

  for (const date of dates) {
    // ---------------- Salary ----------------
    if (date.getDate() === 1) {
      await createTransaction({
        amount: rand(3500, 4800),
        type: "income",
        description: "Monthly Salary",
        merchant: "Company Payroll",
        date,
        categoryId: categories["Income"].id,
      });
    }

    // ---------------- Freelance ----------------
    if (rand(1, 10) > 6) {
      await createTransaction({
        amount: rand(150, 900),
        type: "income",
        description: "Freelance Project",
        merchant: "Upwork Client",
        date,
        categoryId: categories["Freelance"].id,
      });
    }

    // ---------------- Savings ----------------
    if (date.getDate() === 2) {
      await createTransaction({
        amount: rand(300, 800),
        type: "expense",
        description: "Transferred to Savings",
        merchant: "Savings Account",
        date,
        categoryId: categories["Savings"].id,
      });
    }

    // ---------------- Daily Expenses ----------------
    const dailyTx = rand(3, 6);

    for (let i = 0; i < dailyTx; i++) {
      const roll = rand(1, 100);

      let category = "Food & Dining";
      let merchant = "Restaurant";
      let amount = rand(5, 40);

      if (roll < 25) {
        category = "Food & Dining";
        merchant = pick(merchants.food);
        amount = rand(5, 30);
      } else if (roll < 45) {
        category = "Transport";
        merchant = pick(merchants.transport);
        amount = rand(3, 25);
      } else if (roll < 65) {
        category = "Shopping";
        merchant = pick(merchants.shopping);
        amount = rand(25, 250);
      } else if (roll < 80) {
        category = "Entertainment";
        merchant = pick(merchants.entertainment);
        amount = rand(10, 70);
      } else if (roll < 90) {
        category = "Healthcare";
        merchant = pick(merchants.health);
        amount = rand(10, 60);
      } else {
        category = "Utilities";
        merchant = pick(merchants.utilities);
        amount = rand(40, 150);
      }

      await createTransaction({
        amount,
        type: "expense",
        description: `${merchant} purchase`,
        merchant,
        date,
        categoryId: categories[category].id,
      });
    }

    // ---------------- Fixed Expenses ----------------
    if (date.getDate() === 3) {
      await createTransaction({
        amount: rand(1500, 1900),
        type: "expense",
        description: "Monthly Rent",
        merchant: "Landlord",
        date,
        categoryId: categories["Housing"].id,
      });
    }

    if (date.getDate() === 8) {
      await createTransaction({
        amount: rand(90, 180),
        type: "expense",
        description: "Phone Bill",
        merchant: "Rogers",
        date,
        categoryId: categories["Utilities"].id,
      });
    }

    if (date.getDate() === 10) {
      await createTransaction({
        amount: rand(100, 220),
        type: "expense",
        description: "Electricity Bill",
        merchant: "Hydro One",
        date,
        categoryId: categories["Utilities"].id,
      });
    }

    if (date.getDate() === 15) {
      await createTransaction({
        amount: rand(300, 600),
        type: "expense",
        description: "Groceries (Bulk)",
        merchant: "Costco",
        date,
        categoryId: categories["Food & Dining"].id,
      });
    }

    // ---------------- Weekend Fun Boost ----------------
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday

    if (day === 0 || day === 6) {
      await createTransaction({
        amount: rand(40, 120),
        type: "expense",
        description: "Weekend outing",
        merchant: "Cinema",
        date,
        categoryId: categories["Entertainment"].id,
      });
    }
  }
}

// -----------------------------
// MAIN
// -----------------------------
async function main() {
  console.log("🌱 Seeding started...");

  // ---------------- Categories (safe upsert) ----------------
  const categories: Record<string, any> = {};

  for (const cat of defaultCategories) {
    const existing = await prisma.category.findFirst({
      where: {
        name: cat.name,
        userId: USER_ID,
      },
    });

    if (existing) {
      categories[cat.name] = existing;
    } else {
      const created = await prisma.category.create({
        data: {
          ...cat,
          isDefault: true,
          userId: USER_ID,
        },
      });
      categories[cat.name] = created;
    }
  }

  console.log("✅ Categories ready");

  // ---------------- Transactions ----------------
 await generateMonth(2026, 5, categories); // ✅ May
  console.log("🎉 Seeding completed!");
}

// -----------------------------
main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });