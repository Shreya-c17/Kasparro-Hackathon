'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Shield, Truck, Tag, ChevronLeft, Lock, Clock, Star, AlertTriangle } from 'lucide-react'
import { CartItem, IntentClassification, BehaviorEvent } from '@/types'
import { getTracker } from '@/lib/tracker'
import RecoveryModal from '@/components/checkout/RecoveryModal'
import BehaviorDebugPanel from '@/components/checkout/BehaviorDebugPanel'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tracker = getTracker()

  const [cart, setCart] = useState<CartItem[]>([])
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', pincode: '',
    payment: 'card', coupon: '',
  })
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [classification, setClassification] = useState<IntentClassification | null>(null)
  const [isClassifying, setIsClassifying] = useState(false)
  const [discountApplied, setDiscountApplied] = useState(0)
  const [showDebug, setShowDebug] = useState(true)
  const [riskScore, setRiskScore] = useState(0)
  const [timeOnPage, setTimeOnPage] = useState(0)
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null)
  const lastActivity = useRef(Date.now())
  const hasShownModal = useRef(false)
  const exitIntentBound = useRef(false)

  useEffect(() => {
    try {
      const cartData = searchParams.get('cart')
      if (cartData) setCart(JSON.parse(decodeURIComponent(cartData)))
    } catch {}
    tracker.track('checkout_start')
  }, [])

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOnPage(t => t + 1)
      tracker.getSession().timeOnCheckout
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Update risk score
  useEffect(() => {
    const unsub = tracker.subscribe((session) => {
      setRiskScore(tracker.getRiskScore())
    })
    return unsub
  }, [])

  // Inactivity detection
  const resetInactivity = useCallback(() => {
    lastActivity.current = Date.now()
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
    inactivityTimer.current = setTimeout(() => {
      tracker.track('inactivity')
      if (!hasShownModal.current && tracker.getRiskScore() >= 30) {
        triggerClassification()
      }
    }, 15000) // 15s inactivity
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', resetInactivity)
    window.addEventListener('keypress', resetInactivity)
    resetInactivity()
    return () => {
      window.removeEventListener('mousemove', resetInactivity)
      window.removeEventListener('keypress', resetInactivity)
    }
  }, [resetInactivity])

  // Exit intent detection
  useEffect(() => {
    if (exitIntentBound.current) return
    exitIntentBound.current = true

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !hasShownModal.current) {
        tracker.track('exit_intent')
        triggerClassification()
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [])

  const triggerClassification = async () => {
    if (hasShownModal.current || isClassifying) return
    hasShownModal.current = true
    setIsClassifying(true)

    const session = tracker.getSession()
    session.cart = cart
    session.timeOnCheckout = timeOnPage

    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
      })
      const data: IntentClassification = await res.json()
      setClassification(data)
      setShowModal(true)
    } catch {
      // Fallback
      setClassification({
        primaryReason: 'just_browsing',
        confidence: 60,
        secondaryReasons: [],
        interventionStrategy: {
          type: 'soft_nudge',
          message: "Still thinking? We'll save your cart.",
          cta: 'Complete My Order',
        },
        reasoning: 'Fallback classification',
      })
      setShowModal(true)
    } finally {
      setIsClassifying(false)
    }
  }

  const handleCoupon = () => {
    tracker.track('coupon_attempt')
    if (form.coupon.toUpperCase() === 'SAVE10') {
      setCouponApplied(true)
      setCouponError('')
      setDiscountApplied(Math.round(subtotal * 0.10))
    } else {
      setCouponError('Invalid coupon code')
      setTimeout(() => setCouponError(''), 3000)
    }
  }

  const handleBackButton = () => {
    tracker.track('back_button')
    if (!hasShownModal.current && tracker.getRiskScore() >= 20) {
      triggerClassification()
    } else {
      router.push('/store')
    }
  }

  const applyModalDiscount = (amount: number) => {
    setDiscountApplied(amount)
    setShowModal(false)
  }

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const shipping = subtotal > 999 ? 0 : 99
  const total = subtotal + shipping - discountApplied

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="glass border-b border-surface-border px-6 py-4 flex items-center justify-between">
        <button onClick={handleBackButton} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
          Back to Store
        </button>
        <span className="font-display font-bold text-lg flex items-center gap-2">
          <Lock className="w-4 h-4 text-green-400" /> Secure Checkout
        </span>
        <button
          onClick={() => setShowDebug(v => !v)}
          className="text-xs text-slate-500 hover:text-brand-500 transition-colors"
        >
          {showDebug ? 'Hide' : 'Show'} AI Debug
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">

          {/* Contact */}
          <div className="bg-surface-card border border-surface-border rounded-2xl p-6">
            <h2 className="font-display font-bold text-lg mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Full Name', placeholder: 'Arjun Sharma' },
                { key: 'email', label: 'Email', placeholder: 'arjun@email.com' },
                { key: 'phone', label: 'Phone', placeholder: '+91 98765 43210' },
              ].map(field => (
                <div key={field.key} className={field.key === 'email' ? 'md:col-span-2' : ''}>
                  <label className="text-sm text-slate-400 mb-1 block">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    className="w-full bg-surface border border-surface-border rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div
            className="bg-surface-card border border-surface-border rounded-2xl p-6"
            onMouseEnter={() => tracker.track('shipping_check')}
          >
            <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-500" /> Delivery Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'address', label: 'Address', placeholder: '123 MG Road', span: true },
                { key: 'city', label: 'City', placeholder: 'Chennai' },
                { key: 'pincode', label: 'Pincode', placeholder: '600001' },
              ].map(field => (
                <div key={field.key} className={(field as any).span ? 'md:col-span-2' : ''}>
                  <label className="text-sm text-slate-400 mb-1 block">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    className="w-full bg-surface border border-surface-border rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              ))}
            </div>

            {/* Delivery estimate */}
            <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-3">
              <Clock className="w-4 h-4 text-green-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-green-400">
                  {cart[0]?.product.deliveryDays === 1 ? 'Tomorrow' :
                   cart[0]?.product.deliveryDays === 2 ? 'In 2 days' : 'In 3-4 days'} delivery available
                </div>
                <div className="text-xs text-slate-400">Order in the next 3 hours for guaranteed delivery</div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div
            className="bg-surface-card border border-surface-border rounded-2xl p-6"
            onMouseEnter={() => tracker.track('payment_hesitation')}
          >
            <h2 className="font-display font-bold text-lg mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {['card', 'upi', 'netbanking', 'cod', 'emi'].map(method => (
                <button
                  key={method}
                  onClick={() => setForm(f => ({ ...f, payment: method }))}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    form.payment === method
                      ? 'border-brand-500 bg-brand-500/10 text-brand-500'
                      : 'border-surface-border bg-surface text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {method === 'card' ? '💳 Card' :
                   method === 'upi' ? '📱 UPI' :
                   method === 'netbanking' ? '🏦 Net Banking' :
                   method === 'cod' ? '💵 Cash on Delivery' :
                   '0% EMI'}
                </button>
              ))}
            </div>

            {/* Coupon */}
            <div
              className="flex gap-3"
              onFocus={() => tracker.track('coupon_attempt')}
            >
              <input
                type="text"
                placeholder="Have a coupon? Try SAVE10"
                value={form.coupon}
                onChange={e => setForm(f => ({ ...f, coupon: e.target.value }))}
                className="flex-1 bg-surface border border-surface-border rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"
              />
              <button
                onClick={handleCoupon}
                className="flex items-center gap-2 bg-surface-card border border-surface-border hover:border-brand-500 px-4 py-3 rounded-lg text-sm font-semibold transition-all"
              >
                <Tag className="w-4 h-4" /> Apply
              </button>
            </div>
            {couponError && <p className="text-red-400 text-xs mt-2">{couponError}</p>}
            {couponApplied && <p className="text-green-400 text-xs mt-2">✓ Coupon SAVE10 applied — 10% off!</p>}
          </div>

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: <Shield className="w-5 h-5 text-green-400" />, label: 'Secure Payment', sub: '256-bit SSL' },
              { icon: <Truck className="w-5 h-5 text-blue-400" />, label: 'Free Returns', sub: '30 days' },
              { icon: <Star className="w-5 h-5 text-yellow-400" />, label: '4.8★ Rated', sub: '100K+ reviews' },
            ].map(t => (
              <div key={t.label} className="bg-surface-card border border-surface-border rounded-xl p-4 text-center">
                <div className="flex justify-center mb-2">{t.icon}</div>
                <div className="text-sm font-semibold">{t.label}</div>
                <div className="text-xs text-slate-500">{t.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface-card border border-surface-border rounded-2xl p-6 sticky top-24">
            <h2 className="font-display font-bold text-lg mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.product.name}</div>
                    <div className="text-xs text-slate-500">Qty: {item.quantity}</div>
                    <div className="text-sm font-semibold text-brand-500">₹{(item.product.price * item.quantity).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-surface-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-400' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              {discountApplied > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span><span>−₹{discountApplied.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-display font-bold text-lg border-t border-surface-border pt-3">
                <span>Total</span><span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/store')}
              className="w-full mt-4 bg-brand-500 hover:bg-brand-600 text-white py-4 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02] glow-accent flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" /> Place Order
            </button>

            <p className="text-center text-xs text-slate-500 mt-3">
              🔒 Your payment info is encrypted and secure
            </p>
          </div>
        </div>
      </div>

      {/* Debug Panel */}
      {showDebug && (
        <BehaviorDebugPanel
          riskScore={riskScore}
          timeOnPage={timeOnPage}
          onManualTrigger={triggerClassification}
          tracker={tracker}
        />
      )}

      {/* Recovery Modal */}
      {showModal && classification && (
        <RecoveryModal
          classification={classification}
          cartTotal={subtotal}
          onAccept={applyModalDiscount}
          onDismiss={() => setShowModal(false)}
        />
      )}

      {/* Classifying indicator */}
      {isClassifying && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-surface-card border border-brand-500/30 rounded-full px-6 py-3 flex items-center gap-3 z-50">
          <div className="w-3 h-3 bg-brand-500 rounded-full animate-pulse" />
          <span className="text-sm text-brand-500">Analyzing checkout behavior...</span>
        </div>
      )}
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center text-slate-400">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
