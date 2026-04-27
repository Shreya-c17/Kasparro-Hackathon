import { BehaviorEvent, UserSession } from '@/types'

class BehaviorTracker {
  private session: UserSession
  private listeners: ((session: UserSession) => void)[] = []

  constructor() {
    this.session = {
      sessionId: this.generateId(),
      events: [],
      cart: [],
      timeOnCheckout: 0,
      couponAttempts: 0,
      priceHovers: 0,
      backButtonPresses: 0,
      inactivityPeriods: 0,
      shippingChecks: 0,
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15)
  }

  track(type: BehaviorEvent['type'], metadata?: Record<string, unknown>) {
    const event: BehaviorEvent = {
      type,
      timestamp: Date.now(),
      metadata,
    }
    this.session.events.push(event)

    // Update aggregated metrics
    switch (type) {
      case 'coupon_attempt':
        this.session.couponAttempts++
        break
      case 'price_hover':
        this.session.priceHovers++
        break
      case 'back_button':
        this.session.backButtonPresses++
        break
      case 'inactivity':
        this.session.inactivityPeriods++
        break
      case 'shipping_check':
        this.session.shippingChecks++
        break
    }

    this.notify()
  }

  getSession(): UserSession {
    return { ...this.session }
  }

  subscribe(listener: (session: UserSession) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach(l => l(this.getSession()))
  }

  reset() {
    this.session = {
      sessionId: this.generateId(),
      events: [],
      cart: [],
      timeOnCheckout: 0,
      couponAttempts: 0,
      priceHovers: 0,
      backButtonPresses: 0,
      inactivityPeriods: 0,
      shippingChecks: 0,
    }
  }

  // Compute a risk score 0-100 for abandonment likelihood
  getRiskScore(): number {
    let score = 0
    const s = this.session

    if (s.couponAttempts > 0) score += 25
    if (s.priceHovers > 2) score += 20
    if (s.backButtonPresses > 0) score += 20
    if (s.inactivityPeriods > 1) score += 15
    if (s.shippingChecks > 1) score += 10
    if (s.timeOnCheckout > 120) score += 10 // > 2 min = hesitating

    return Math.min(score, 100)
  }
}

// Singleton for client-side use
let trackerInstance: BehaviorTracker | null = null

export function getTracker(): BehaviorTracker {
  if (!trackerInstance) {
    trackerInstance = new BehaviorTracker()
  }
  return trackerInstance
}
