import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

export type TransactionType = "INCOME" | "EXPENSE"

export interface TransactionWithCategory {
  id: string
  amount: number
  type: TransactionType
  description: string
  merchant: string | null
  date: Date
  notes: string | null
  isAiCategorised: boolean
  createdAt: Date
  categoryId: string | null
  category: {
    id: string
    name: string
    color: string
    icon: string
  } | null
}

export interface SummaryData {
  totalIncome: number
  totalExpenses: number
  netSavings: number
  savingsRate: number
  categoryBreakdown: {
    categoryId: string
    categoryName: string
    color: string
    total: number
    percentage: number
  }[]
  monthlyTrend: {
    month: number
    year: number
    income: number
    expenses: number
  }[]
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}