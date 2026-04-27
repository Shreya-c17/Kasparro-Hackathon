import Link from 'next/link'
import { ShoppingBag, BarChart3, Zap, Shield, TrendingUp, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-surface flex flex-col">
      {/* Nav */}
      <nav className="border-b border-surface-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl">Veloce</span>
          <span className="ml-3 text-xs bg-brand-500/20 text-brand-500 px-2 py-0.5 rounded-full border border-brand-500/30">
            AI Recovery Demo
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/store" className="text-sm text-slate-400 hover:text-white transition-colors">
            Demo Store
          </Link>
          <Link href="/dashboard" className="text-sm bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg transition-colors">
            Merchant Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-500 text-sm px-4 py-2 rounded-full mb-8">
          <TrendingUp className="w-4 h-4" />
          Kasparro Agentic Commerce Hackathon — Track 2
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
          AI Checkout
          <span className="text-gradient block">Recovery Agent</span>
        </h1>

        <p className="text-slate-400 text-xl max-w-2xl mb-12 leading-relaxed">
          Detects <em>why</em> users abandon in real time. Classifies intent.
          Intervenes with personalized strategies — before they leave.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link
            href="/store"
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 glow-accent"
          >
            <ShoppingBag className="w-5 h-5" />
            Try the Demo Store
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-surface-card border border-surface-border hover:border-brand-500/50 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
          >
            <BarChart3 className="w-5 h-5" />
            Merchant Dashboard
          </Link>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {[
            {
              icon: '👁️',
              title: 'Track Behavior',
              desc: 'Monitor coupon attempts, price hovers, inactivity, back button presses in real-time',
            },
            {
              icon: '🧠',
              title: 'Classify Intent',
              desc: 'AI engine determines WHY the user is abandoning — not just that they are',
            },
            {
              icon: '⚡',
              title: 'Intervene',
              desc: 'Personalized intervention before they leave: discount, trust signal, or delivery clarity',
            },
          ].map((step) => (
            <div key={step.title} className="bg-surface-card border border-surface-border rounded-2xl p-6 text-left">
              <div className="text-3xl mb-4">{step.icon}</div>
              <h3 className="font-display font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full mt-8">
          {[
            { value: '44%', label: 'Recovery Rate' },
            { value: '₹3.8L', label: 'Revenue Recovered' },
            { value: '5', label: 'Intent Types' },
            { value: '<2s', label: 'Classification Time' },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface-card border border-surface-border rounded-xl p-4 text-center">
              <div className="font-display text-2xl font-bold text-brand-500">{stat.value}</div>
              <div className="text-slate-400 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
