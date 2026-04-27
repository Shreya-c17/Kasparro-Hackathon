import { NextRequest, NextResponse } from 'next/server'
import { UserSession, IntentClassification, AbandonmentReason, InterventionStrategy } from '@/types'

// Rule-based fallback classifier (works without API key)
function ruleBasedClassify(session: UserSession): IntentClassification {
  const scores: Record<AbandonmentReason, number> = {
    price_sensitive: 0,
    trust_issues: 0,
    shipping_confusion: 0,
    just_browsing: 0,
    urgent_buyer: 0,
    payment_issues: 0,
    size_uncertainty: 0,
  }

  // Score based on behavior signals
  if (session.couponAttempts > 0) scores.price_sensitive += 40
  if (session.priceHovers > 2) scores.price_sensitive += 30
  if (session.shippingChecks > 1) scores.shipping_confusion += 45
  if (session.backButtonPresses > 1) scores.trust_issues += 35
  if (session.timeOnCheckout > 180) scores.trust_issues += 25
  if (session.inactivityPeriods > 2) scores.just_browsing += 40
  if (session.events.some(e => e.type === 'payment_hesitation')) {
    scores.payment_issues += 50
    scores.trust_issues += 20
  }
  if (session.events.some(e => e.type === 'size_check')) scores.size_uncertainty += 40
  if (session.timeOnCheckout < 30 && session.events.length < 5) scores.just_browsing += 50

  // Find primary reason
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a) as [AbandonmentReason, number][]
  const primaryReason = sorted[0][0]
  const confidence = Math.min(sorted[0][1], 95)
  const secondaryReasons = sorted.slice(1, 3).filter(([, s]) => s > 10).map(([r]) => r)

  return {
    primaryReason,
    confidence,
    secondaryReasons,
    interventionStrategy: getStrategy(primaryReason, session),
    reasoning: getReasoning(primaryReason, session),
  }
}

function getStrategy(reason: AbandonmentReason, session: UserSession): InterventionStrategy {
  const cartTotal = session.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  switch (reason) {
    case 'price_sensitive':
      return {
        type: 'discount',
        message: "We noticed you're comparing prices. Here's an exclusive offer just for you:",
        cta: 'Apply Discount & Complete Order',
        offer: cartTotal > 2000 ? '₹200 off your order' : '10% off your order',
        urgency: true,
      }
    case 'trust_issues':
      return {
        type: 'trust_signal',
        message: 'Your purchase is 100% protected. Here\'s why thousands trust us:',
        cta: 'I\'m Ready to Complete My Purchase',
        urgency: false,
      }
    case 'shipping_confusion':
      return {
        type: 'delivery_clarity',
        message: 'Your order will arrive by tomorrow if you order in the next 2 hours.',
        cta: 'Yes, I Want Fast Delivery',
        urgency: true,
      }
    case 'just_browsing':
      return {
        type: 'soft_nudge',
        message: 'Still thinking? We\'ll save your cart for 24 hours.',
        cta: 'Save Cart & Continue Later',
        urgency: false,
      }
    case 'payment_issues':
      return {
        type: 'fast_checkout',
        message: 'Trouble at payment? We have 8 payment options including 0% EMI.',
        cta: 'Choose a Different Payment Method',
        urgency: false,
      }
    default:
      return {
        type: 'soft_nudge',
        message: 'Need help completing your order?',
        cta: 'Complete My Order',
        urgency: false,
      }
  }
}

function getReasoning(reason: AbandonmentReason, session: UserSession): string {
  switch (reason) {
    case 'price_sensitive':
      return `User attempted coupon ${session.couponAttempts} time(s) and hovered over prices ${session.priceHovers} time(s), indicating price sensitivity.`
    case 'trust_issues':
      return `User pressed back ${session.backButtonPresses} time(s) and spent ${session.timeOnCheckout}s on checkout, suggesting hesitation about trust.`
    case 'shipping_confusion':
      return `User checked shipping details ${session.shippingChecks} time(s), indicating confusion about delivery.`
    case 'just_browsing':
      return `Low engagement with ${session.inactivityPeriods} inactivity period(s) and short session, suggesting casual browsing.`
    default:
      return 'Behavioral signals indicate potential abandonment risk.'
  }
}

export async function POST(req: NextRequest) {
  try {
    const session: UserSession = await req.json()

    // Try Claude API first
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (apiKey) {
      try {
        const prompt = `You are an expert e-commerce behavioral analyst. Analyze this checkout session and classify the abandonment intent.

Session data:
- Time on checkout: ${session.timeOnCheckout}s
- Coupon attempts: ${session.couponAttempts}
- Price hovers: ${session.priceHovers}
- Back button presses: ${session.backButtonPresses}
- Inactivity periods: ${session.inactivityPeriods}
- Shipping checks: ${session.shippingChecks}
- Events: ${session.events.map(e => e.type).join(', ')}
- Cart value: ₹${session.cart.reduce((s, i) => s + i.product.price * i.quantity, 0)}

Classify the PRIMARY abandonment reason as one of:
- price_sensitive: User is comparing prices or looking for discounts
- trust_issues: User is hesitant about security or legitimacy
- shipping_confusion: User is confused about delivery
- just_browsing: User was never serious about buying
- urgent_buyer: User wants to buy but needs reassurance
- payment_issues: User has trouble with payment methods
- size_uncertainty: User is unsure about size/fit

Respond in JSON: { "primaryReason": "...", "confidence": 0-100, "secondaryReasons": [], "reasoning": "..." }`

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 500,
            messages: [{ role: 'user', content: prompt }],
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const text = data.content[0].text
          const parsed = JSON.parse(text)
          const result: IntentClassification = {
            ...parsed,
            interventionStrategy: getStrategy(parsed.primaryReason, session),
          }
          return NextResponse.json(result)
        }
      } catch {
        // Fall through to rule-based
      }
    }

    // Rule-based fallback (works without API key)
    const result = ruleBasedClassify(session)
    return NextResponse.json(result)

  } catch (error) {
    return NextResponse.json({ error: 'Classification failed' }, { status: 500 })
  }
}
