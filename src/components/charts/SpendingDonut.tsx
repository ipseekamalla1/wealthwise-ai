"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface CategoryData {
  categoryId: string
  categoryName: string
  color: string
  total: number
  percentage: number
}

interface Props {
  data: CategoryData[]
}

export default function SpendingDonut({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[240px] flex items-center justify-center text-sm text-slate-600">
        No expense data yet
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="total"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#1e293b",
              border: "1px solid #1e3a5f",
              borderRadius: "8px",
              color: "#f1f5f9",
              fontSize: "13px",
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="space-y-2">
        {data.slice(0, 5).map((item) => (
          <div key={item.categoryId} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ background: item.color }}
              />
              <span className="text-xs text-slate-400">{item.categoryName}</span>
            </div>
            <span className="text-xs font-medium text-slate-300">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}