'use client'

import { useState, useEffect } from 'react'
import { Brain, Activity, Zap } from 'lucide-react'

interface Props {
  riskScore: number
  timeOnPage: number
  onManualTrigger: () => void
  tracker: any
}

export default function BehaviorDebugPanel({ riskScore, timeOnPage, onManualTrigger, tracker }: Props) {
  const [session, setSession] = useState(tracker.getSession())

  useEffect(() => {
    const unsub = tracker.subscribe((s: any) => setSession({ ...s }))
    return unsub
  }, [])

  const riskColor = riskScore < 30 ? 'text-green-400' : riskScore < 60 ? 'text-yellow-400' : 'text-red-400'
  const riskBg = riskScore < 30 ? 'bg-green-500' : riskScore < 60 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-surface-card border border-surface-border rounded-2xl overflow-hidden shadow-2xl z-40">
      <div className="bg-brand-500/10 border-b border-surface-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-brand-500" />
          <span className="text-sm font-semibold text-brand-500">AI Debug Panel</span>
          <span className="text-xs text-slate-500">(judges view)</span>
        </div>
        <div className={`text-sm font-bold ${riskColor}`}>{riskScore}% risk</div>
      </div>

      <div className="p-4 space-y-3">
        {/* Risk bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Abandonment Risk</span>
            <span className={riskColor}>{riskScore < 30 ? 'Low' : riskScore < 60 ? 'Medium' : 'High'}</span>
          </div>
          <div className="h-2 bg-surface rounded-full overflow-hidden">
            <div
              className={`h-full ${riskBg} transition-all duration-500 rounded-full`}
              style={{ width: `${riskScore}%` }}
            />
          </div>
        </div>

        {/* Signals */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Coupon Attempts', value: session.couponAttempts, alert: session.couponAttempts > 0 },
            { label: 'Price Hovers', value: session.priceHovers, alert: session.priceHovers > 2 },
            { label: 'Back Presses', value: session.backButtonPresses, alert: session.backButtonPresses > 0 },
            { label: 'Inactivity', value: session.inactivityPeriods, alert: session.inactivityPeriods > 1 },
            { label: 'Shipping Checks', value: session.shippingChecks, alert: session.shippingChecks > 1 },
            { label: 'Time (s)', value: timeOnPage, alert: timeOnPage > 60 },
          ].map(sig => (
            <div key={sig.label} className={`rounded-lg p-2 text-center ${sig.alert ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-surface'}`}>
              <div className={`font-bold text-lg ${sig.alert ? 'text-orange-400' : 'text-white'}`}>{sig.value}</div>
              <div className="text-xs text-slate-500">{sig.label}</div>
            </div>
          ))}
        </div>

        {/* Recent events */}
        <div>
          <div className="text-xs text-slate-500 mb-2 flex items-center gap-1">
            <Activity className="w-3 h-3" /> Recent Events
          </div>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {session.events.slice(-5).reverse().map((e: any, i: number) => (
              <div key={i} className="text-xs flex items-center gap-2">
                <span className="text-brand-500">•</span>
                <span className="text-slate-400">{e.type.replace(/_/g, ' ')}</span>
                <span className="text-slate-600 ml-auto">{Math.round((Date.now() - e.timestamp) / 1000)}s ago</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trigger button */}
        <button
          onClick={onManualTrigger}
          className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white py-2 rounded-lg text-sm font-semibold transition-all"
        >
          <Zap className="w-4 h-4" />
          Trigger AI Recovery Now
        </button>
        <p className="text-xs text-center text-slate-600">
          Normally triggers on exit intent or inactivity
        </p>
      </div>
    </div>
  )
}
