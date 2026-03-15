"use client"

import { useSession } from "next-auth/react"

interface TopBarProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export default function TopBar({ title, subtitle, action }: TopBarProps) {
  const { data: session } = useSession()

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {action}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#1e3a5f]">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <span className="text-xs font-semibold text-indigo-400">
              {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </span>
          </div>
          <span className="text-sm text-slate-400 hidden sm:block">
            {session?.user?.name ?? "User"}
          </span>
        </div>
      </div>
    </div>
  )
}