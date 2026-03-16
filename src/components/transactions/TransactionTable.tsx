"use client"

import { useState } from "react"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Transaction } from "@/hooks/useTransactions"

interface Props {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export default function TransactionTable({ transactions, onEdit, onDelete }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" })
    if (res.ok) {
      onDelete(id)
    }
    setDeletingId(null)
  }

  if (transactions.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-[#1e3a5f] flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <p className="text-sm text-slate-500">No transactions found</p>
        <p className="text-xs text-slate-600 mt-1">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#1e3a5f]">
            {["Date", "Description", "Category", "Type", "Amount", ""].map((h) => (
              <th
                key={h}
                className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 pr-4"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1e3a5f]">
          {transactions.map((tx) => (
            <tr key={tx.id} className="group hover:bg-white/2 transition-colors">
              <td className="py-3.5 pr-4 text-sm text-slate-400 whitespace-nowrap">
                {formatDate(tx.date)}
              </td>
              <td className="py-3.5 pr-4">
                <div className="text-sm font-medium text-slate-200">
                  {tx.description}
                </div>
                {tx.merchant && (
                  <div className="text-xs text-slate-500">{tx.merchant}</div>
                )}
              </td>
              <td className="py-3.5 pr-4">
                {tx.category ? (
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      background: `${tx.category.color}20`,
                      color: tx.category.color,
                    }}
                  >
                    {tx.category.name}
                  </span>
                ) : (
                  <span className="text-xs text-slate-600">Uncategorised</span>
                )}
              </td>
              <td className="py-3.5 pr-4">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    tx.type === "INCOME"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {tx.type === "INCOME" ? "Income" : "Expense"}
                </span>
              </td>
              <td className="py-3.5 pr-4">
                <span
                  className={`text-sm font-semibold ${
                    tx.type === "INCOME" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {tx.type === "INCOME" ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </span>
              </td>
              <td className="py-3.5">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(tx)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    disabled={deletingId === tx.id}
                    className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}