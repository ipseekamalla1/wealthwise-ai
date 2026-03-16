"use client"

import { useState, useEffect } from "react"
import { useCategories } from "@/hooks/useTransactions"
import type { Transaction } from "@/hooks/useTransactions"

interface Props {
  transaction?: Transaction
  onSuccess: () => void
  onCancel: () => void
}

export default function TransactionForm({ transaction, onSuccess, onCancel }: Props) {
  const categories = useCategories()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    type: transaction?.type ?? "EXPENSE",
    amount: transaction ? String(transaction.amount) : "",
    description: transaction?.description ?? "",
    merchant: transaction?.merchant ?? "",
    categoryId: transaction?.categoryId ?? "",
    date: transaction
      ? new Date(transaction.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    notes: transaction?.notes ?? "",
  })

  useEffect(() => {
    if (transaction) {
      setForm({
        type: transaction.type,
        amount: String(transaction.amount),
        description: transaction.description,
        merchant: transaction.merchant ?? "",
        categoryId: transaction.categoryId ?? "",
        date: new Date(transaction.date).toISOString().split("T")[0],
        notes: transaction.notes ?? "",
      })
    }
  }, [transaction])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const payload = {
      type: form.type,
      amount: parseFloat(form.amount),
      description: form.description,
      merchant: form.merchant || undefined,
      categoryId: form.categoryId || undefined,
      date: form.date,
      notes: form.notes || undefined,
    }

    const url = transaction
      ? `/api/transactions/${transaction.id}`
      : "/api/transactions"

    const method = transaction ? "PATCH" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? "Something went wrong")
      setLoading(false)
      return
    }

    onSuccess()
  }

  const inputClass = "w-full px-3 py-2.5 bg-[#0f172a] border border-[#1e3a5f] rounded-lg text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
  const labelClass = "block text-xs font-medium text-slate-400 mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Type toggle */}
      <div>
        <label className={labelClass}>Type</label>
        <div className="flex rounded-lg overflow-hidden border border-[#1e3a5f]">
          {["EXPENSE", "INCOME"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm({ ...form, type: t })}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                form.type === t
                  ? t === "EXPENSE"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-green-500/20 text-green-400"
                  : "bg-[#0f172a] text-slate-500 hover:text-slate-300"
              }`}
            >
              {t === "EXPENSE" ? "Expense" : "Income"}
            </button>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className={labelClass}>Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
            className={`${inputClass} pl-7`}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <input
          type="text"
          placeholder="What was this for?"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          className={inputClass}
        />
      </div>

      {/* Merchant */}
      <div>
        <label className={labelClass}>Merchant (optional)</label>
        <input
          type="text"
          placeholder="e.g. Whole Foods"
          value={form.merchant}
          onChange={(e) => setForm({ ...form, merchant: e.target.value })}
          className={inputClass}
        />
      </div>

      {/* Category + Date row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Category</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className={inputClass}
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
            className={inputClass}
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className={labelClass}>Notes (optional)</label>
        <textarea
          placeholder="Any extra details..."
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={2}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 bg-[#0f172a] border border-[#1e3a5f] text-slate-400 hover:text-slate-200 text-sm font-medium rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading
            ? "Saving..."
            : transaction
            ? "Save changes"
            : "Add transaction"}
        </button>
      </div>
    </form>
  )
}