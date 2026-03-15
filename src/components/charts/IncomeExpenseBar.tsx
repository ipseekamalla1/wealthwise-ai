import { cn } from "@/lib/utils"

interface MetricCardProps {
  label: string
  value: string
  delta?: string
  deltaType?: "positive" | "negative" | "neutral"
  icon?: React.ReactNode
}

export default function MetricCard({
  label,
  value,
  delta,
  deltaType = "neutral",
  icon,
}: MetricCardProps) {
  return (
    <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <span className="text-slate-600">{icon}</span>
        )}
      </div>
      <div className="text-2xl font-semibold text-slate-100 tracking-tight mb-1">
        {value}
      </div>
      {delta && (
        <div
          className={cn(
            "text-xs font-medium",
            deltaType === "positive" && "text-green-400",
            deltaType === "negative" && "text-red-400",
            deltaType === "neutral" && "text-slate-500"
          )}
        >
          {delta}
        </div>
      )}
    </div>
  )
}