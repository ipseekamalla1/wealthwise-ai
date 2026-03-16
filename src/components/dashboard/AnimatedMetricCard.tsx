"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface Props {
  label: string
  value: string
  rawValue: number
  delta?: string
  deltaType?: "positive" | "negative" | "neutral"
  icon: React.ReactNode
  prefix?: string
  suffix?: string
  index: number
}

export default function AnimatedMetricCard({
  label,
  value,
  delta,
  deltaType = "neutral",
  icon,
  index,
}: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 100)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <div
      className={cn(
        "bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-5 transition-all duration-500",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        <span className="text-slate-600 p-1.5 bg-[#0f172a] rounded-lg">
          {icon}
        </span>
      </div>
      <div className="text-2xl font-semibold text-slate-100 tracking-tight mb-1">
        {value}
      </div>
      {delta && (
        <div className={cn(
          "text-xs font-medium flex items-center gap-1",
          deltaType === "positive" && "text-green-400",
          deltaType === "negative" && "text-red-400",
          deltaType === "neutral" && "text-slate-500"
        )}>
          {deltaType === "positive" && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          )}
          {deltaType === "negative" && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
          {delta}
        </div>
      )}
    </div>
  )
}