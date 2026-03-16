"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    color: "#818cf8",
    bg: "rgba(129,140,248,0.08)",
    border: "rgba(129,140,248,0.15)",
    title: "AI expense categorisation",
    description:
      "Every transaction is automatically labelled the moment you add it. No manual tagging, no spreadsheets.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: "#4ade80",
    bg: "rgba(74,222,128,0.08)",
    border: "rgba(74,222,128,0.15)",
    title: "Streaming AI chatbot",
    description:
      "Ask your finances anything. The AI knows your real data and answers with specific numbers, not generic advice.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.15)",
    title: "Interactive analytics",
    description:
      "Six months of income vs expense trends, category breakdowns, and savings rate visualised in real time.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
    color: "#f87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.15)",
    title: "Smart budget alerts",
    description:
      "Set monthly limits per category. Get warned before you overspend with live progress bars.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    color: "#2dd4bf",
    bg: "rgba(45,212,191,0.08)",
    border: "rgba(45,212,191,0.15)",
    title: "Financial insights",
    description:
      "GPT-4o analyses your spending monthly and surfaces 3 to 5 specific, actionable observations.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    color: "#c084fc",
    bg: "rgba(192,132,252,0.08)",
    border: "rgba(192,132,252,0.15)",
    title: "Monthly AI reports",
    description:
      "One click generates a full written financial summary with your numbers, trends, and recommendations.",
  },
]

