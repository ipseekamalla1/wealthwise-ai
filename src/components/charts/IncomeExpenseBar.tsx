"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface MonthData {
  month: number
  year: number
  income: number
  expenses: number
}

interface IncomeExpenseBarProps {
  data: MonthData[]
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

export default function IncomeExpenseBar({ data }: IncomeExpenseBarProps) {
  const formatted = data.map((d) => ({
    name: MONTH_NAMES[d.month - 1],
    Income: d.income,
    Expenses: d.expenses,
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={formatted} barGap={4} barCategoryGap="30%">
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#1e3a5f"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) =>
            v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`
          }
        />
       <Tooltip
            contentStyle={{
              background: "#1e293b",
              border: "1px solid #1e3a5f",
              borderRadius: "8px",
              color: "#f1f5f9",
              fontSize: "13px",
            }}
            formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
          />
        <Legend
          wrapperStyle={{
            fontSize: "12px",
            color: "#64748b",
            paddingTop: "12px",
          }}
        />
        <Bar dataKey="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}