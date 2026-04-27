export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  badge?: string
  description: string
  sizes?: string[]
  deliveryDays: number
  inStock: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize?: string
}

export type AbandonmentReason =
  | 'price_sensitive'
  | 'trust_issues'
  | 'shipping_confusion'
  | 'just_browsing'
  | 'urgent_buyer'
  | 'payment_issues'
  | 'size_uncertainty'

export interface BehaviorEvent {
  type: 'page_view' | 'add_to_cart' | 'checkout_start' | 'price_hover' |
        'coupon_attempt' | 'back_button' | 'inactivity' | 'payment_hesitation' |
        'shipping_check' | 'exit_intent' | 'size_check' | 'tab_switch'
  timestamp: number
  metadata?: Record<string, unknown>
}

export interface UserSession {
  sessionId: string
  events: BehaviorEvent[]
  cart: CartItem[]
  timeOnCheckout: number
  couponAttempts: number
  priceHovers: number
  backButtonPresses: number
  inactivityPeriods: number
  shippingChecks: number
}

export interface IntentClassification {
  primaryReason: AbandonmentReason
  confidence: number
  secondaryReasons: AbandonmentReason[]
  interventionStrategy: InterventionStrategy
  reasoning: string
}

export interface InterventionStrategy {
  type: 'discount' | 'trust_signal' | 'delivery_clarity' | 'simplify' | 'soft_nudge' | 'fast_checkout'
  message: string
  cta: string
  offer?: string
  urgency?: boolean
}

export interface RecoveryMetrics {
  totalSessions: number
  abandonedSessions: number
  recoveredSessions: number
  recoveryRate: number
  revenueRecovered: number
  topAbandonmentReasons: { reason: AbandonmentReason; count: number; percentage: number }[]
  interventionEffectiveness: { type: string; shown: number; converted: number; rate: number }[]
  hourlyData: { hour: string; abandoned: number; recovered: number }[]
}
