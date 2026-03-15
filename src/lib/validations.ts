import { z } from "zod"

export const TransactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["INCOME", "EXPENSE"]),
  description: z.string().min(1, "Description is required"),
  merchant: z.string().optional(),
  categoryId: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
})

export const UpdateTransactionSchema = TransactionSchema.partial()

export const BudgetSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  monthlyLimit: z.number().positive("Limit must be positive"),
  month: z.number().min(1).max(12),
  year: z.number().min(2020),
})

export const UpdateBudgetSchema = BudgetSchema.partial()

export type TransactionInput = z.infer<typeof TransactionSchema>
export type BudgetInput = z.infer<typeof BudgetSchema>