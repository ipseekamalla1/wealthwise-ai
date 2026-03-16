"use client"

import { useState } from "react"

interface Insight {
  id: string
  type: string
  title: string
  content: string
}

interface Props {
  insight: Insight
  onDismiss: (id: string) => void
}

const typeConfig: Record<string, { color: string; bg: string; border: string }> = {
  warning: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "#f59e0b",
  },
  success: {
    color: "#22c55e",
    bg: "rgba(34,197,94,0.08)",
    border: "#22c55e",
  },
  tip: {
    color: "#6366f1",
    bg: "rgba(99,102,241,0.08)",
    border: "#6366f1",
  },
  info: {
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "#3b82f6",
  },
}

export default function InsightCard({ insight, onDismiss }: Props) {
  const [dismissing, setDismissing] = useState(false)
  const config = typeConfig[insight.type] ?? typeConfig.info

  const handleDismiss = async () => {
    setDismissing(true)
    await fetch("/api/ai/insights", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: insight.id }),
    })
    onDismiss(insight.id)
  }

  return (
    <div
      style={{
        background: config.bg,
        borderLeft: `3px solid ${config.border}`,
      }}
      className="rounded-lg p-4 mb-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium mb-1"
            style={{ color: config.color }}
          >
            {insight.title}
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            {insight.content}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          disabled={dismissing}
          className="text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0 mt-0.5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}