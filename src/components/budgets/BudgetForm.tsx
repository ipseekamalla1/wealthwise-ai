"use client"

import { useState } from "react"
import { useCategories } from "@/hooks/useTransactions"

interface Props {
  month: number
  year: number
  onSuccess: () => void
  onCancel: () => void
}

export default function BudgetForm({ month, year, onSuccess, onCancel }: Props) {
  const categories = useCategories()
  const [form, setForm] = useState({
    categoryId: "",
    monthlyLimit: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: form.categoryId,
        monthlyLimit: parseFloat(form.monthlyLimit),
        month,
        year,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? "Something went wrong")
      setLoading(false)
      return
    }

    onSuccess()
  }

  const inputClass =
    "w-full px-3 py-2.5 bg-[#0f172a] border border-[#1e3a5f] rounded-lg text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
  const labelClass = "block text-xs font-medium text-slate-400 mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div>
        <label className={labelClass}>Category</label>
        <select
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          required
          className={inputClass}
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Monthly limit</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
            $
          </span>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.monthlyLimit}
            onChange={(e) =>
              setForm({ ...form, monthlyLimit: e.target.value })
            }
            required
            className={`${inputClass} pl-7`}
          />
        </div>
      </div>

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
          {loading ? "Saving..." : "Set budget"}
        </button>
      </div>
    </form>
  )
}