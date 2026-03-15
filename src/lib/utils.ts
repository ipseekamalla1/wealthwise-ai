import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const chartColors = {
  income:        "#22c55e",
  expense:       "#ef4444",
  primary:       "#6366f1",
  secondary:     "#8b5cf6",
  warning:       "#f59e0b",
  info:          "#3b82f6",
  categories: [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#22c55e",
    "#3b82f6",
    "#14b8a6",
    "#f97316",
    "#ef4444",
    "#06b6d4",
    "#a855f7",
    "#84cc16",
  ],
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function formatMonth(month: number, year: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1))
}