const stats = [
  { value: "GPT-4o", label: "AI model" },
  { value: "< 5s", label: "Auto-categorisation" },
  { value: "100%", label: "Free to use" },
  { value: "7", label: "Smart pages" },
]

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0]
  index: number
}) {
  const { ref, inView } = useInView(0.1)

  return (
    <div
      ref={ref}
      className="rounded-xl p-6 transition-all duration-700"
      style={{
        background: "#1e293b",
        border: "1px solid #1e3a5f",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{ background: feature.bg, border: `1px solid ${feature.border}` }}
      >
        {feature.icon}
      </div>
      <h3 className="text-sm font-semibold text-slate-100 mb-2">
        {feature.title}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed">
        {feature.description}
      </p>
    </div>
  )
}

function StatCard({
  stat,
  index,
}: {
  stat: (typeof stats)[0]
  index: number
}) {
  const { ref, inView } = useInView(0.1)

  return (
    <div
      ref={ref}
      className="text-center transition-all duration-700"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <p className="text-4xl font-semibold text-indigo-400 mb-1 tracking-tight">
        {stat.value}
      </p>
      <p className="text-xs text-slate-500 uppercase tracking-wider">
        {stat.label}
      </p>
    </div>
  )
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const { ref: statsRef, inView: statsInView } = useInView(0.1)
  const { ref: ctaRef, inView: ctaInView } = useInView(0.1)

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#e2e8f0",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >

      {/* Navbar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: scrolled ? "1px solid #1e3a5f" : "1px solid transparent",
          background: scrolled ? "rgba(15,23,42,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          transition: "all 0.3s",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 2rem",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "#6366f1",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <span style={{ fontSize: "16px", fontWeight: 600, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
              WealthWise
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link
              href="/login"
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                color: "#94a3b8",
                textDecoration: "none",
                borderRadius: "8px",
                transition: "color 0.15s",
              }}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              style={{
                padding: "8px 18px",
                fontSize: "13px",
                fontWeight: 500,
                color: "white",
                background: "#6366f1",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "background 0.15s",
              }}
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "6rem 2rem 5rem",
          textAlign: "center",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "100px",
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.2)",
            marginBottom: "2rem",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(-10px)",
            transition: "all 0.6s ease",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#818cf8",
              animation: "pulse 2s infinite",
            }}
          />
          <span style={{ fontSize: "12px", color: "#818cf8", fontWeight: 500 }}>
            Powered by GPT-4o · Built with Next.js + Prisma
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            marginBottom: "1.5rem",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s ease 0.1s",
          }}
        >
          <span style={{ color: "#f1f5f9" }}>Your finances,</span>
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #818cf8, #6366f1, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            understood by AI
          </span>
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: "17px",
            color: "#64748b",
            maxWidth: "520px",
            margin: "0 auto 2.5rem",
            lineHeight: 1.7,
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s ease 0.2s",
          }}
        >
          Track every dollar, get AI-powered insights, chat with your finances
          in plain English, and build better money habits — all in one place.
        </p>

        {/* CTA buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s ease 0.3s",
          }}
        >
          <Link
            href="/register"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 28px",
              background: "#6366f1",
              color: "white",
              fontSize: "14px",
              fontWeight: 500,
              borderRadius: "10px",
              textDecoration: "none",
              transition: "background 0.15s, transform 0.1s",
            }}
          >
            Start for free
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <Link
            href="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 28px",
              background: "#1e293b",
              border: "1px solid #1e3a5f",
              color: "#94a3b8",
              fontSize: "14px",
              fontWeight: 500,
              borderRadius: "10px",
              textDecoration: "none",
              transition: "border-color 0.15s",
            }}
          >
            Sign in
          </Link>
        </div>

        {/* Hero dashboard preview */}
        <div
          style={{
            marginTop: "4rem",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.97)",
            transition: "all 0.9s ease 0.4s",
          }}
        >
          <div
            style={{
              background: "#1e293b",
              border: "1px solid #1e3a5f",
              borderRadius: "16px",
              padding: "1.5rem",
              maxWidth: "860px",
              margin: "0 auto",
              boxShadow: "0 0 80px rgba(99,102,241,0.08)",
            }}
          >
            {/* Fake browser bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "1.25rem",
                paddingBottom: "1rem",
                borderBottom: "1px solid #1e3a5f",
              }}
            >
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444", opacity: 0.6 }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b", opacity: 0.6 }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e", opacity: 0.6 }} />
              <div
                style={{
                  flex: 1,
                  height: "24px",
                  background: "#0f172a",
                  borderRadius: "6px",
                  marginLeft: "8px",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "10px",
                }}
              >
                <span style={{ fontSize: "11px", color: "#475569" }}>
                  wealthwise-ai.vercel.app/dashboard
                </span>
              </div>
            </div>

            {/* Fake metric cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", marginBottom: "14px" }}>
              {[
                { label: "Total income", value: "$5,300", color: "#4ade80" },
                { label: "Total expenses", value: "$2,840", color: "#f87171" },
                { label: "Net savings", value: "$2,460", color: "#818cf8" },
                { label: "Savings rate", value: "46%", color: "#f59e0b" },
              ].map((card) => (
                <div
                  key={card.label}
                  style={{
                    background: "#0f172a",
                    border: "1px solid #1e3a5f",
                    borderRadius: "10px",
                    padding: "12px",
                  }}
                >
                  <p style={{ fontSize: "9px", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {card.label}
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: 600, color: card.color }}>
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Fake chart area */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px" }}>
              <div
                style={{
                  background: "#0f172a",
                  border: "1px solid #1e3a5f",
                  borderRadius: "10px",
                  padding: "14px",
                  height: "120px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <p style={{ fontSize: "10px", color: "#475569" }}>Income vs expenses</p>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "72px" }}>
                  {[
                    { inc: 60, exp: 45 },
                    { inc: 55, exp: 50 },
                    { inc: 70, exp: 40 },
                    { inc: 65, exp: 48 },
                    { inc: 75, exp: 42 },
                    { inc: 80, exp: 52 },
                  ].map((d, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", gap: "2px", alignItems: "flex-end" }}>
                      <div style={{ flex: 1, height: `${d.inc}%`, background: "#22c55e", borderRadius: "3px 3px 0 0", opacity: 0.8 }} />
                      <div style={{ flex: 1, height: `${d.exp}%`, background: "#ef4444", borderRadius: "3px 3px 0 0", opacity: 0.8 }} />
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  background: "#0f172a",
                  border: "1px solid #1e3a5f",
                  borderRadius: "10px",
                  padding: "14px",
                  height: "120px",
                }}
              >
                <p style={{ fontSize: "10px", color: "#475569", marginBottom: "10px" }}>Spending</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {[
                    { name: "Housing", pct: 42, color: "#6366f1" },
                    { name: "Food", pct: 21, color: "#f59e0b" },
                    { name: "Transport", pct: 14, color: "#3b82f6" },
                  ].map((c) => (
                    <div key={c.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                        <span style={{ fontSize: "9px", color: "#64748b" }}>{c.name}</span>
                        <span style={{ fontSize: "9px", color: "#64748b" }}>{c.pct}%</span>
                      </div>
                      <div style={{ height: "4px", background: "#1e3a5f", borderRadius: "2px" }}>
                        <div style={{ height: "100%", width: `${c.pct}%`, background: c.color, borderRadius: "2px" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        style={{
          borderTop: "1px solid #1e3a5f",
          borderBottom: "1px solid #1e3a5f",
          background: "rgba(30,41,59,0.4)",
        }}
      >
        <div
          ref={statsRef}
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "3rem 2rem",
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "2rem",
          }}
        >
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "6rem 2rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p style={{ fontSize: "12px", color: "#6366f1", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
            Everything you need
          </p>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 600,
              color: "#f1f5f9",
              letterSpacing: "-0.03em",
              marginBottom: "1rem",
            }}
          >
            Finance management, reimagined with AI
          </h2>
          <p style={{ color: "#64748b", fontSize: "15px", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
            Every feature is designed to save you time and give you clarity
            about where your money is going.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </section>

      {/* AI highlight section */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 2rem 6rem",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "20px",
            padding: "3rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "100px",
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.25)",
                marginBottom: "1.25rem",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span style={{ fontSize: "11px", color: "#818cf8", fontWeight: 500 }}>
                AI Finance Chat
              </span>
            </div>
            <h3
              style={{
                fontSize: "1.75rem",
                fontWeight: 600,
                color: "#f1f5f9",
                letterSpacing: "-0.03em",
                marginBottom: "1rem",
                lineHeight: 1.2,
              }}
            >
              Ask your finances anything
            </h3>
            <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.8, marginBottom: "1.5rem" }}>
              The AI chatbot has full context of your real transaction data.
              Ask it how much you spent on food last month, whether you are on
              track with savings, or where you can cut back.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                "How much did I spend this month?",
                "What is my biggest expense category?",
                "Am I on track with my savings goal?",
              ].map((q) => (
                <div
                  key={q}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    background: "rgba(15,23,42,0.6)",
                    border: "1px solid rgba(99,102,241,0.15)",
                    borderRadius: "10px",
                    fontSize: "13px",
                    color: "#94a3b8",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  {q}
                </div>
              ))}
            </div>
          </div>

          {/* Chat preview */}
          <div
            style={{
              background: "#1e293b",
              border: "1px solid #1e3a5f",
              borderRadius: "14px",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "12px", borderBottom: "1px solid #1e3a5f" }}>
              <div style={{ width: "28px", height: "28px", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <span style={{ fontSize: "13px", fontWeight: 500, color: "#e2e8f0" }}>WealthWise AI</span>
              <div style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
            </div>

            {[
              { role: "user", text: "How much did I spend on food this month?" },
              { role: "ai", text: "You spent $320 on Food & Dining this month across 8 transactions. That is 21% of your total expenses. Your budget limit is $400, so you have $80 remaining for the rest of the month." },
              { role: "user", text: "Is that too much?" },
              { role: "ai", text: "It is within budget, but slightly higher than last month ($280). If you are aiming to save more, consider reducing dining out by 1 to 2 meals per week — that could save you around $60." },
            ].map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "9px 13px",
                    borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                    background: msg.role === "user" ? "#6366f1" : "#0f172a",
                    border: msg.role === "user" ? "none" : "1px solid #1e3a5f",
                    fontSize: "12px",
                    lineHeight: 1.6,
                    color: msg.role === "user" ? "white" : "#94a3b8",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          borderTop: "1px solid #1e3a5f",
          background: "rgba(30,41,59,0.3)",
        }}
      >
        <div
          ref={ctaRef}
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "6rem 2rem",
            textAlign: "center",
            opacity: ctaInView ? 1 : 0,
            transform: ctaInView ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 600,
              color: "#f1f5f9",
              letterSpacing: "-0.03em",
              marginBottom: "1rem",
            }}
          >
            Take control of your money today
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: "15px",
              maxWidth: "400px",
              margin: "0 auto 2rem",
              lineHeight: 1.7,
            }}
          >
            Free to use. No credit card required. Powered by the latest AI.
          </p>
          <Link
            href="/register"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 32px",
              background: "#6366f1",
              color: "white",
              fontSize: "14px",
              fontWeight: 500,
              borderRadius: "10px",
              textDecoration: "none",
            }}
          >
            Create your free account
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1e3a5f" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "1.5rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "24px", height: "24px", background: "#6366f1", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <span style={{ fontSize: "13px", color: "#475569", fontWeight: 500 }}>
              WealthWise AI
            </span>
          </div>
          <p style={{ fontSize: "12px", color: "#334155" }}>
            Built with Next.js · Prisma · PostgreSQL · OpenAI
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

    </div>
  )
}