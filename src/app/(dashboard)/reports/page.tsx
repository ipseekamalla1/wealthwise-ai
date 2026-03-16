"use client"

import { useState, useEffect, useCallback } from "react"
import TopBar from "@/components/layout/TopBar"
import ReportCard from "@/components/reports/ReportCard"

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

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch("/api/reports")
      const data = await res.json()
      const mapped = (data.data ?? []).map((r: Report) => ({
        ...r,
        totalIncome: Number(r.totalIncome),
        totalExpenses: Number(r.totalExpenses),
        netSavings: Number(r.netSavings),
      }))
      setReports(mapped)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const generateReport = async () => {
    setGenerating(true)
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: currentMonth,
          year: currentYear,
        }),
      })
      if (res.ok) {
        await fetchReports()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div>
      <TopBar
        title="Reports"
        subtitle="Monthly financial reports"
        action={
          <button
            onClick={generateReport}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
          >
            {generating ? (
              <>
                <svg
                  className="animate-spin"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Generate this month
              </>
            )}
          </button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-[#1e293b] border border-[#1e3a5f] rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-16 text-center">
          <div className="w-12 h-12 rounded-full bg-[#0f172a] border border-[#1e3a5f] flex items-center justify-center mx-auto mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p className="text-sm text-slate-400 mb-1">No reports yet</p>
          <p className="text-xs text-slate-600 mb-6">
            Generate your first monthly report with AI analysis
          </p>
          <button
            onClick={generateReport}
            disabled={generating}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-800 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {generating ? "Generating..." : "Generate report"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  )
}