import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const USER_ID = "cmmsaikwo0000vlpyg6d2sp7o"

async function main() {
  console.log("Seeding demo data for Ipseeka Malla...")

  const categories = await prisma.category.findMany({
    where: { isDefault: true },
    select: { id: true, name: true },
  })

  const categoryMap: Record<string, string> = {}
  categories.forEach((c) => {
    categoryMap[c.name] = c.id
  })

  const now = new Date()
  const year = now.getFullYear()

  const transactions = [
    {
      amount: 4500,
      type: "INCOME",
      description: "Monthly salary",
      merchant: "Employer Inc",
      categoryId: categoryMap["Income"],
      date: new Date(year, now.getMonth(), 1),
    },
    {
      amount: 1000,
      type: "EXPENSE",
      description: "Monthly rent",
      merchant: "Landlord",
      categoryId: categoryMap["Housing"],
      date: new Date(year, now.getMonth(), 2),
    },
    {
      amount: 120,
      type: "EXPENSE",
      description: "Grocery shopping",
      merchant: "Whole Foods",
      categoryId: categoryMap["Food & Dining"],
      date: new Date(year, now.getMonth(), 3),
    },
    {
      amount: 65,
      type: "EXPENSE",
      description: "Electricity bill",
      merchant: "City Power",
      categoryId: categoryMap["Utilities"],
      date: new Date(year, now.getMonth(), 4),
    },
    {
      amount: 45,
      type: "EXPENSE",
      description: "Uber rides",
      merchant: "Uber",
      categoryId: categoryMap["Transport"],
      date: new Date(year, now.getMonth(), 5),
    },
    {
      amount: 200,
      type: "EXPENSE",
      description: "New shoes",
      merchant: "Nike",
      categoryId: categoryMap["Shopping"],
      date: new Date(year, now.getMonth(), 6),
    },
    {
      amount: 800,
      type: "INCOME",
      description: "Freelance project",
      merchant: "Client Co",
      categoryId: categoryMap["Freelance"],
      date: new Date(year, now.getMonth(), 7),
    },
    {
      amount: 85,
      type: "EXPENSE",
      description: "Restaurant dinner",
      merchant: "The Keg",
      categoryId: categoryMap["Food & Dining"],
      date: new Date(year, now.getMonth(), 8),
    },
    {
      amount: 15,
      type: "EXPENSE",
      description: "Netflix subscription",
      merchant: "Netflix",
      categoryId: categoryMap["Entertainment"],
      date: new Date(year, now.getMonth(), 9),
    },
    {
      amount: 300,
      type: "EXPENSE",
      description: "Doctor visit",
      merchant: "City Clinic",
      categoryId: categoryMap["Healthcare"],
      date: new Date(year, now.getMonth(), 10),
    },
    {
      amount: 95,
      type: "EXPENSE",
      description: "Online course",
      merchant: "Udemy",
      categoryId: categoryMap["Education"],
      date: new Date(year, now.getMonth(), 11),
    },
    {
      amount: 500,
      type: "EXPENSE",
      description: "Monthly savings transfer",
      merchant: "TD Bank",
      categoryId: categoryMap["Savings"],
      date: new Date(year, now.getMonth(), 12),
    },
    {
      amount: 55,
      type: "EXPENSE",
      description: "Grocery run",
      merchant: "Trader Joes",
      categoryId: categoryMap["Food & Dining"],
      date: new Date(year, now.getMonth(), 13),
    },
    {
      amount: 40,
      type: "EXPENSE",
      description: "Gas station",
      merchant: "Shell",
      categoryId: categoryMap["Transport"],
      date: new Date(year, now.getMonth(), 14),
    },
    {
      amount: 150,
      type: "EXPENSE",
      description: "Phone bill",
      merchant: "Rogers",
      categoryId: categoryMap["Utilities"],
      date: new Date(year, now.getMonth(), 15),
    },
    {
      amount: 4500,
      type: "INCOME",
      description: "Monthly salary",
      merchant: "Employer Inc",
      categoryId: categoryMap["Income"],
      date: new Date(year, now.getMonth() - 1, 1),
    },
    {
      amount: 1000,
      type: "EXPENSE",
      description: "Monthly rent",
      merchant: "Landlord",
      categoryId: categoryMap["Housing"],
      date: new Date(year, now.getMonth() - 1, 2),
    },
    {
      amount: 320,
      type: "EXPENSE",
      description: "Grocery shopping",
      merchant: "Whole Foods",
      categoryId: categoryMap["Food & Dining"],
      date: new Date(year, now.getMonth() - 1, 5),
    },
    {
      amount: 600,
      type: "INCOME",
      description: "Freelance design work",
      merchant: "Design Studio",
      categoryId: categoryMap["Freelance"],
      date: new Date(year, now.getMonth() - 1, 10),
    },
    {
      amount: 180,
      type: "EXPENSE",
      description: "Shopping mall",
      merchant: "Zara",
      categoryId: categoryMap["Shopping"],
      date: new Date(year, now.getMonth() - 1, 12),
    },
    {
      amount: 75,
      type: "EXPENSE",
      description: "Internet bill",
      merchant: "Bell",
      categoryId: categoryMap["Utilities"],
      date: new Date(year, now.getMonth() - 1, 15),
    },
    {
      amount: 4500,
      type: "INCOME",
      description: "Monthly salary",
      merchant: "Employer Inc",
      categoryId: categoryMap["Income"],
      date: new Date(year, now.getMonth() - 2, 1),
    },
    {
      amount: 1000,
      type: "EXPENSE",
      description: "Monthly rent",
      merchant: "Landlord",
      categoryId: categoryMap["Housing"],
      date: new Date(year, now.getMonth() - 2, 2),
    },
    {
      amount: 280,
      type: "EXPENSE",
      description: "Groceries",
      merchant: "Costco",
      categoryId: categoryMap["Food & Dining"],
      date: new Date(year, now.getMonth() - 2, 6),
    },
    {
      amount: 900,
      type: "INCOME",
      description: "Freelance project",
      merchant: "Tech Startup",
      categoryId: categoryMap["Freelance"],
      date: new Date(year, now.getMonth() - 2, 14),
    },
    {
      amount: 120,
      type: "EXPENSE",
      description: "Transport passes",
      merchant: "TTC",
      categoryId: categoryMap["Transport"],
      date: new Date(year, now.getMonth() - 2, 8),
    },
    {
      amount: 4500,
      type: "INCOME",
      description: "Monthly salary",
      merchant: "Employer Inc",
      categoryId: categoryMap["Income"],
      date: new Date(year, now.getMonth() - 3, 1),
    },
    {
      amount: 1000,
      type: "EXPENSE",
      description: "Monthly rent",
      merchant: "Landlord",
      categoryId: categoryMap["Housing"],
      date: new Date(year, now.getMonth() - 3, 2),
    },
    {
      amount: 350,
      type: "EXPENSE",
      description: "Dining out",
      merchant: "Various restaurants",
      categoryId: categoryMap["Food & Dining"],
      date: new Date(year, now.getMonth() - 3, 10),
    },
    {
      amount: 400,
      type: "INCOME",
      description: "Side project payment",
      merchant: "Freelance Client",
      categoryId: categoryMap["Freelance"],
      date: new Date(year, now.getMonth() - 3, 20),
    },
    {
      amount: 4500,
      type: "INCOME",
      description: "Monthly salary",
      merchant: "Employer Inc",
      categoryId: categoryMap["Income"],
      date: new Date(year, now.getMonth() - 4, 1),
    },
    {
      amount: 1000,
      type: "EXPENSE",
      description: "Monthly rent",
      merchant: "Landlord",
      categoryId: categoryMap["Housing"],
      date: new Date(year, now.getMonth() - 4, 2),
    },
    {
      amount: 290,
      type: "EXPENSE",
      description: "Groceries",
      merchant: "Whole Foods",
      categoryId: categoryMap["Food & Dining"],
      date: new Date(year, now.getMonth() - 4, 7),
    },
    {
      amount: 250,
      type: "EXPENSE",
      description: "New jacket",
      merchant: "H&M",
      categoryId: categoryMap["Shopping"],
      date: new Date(year, now.getMonth() - 4, 18),
    },
    {
      amount: 4500,
      type: "INCOME",
      description: "Monthly salary",
      merchant: "Employer Inc",
      categoryId: categoryMap["Income"],
      date: new Date(year, now.getMonth() - 5, 1),
    },
    {
      amount: 1000,
      type: "EXPENSE",
      description: "Monthly rent",
      merchant: "Landlord",
      categoryId: categoryMap["Housing"],
      date: new Date(year, now.getMonth() - 5, 2),
    },
    {
      amount: 310,
      type: "EXPENSE",
      description: "Food and dining",
      merchant: "Various",
      categoryId: categoryMap["Food & Dining"],
      date: new Date(year, now.getMonth() - 5, 9),
    },
    {
      amount: 700,
      type: "INCOME",
      description: "Freelance work",
      merchant: "Agency",
      categoryId: categoryMap["Freelance"],
      date: new Date(year, now.getMonth() - 5, 22),
    },
  ]

  let created = 0
  for (const tx of transactions) {
    await prisma.transaction.create({
      data: {
        ...tx,
        userId: USER_ID,
        isAiCategorised: true,
      },
    })
    created++
  }

  console.log(`Created ${created} demo transactions`)
  console.log("Demo data seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })