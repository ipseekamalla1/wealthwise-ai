"use client"

import { useState, useEffect } from "react"
import InsightCard from "@/components/dashboard/InsightCard"

interface Insight {
  id: string
  type: string
  title: string
  content: string
}

export default function InsightsSection() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/ai/insights")
      .then((r) => r.json())
      .then((d) => setInsights(d.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDismiss = (id: string) => {
    setInsights((prev) => prev.filter((i) => i.id !== id))
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-[#0f172a] rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (insights.length === 0) {
    return (
      <p className="text-sm text-slate-600 py-4 text-center">
        Add more transactions to generate AI insights
      </p>
    )
  }

  return (
    <div>
      {insights.map((insight) => (
        <InsightCard
          key={insight.id}
          insight={insight}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  )
}