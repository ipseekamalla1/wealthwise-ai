import { formatCurrency } from "@/lib/utils"

interface Report {
  id: string
  month: number
  year: number
  totalIncome: number
  totalExpenses: number
  netSavings: number
  aiSummary: string | null
  createdAt: string
}

interface Props {
  report: Report
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

export default function ReportCard({ report }: Props) {
  const savingsRate =
    report.totalIncome > 0
      ? Math.round((report.netSavings / report.totalIncome) * 100)
      : 0

  return (
    <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-slate-100">
            {MONTH_NAMES[report.month - 1]} {report.year}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Monthly report</p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
            report.netSavings >= 0
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {report.netSavings >= 0 ? "Surplus" : "Deficit"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-[#0f172a] rounded-lg p-3">
          <p className="text-xs text-slate-500 mb-1">Income</p>
          <p className="text-sm font-semibold text-green-400">
            {formatCurrency(report.totalIncome)}
          </p>
        </div>
        <div className="bg-[#0f172a] rounded-lg p-3">
          <p className="text-xs text-slate-500 mb-1">Expenses</p>
          <p className="text-sm font-semibold text-red-400">
            {formatCurrency(report.totalExpenses)}
          </p>
        </div>
        <div className="bg-[#0f172a] rounded-lg p-3">
          <p className="text-xs text-slate-500 mb-1">Saved</p>
          <p
            className={`text-sm font-semibold ${
              report.netSavings >= 0 ? "text-indigo-400" : "text-red-400"
            }`}
          >
            {formatCurrency(report.netSavings)}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-slate-500">Savings rate</span>
          <span
            className={
              savingsRate >= 20 ? "text-green-400" : "text-amber-400"
            }
          >
            {savingsRate}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#0f172a] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(savingsRate, 100)}%`,
              background: savingsRate >= 20 ? "#22c55e" : "#f59e0b",
            }}
          />
        </div>
      </div>

      {report.aiSummary && (
        <div className="border-t border-[#1e3a5f] pt-4">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-4 h-4 rounded bg-indigo-500/20 flex items-center justify-center">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#818cf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-xs text-indigo-400 font-medium">
              AI summary
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {report.aiSummary}
          </p>
        </div>
      )}
    </div>
  )
}