'use client'

import { useEffect, useState } from 'react'
import { X, Shield, Truck, Zap, Clock, Tag, Star, CheckCircle } from 'lucide-react'
import { IntentClassification } from '@/types'

interface Props {
  classification: IntentClassification
  cartTotal: number
  onAccept: (discountAmount: number) => void
  onDismiss: () => void
}

const reasonLabels: Record<string, string> = {
  price_sensitive: '💸 Price Sensitive',
  trust_issues: '🔐 Trust Hesitation',
  shipping_confusion: '🚚 Shipping Confusion',
  just_browsing: '👀 Just Browsing',
  payment_issues: '💳 Payment Friction',
  size_uncertainty: '📏 Size Uncertainty',
  urgent_buyer: '⚡ Urgent Buyer',
}

const strategyIcons: Record<string, React.ReactNode> = {
  discount: <Tag className="w-6 h-6 text-green-400" />,
  trust_signal: <Shield className="w-6 h-6 text-blue-400" />,
  delivery_clarity: <Truck className="w-6 h-6 text-purple-400" />,
  soft_nudge: <Clock className="w-6 h-6 text-yellow-400" />,
  fast_checkout: <Zap className="w-6 h-6 text-orange-400" />,
}

export default function RecoveryModal({ classification, cartTotal, onAccept, onDismiss }: Props) {
  const [visible, setVisible] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const { interventionStrategy: strategy, primaryReason, confidence } = classification

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
    if (strategy.urgency) {
      const t = setInterval(() => setCountdown(c => {
        if (c <= 1) { clearInterval(t); return 0 }
        return c - 1
      }), 1000)
      return () => clearInterval(t)
    }
  }, [])

  const discountAmount = strategy.offer
    ? strategy.offer.includes('₹')
      ? parseInt(strategy.offer.replace(/[^0-9]/g, ''))
      : Math.round(cartTotal * 0.10)
    : 0

  const trustPoints = [
    '✓ 100,000+ happy customers',
    '✓ 30-day free returns, no questions asked',
    '✓ 256-bit SSL encryption on all payments',
    '✓ 4.8★ rating across 50,000+ reviews',
  ]

  return (
    <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onDismiss} />

      {/* Modal */}
      <div className={`relative w-full max-w-md bg-surface-card border border-surface-border rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${visible ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}`}>

        {/* Accent bar */}
        <div className={`h-1 w-full ${
          strategy.type === 'discount' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
          strategy.type === 'trust_signal' ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
          strategy.type === 'delivery_clarity' ? 'bg-gradient-to-r from-purple-400 to-violet-500' :
          'bg-gradient-to-r from-yellow-400 to-amber-500'
        }`} />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center">
              {strategyIcons[strategy.type]}
            </div>
            <div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
                AI detected: {reasonLabels[primaryReason]}
                <span className="text-brand-500 ml-1">{confidence}% confidence</span>
              </div>
              <h3 className="font-display font-bold text-lg leading-tight">
                {strategy.type === 'discount' ? 'Exclusive Offer for You' :
                 strategy.type === 'trust_signal' ? 'Your Purchase is Protected' :
                 strategy.type === 'delivery_clarity' ? 'Fast Delivery Guaranteed' :
                 "We'll Save Your Cart"}
              </h3>
            </div>
          </div>
          <button onClick={onDismiss} className="text-slate-500 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          <p className="text-slate-300 text-sm leading-relaxed">{strategy.message}</p>

          {/* Discount card */}
          {strategy.type === 'discount' && strategy.offer && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-display font-bold text-green-400">{strategy.offer}</div>
              <div className="text-xs text-slate-400 mt-1">Applied automatically at checkout</div>
              {strategy.urgency && countdown > 0 && (
                <div className="text-xs text-orange-400 mt-2 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  Offer expires in {countdown}s
                </div>
              )}
            </div>
          )}

          {/* Trust signals */}
          {strategy.type === 'trust_signal' && (
            <div className="space-y-2">
              {trustPoints.map(p => (
                <div key={p} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  {p.replace('✓ ', '')}
                </div>
              ))}
            </div>
          )}

          {/* Delivery info */}
          {strategy.type === 'delivery_clarity' && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-purple-300">
                <Truck className="w-4 h-4" />
                <span className="font-semibold text-sm">Your delivery timeline</span>
              </div>
              <div className="text-sm text-slate-300">
                ✓ Order now → Ships today → Arrives tomorrow
              </div>
              <div className="text-xs text-slate-500">Free shipping on your order · Free returns within 30 days</div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => onAccept(discountAmount)}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3.5 rounded-xl font-semibold transition-all hover:scale-[1.02] glow-accent"
          >
            {strategy.cta}
          </button>

          <button
            onClick={onDismiss}
            className="w-full text-slate-500 hover:text-slate-300 text-sm transition-colors py-1"
          >
            No thanks, I'll leave
          </button>
        </div>
      </div>
    </div>
  )
}
