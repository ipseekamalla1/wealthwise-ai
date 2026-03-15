import Link from "next/link"
import { formatCurrency, formatDate } from "@/lib/utils"

interface Transaction {
  id: string
  amount: number
  type: string
  description: string
  merchant: string | null
  date: string | Date
  category: {
    name: string
    color: string
  } | null
}

interface Props {
  transactions: Transaction[]
}

export default function RecentTransactions({ transactions }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-600">
        No transactions yet.{" "}
        <Link href="/transactions" className="text-indigo-400 hover:underline">
          Add your first one
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center justify-between py-3 border-b border-[#1e3a5f] last:border-0"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0f172a] border border-[#1e3a5f] flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-indigo-400">
                {(tx.merchant ?? tx.description).charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">
                {tx.merchant ?? tx.description}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {tx.category && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-medium"
                    style={{
                      background: `${tx.category.color}20`,
                      color: tx.category.color,
                    }}
                  >
                    {tx.category.name}
                  </span>
                )}
                <span className="text-xs text-slate-600">
                  {formatDate(tx.date)}
                </span>
              </div>
            </div>
          </div>
          <span
            className={`text-sm font-semibold ${
              tx.type === "INCOME" ? "text-green-400" : "text-red-400"
            }`}
          >
            {tx.type === "INCOME" ? "+" : "-"}
            {formatCurrency(tx.amount)}
          </span>
        </div>
      ))}
      <div className="pt-3">
        <Link
          href="/transactions"
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View all transactions →
        </Link>
      </div>
    </div>
  )
}