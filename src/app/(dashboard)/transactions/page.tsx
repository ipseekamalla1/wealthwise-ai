"use client"

import { useState } from "react"
import TopBar from "@/components/layout/TopBar"
import TransactionTable from "@/components/transactions/TransactionTable"
import TransactionForm from "@/components/transactions/TransactionForm"
import FilterBar from "@/components/transactions/FilterBar"
import { useTransactions } from "@/hooks/useTransactions"
import type { Transaction, TransactionFilters } from "@/hooks/useTransactions"

export default function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilters>({ page: 1 })
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const { transactions, total, totalPages, loading, refetch } = useTransactions(filters)

  const handleSuccess = () => {
    setShowForm(false)
    setEditingTransaction(null)
    refetch()
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setShowForm(true)
  }

  const handleDelete = () => {
    refetch()
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingTransaction(null)
  }

  return (
    <div>
      <TopBar
        title="Transactions"
        subtitle={`${total} total transactions`}
        action={
          <button
            onClick={() => {
              setEditingTransaction(null)
              setShowForm(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add transaction
          </button>
        }
      />

      {/* Slide-in form panel */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/50"
            onClick={handleCancel}
          />
          <div className="w-full max-w-md bg-[#1e293b] border-l border-[#1e3a5f] h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-100">
                {editingTransaction ? "Edit transaction" : "Add transaction"}
              </h2>
              <button
                onClick={handleCancel}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <TransactionForm
              transaction={editingTransaction ?? undefined}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-4 mb-4">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      {/* Table */}
      <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-5">
        {loading ? (
          <div className="space-y-3 py-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-[#0f172a] rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <TransactionTable
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#1e3a5f]">
            <span className="text-xs text-slate-500">
              Page {filters.page ?? 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters({ ...filters, page: (filters.page ?? 1) - 1 })}
                disabled={(filters.page ?? 1) <= 1}
                className="px-3 py-1.5 bg-[#0f172a] border border-[#1e3a5f] text-slate-400 hover:text-slate-200 text-sm rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setFilters({ ...filters, page: (filters.page ?? 1) + 1 })}
                disabled={(filters.page ?? 1) >= totalPages}
                className="px-3 py-1.5 bg-[#0f172a] border border-[#1e3a5f] text-slate-400 hover:text-slate-200 text-sm rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}