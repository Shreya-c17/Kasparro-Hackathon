'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { TrendingUp, DollarSign, Users, Zap, ShoppingBag, ArrowUpRight, Brain, Activity } from 'lucide-react'
import { getMockMetrics } from '@/lib/metrics'

const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#a855f7', '#ef4444']

const reasonLabels: Record<string, string> = {
  price_sensitive: '💸 Price Sensitive',
  trust_issues: '🔐 Trust Issues',
  shipping_confusion: '🚚 Shipping Confusion',
  just_browsing: '👀 Just Browsing',
  payment_issues: '💳 Payment Issues',
}

export default function DashboardPage() {
  const metrics = getMockMetrics()
  const [activeTab, setActiveTab] = useState<'overview' | 'interventions' | 'sessions'>('overview')

  const statCards = [
    {
      label: 'Recovery Rate',
      value: `${metrics.recoveryRate}%`,
      sub: '+12.3% vs last week',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Revenue Recovered',
      value: `₹${(metrics.revenueRecovered / 1000).toFixed(0)}K`,
      sub: 'This month',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-brand-500',
      bg: 'bg-brand-500/10',
    },
    {
      label: 'Sessions Recovered',
      value: metrics.recoveredSessions,
      sub: `of ${metrics.abandonedSessions} abandoned`,
      icon: <Users className="w-5 h-5" />,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'AI Interventions',
      value: metrics.interventionEffectiveness.reduce((s, i) => s + i.shown, 0),
      sub: 'Personalized recoveries',
      icon: <Brain className="w-5 h-5" />,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
  ]

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="glass border-b border-surface-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-lg">Veloce Merchant Dashboard</span>
            <div className="flex items-center gap-1 text-xs text-green-400">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Live
            </div>
          </div>
        </div>
        <Link href="/store" className="flex items-center gap-2 text-sm bg-surface-card border border-surface-border hover:border-brand-500/50 px-4 py-2 rounded-lg transition-all">
          <ShoppingBag className="w-4 h-4" />
          View Store
        </Link>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(card => (
            <div key={card.label} className="bg-surface-card border border-surface-border rounded-2xl p-5">
              <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center ${card.color} mb-3`}>
                {card.icon}
              </div>
              <div className={`font-display text-3xl font-bold ${card.color}`}>{card.value}</div>
              <div className="text-slate-400 text-sm mt-1">{card.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['overview', 'interventions', 'sessions'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'bg-brand-500 text-white'
                  : 'bg-surface-card border border-surface-border text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recovery over time */}
            <div className="bg-surface-card border border-surface-border rounded-2xl p-6">
              <h3 className="font-display font-bold text-lg mb-1">Recovery Timeline</h3>
              <p className="text-slate-400 text-sm mb-6">Abandoned vs recovered sessions by hour</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={metrics.hourlyData} barGap={2}>
                  <XAxis dataKey="hour" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1e2130', border: '1px solid #2a2d3e', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Bar dataKey="abandoned" fill="#ef4444" opacity={0.6} radius={[4, 4, 0, 0]} name="Abandoned" />
                  <Bar dataKey="recovered" fill="#22c55e" radius={[4, 4, 0, 0]} name="Recovered" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Abandonment reasons */}
            <div className="bg-surface-card border border-surface-border rounded-2xl p-6">
              <h3 className="font-display font-bold text-lg mb-1">Why Users Abandon</h3>
              <p className="text-slate-400 text-sm mb-6">AI-classified abandonment reasons</p>
              <div className="flex gap-6">
                <ResponsiveContainer width="50%" height={180}>
                  <PieChart>
                    <Pie data={metrics.topAbandonmentReasons} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="count" paddingAngle={3}>
                      {metrics.topAbandonmentReasons.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e2130', border: '1px solid #2a2d3e', borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {metrics.topAbandonmentReasons.map((r, i) => (
                    <div key={r.reason} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                      <span className="text-xs text-slate-400 flex-1">{reasonLabels[r.reason] || r.reason}</span>
                      <span className="text-xs font-semibold">{r.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'interventions' && (
          <div className="bg-surface-card border border-surface-border rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg mb-1">Intervention Effectiveness</h3>
            <p className="text-slate-400 text-sm mb-6">How each AI strategy performs</p>
            <div className="space-y-4">
              {metrics.interventionEffectiveness.map(item => (
                <div key={item.type} className="bg-surface rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-semibold">{item.type}</span>
                      <span className="text-slate-400 text-sm ml-3">{item.shown} shown · {item.converted} converted</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-400 font-bold">
                      <ArrowUpRight className="w-4 h-4" />
                      {item.rate}%
                    </div>
                  </div>
                  <div className="h-2 bg-surface-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-green-400 rounded-full transition-all duration-700"
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="bg-surface-card border border-surface-border rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg mb-1">Session Intelligence</h3>
            <p className="text-slate-400 text-sm mb-6">How the AI classified recent sessions</p>
            <div className="space-y-3">
              {[
                { id: 'sess_a1b2', reason: 'price_sensitive', confidence: 87, action: 'Offered ₹200 discount', recovered: true, value: 3499 },
                { id: 'sess_c3d4', reason: 'trust_issues', confidence: 72, action: 'Showed trust signals', recovered: true, value: 2299 },
                { id: 'sess_e5f6', reason: 'shipping_confusion', confidence: 81, action: 'Clarified delivery timeline', recovered: false, value: 1899 },
                { id: 'sess_g7h8', reason: 'just_browsing', confidence: 65, action: 'Saved cart for 24hrs', recovered: false, value: 1599 },
                { id: 'sess_i9j0', reason: 'payment_issues', confidence: 78, action: 'Showed EMI options', recovered: true, value: 4299 },
              ].map(session => (
                <div key={session.id} className="bg-surface rounded-xl p-4 flex items-center gap-4">
                  <div className={`w-2 h-10 rounded-full flex-shrink-0 ${session.recovered ? 'bg-green-400' : 'bg-red-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-slate-400">{session.id}</span>
                      <span className="text-xs bg-brand-500/10 text-brand-500 px-2 py-0.5 rounded-full">
                        {reasonLabels[session.reason]}
                      </span>
                      <span className="text-xs text-slate-500">{session.confidence}% confidence</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{session.action}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${session.recovered ? 'text-green-400' : 'text-red-400'}`}>
                      {session.recovered ? '✓ Recovered' : '✗ Lost'}
                    </div>
                    <div className="text-xs text-slate-500">₹{session.value.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How it works explainer */}
        <div className="mt-6 bg-surface-card border border-brand-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-brand-500" />
            <h3 className="font-display font-bold">How the AI Recovery Works</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Behavior Tracking', desc: 'Tracks coupon attempts, price hovers, inactivity, shipping checks in real-time' },
              { step: '02', title: 'Intent Classification', desc: 'Scores behavioral signals to determine WHY the user is about to abandon' },
              { step: '03', title: 'AI Decision', desc: 'Selects the optimal intervention: discount, trust, delivery clarity, or soft nudge' },
              { step: '04', title: 'Personalized Recovery', desc: 'Shows the right message at the right moment — before the user leaves' },
            ].map(s => (
              <div key={s.step} className="relative">
                <div className="text-4xl font-display font-bold text-surface-border mb-2">{s.step}</div>
                <h4 className="font-semibold text-sm mb-1">{s.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
