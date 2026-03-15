"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setLoading(false)
      return
    }

    router.push("/login?registered=true")
  }

  const getStrength = () => {
    const len = form.password.length
    if (len === 0) return 0
    if (len < 4) return 1
    if (len < 7) return 2
    if (len < 10) return 3
    return 4
  }

  const getStrengthLabel = () => {
    const s = getStrength()
    if (s === 0) return ""
    if (s === 1) return "Too short"
    if (s === 2) return "Weak"
    if (s === 3) return "Good"
    return "Strong"
  }

  const getStrengthColor = (index: number) => {
    const s = getStrength()
    if (index > s) return "bg-[#1e3a5f]"
    if (s === 1) return "bg-red-500"
    if (s === 2) return "bg-amber-500"
    if (s === 3) return "bg-indigo-500"
    return "bg-green-500"
  }

  return (
    <div className="w-full max-w-[420px]">

      {/* Logo */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
        </div>
        <span className="text-xl font-semibold text-slate-100 tracking-tight">
          WealthWise
        </span>
      </div>

      {/* Card */}
      <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-2xl p-8">

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-100 tracking-tight mb-1">
            Create your account
          </h1>
          <p className="text-sm text-slate-500">
            Start managing your finances with AI
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-400">
              Full name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-[#0f172a] border border-[#1e3a5f] rounded-lg text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-400">
              Email address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-[#0f172a] border border-[#1e3a5f] rounded-lg text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-400">
              Password
            </label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-[#0f172a] border border-[#1e3a5f] rounded-lg text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />

            {/* Password strength */}
            {form.password.length > 0 && (
              <div className="pt-1 space-y-1.5">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1 rounded-full transition-colors ${getStrengthColor(i)}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500">{getStrengthLabel()}</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors mt-2"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#1e3a5f]" />
          <span className="text-xs text-slate-600">or</span>
          <div className="flex-1 h-px bg-[#1e3a5f]" />
        </div>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>

      <p className="text-center text-xs text-slate-700 mt-6">
        Your financial data is encrypted and secure
      </p>
    </div>
  )
}