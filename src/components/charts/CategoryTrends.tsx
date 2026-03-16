"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface CategoryData {
  categoryName: string
  total: number
  color: string
  percentage: number
}

interface Props {
  data: CategoryData[]
}

interface TooltipPayloadItem {
  value: number
  payload: CategoryData
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
}) => {
  if (!active || !payload || payload.length === 0) return null
  const item = payload[0]
  return (
    <div
      style={{
        background: "#1e293b",
        border: "1px solid #1e3a5f",
        borderRadius: "8px",
        padding: "10px 14px",
        fontSize: "12px",
      }}
    >
      <p style={{ color: "#e2e8f0", fontWeight: 500 }}>
        {item.payload.categoryName}
      </p>
      <p style={{ color: "#94a3b8", marginTop: "2px" }}>
        ${item.value.toLocaleString()} · {item.payload.percentage}%
      </p>
    </div>
  )
}

export default function CategoryTrends({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[240px] flex items-center justify-center text-sm text-slate-600">
        No data yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 80 }}
        barCategoryGap="25%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#1e3a5f"
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) =>
            v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`
          }
        />
        <YAxis
          type="category"
          dataKey="categoryName"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={75}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="total" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}