"use client"

import { useState, useEffect, useCallback } from "react"

export interface Budget {
  id: string
  monthlyLimit: number
  currentSpend: number
  month: number
  year: number
  categoryId: string
  category: {
    id: string
    name: string
    color: string
    icon: string
  }
}

export function useBudgets(month?: number, year?: number) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const currentMonth = month ?? new Date().getMonth() + 1
  const currentYear = year ?? new Date().getFullYear()

  const fetchBudgets = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(
        `/api/budgets?month=${currentMonth}&year=${currentYear}`
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBudgets(
        data.data.map((b: Budget) => ({
          ...b,
          monthlyLimit: Number(b.monthlyLimit),
          currentSpend: Number(b.currentSpend),
        }))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load")
    } finally {
      setLoading(false)
    }
  }, [currentMonth, currentYear])

  useEffect(() => {
    fetchBudgets()
  }, [fetchBudgets])

  return { budgets, loading, error, refetch: fetchBudgets }
}