"use client"

import { useState, useEffect, useCallback } from "react"

export interface Transaction {
  id: string
  amount: number
  type: string
  description: string
  merchant: string | null
  date: string
  notes: string | null
  isAiCategorised: boolean
  categoryId: string | null
  category: {
    id: string
    name: string
    color: string
    icon: string
  } | null
}

export interface TransactionFilters {
  type?: string
  categoryId?: string
  from?: string
  to?: string
  page?: number
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string
}

export function useTransactions(filters: TransactionFilters = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams()
      if (filters.type) params.set("type", filters.type)
      if (filters.categoryId) params.set("categoryId", filters.categoryId)
      if (filters.from) params.set("from", filters.from)
      if (filters.to) params.set("to", filters.to)
      if (filters.page) params.set("page", String(filters.page))
      params.set("limit", "15")

      const res = await fetch(`/api/transactions?${params.toString()}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setTransactions(data.data)
      setTotal(data.pagination.total)
      setTotalPages(data.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load")
    } finally {
      setLoading(false)
    }
  }, [filters.type, filters.categoryId, filters.from, filters.to, filters.page])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return {
    transactions,
    total,
    totalPages,
    loading,
    error,
    refetch: fetchTransactions,
  }
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.data ?? []))
      .catch(console.error)
  }, [])

  return categories
}