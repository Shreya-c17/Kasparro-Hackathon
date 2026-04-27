import { RecoveryMetrics } from '@/types'

export function getMockMetrics(): RecoveryMetrics {
  return {
    totalSessions: 1247,
    abandonedSessions: 423,
    recoveredSessions: 187,
    recoveryRate: 44.2,
    revenueRecovered: 384500,
    topAbandonmentReasons: [
      { reason: 'price_sensitive', count: 156, percentage: 36.9 },
      { reason: 'shipping_confusion', count: 98, percentage: 23.2 },
      { reason: 'trust_issues', count: 72, percentage: 17.0 },
      { reason: 'just_browsing', count: 61, percentage: 14.4 },
      { reason: 'payment_issues', count: 36, percentage: 8.5 },
    ],
    interventionEffectiveness: [
      { type: 'Discount Offer', shown: 156, converted: 89, rate: 57.1 },
      { type: 'Trust Signals', shown: 72, converted: 38, rate: 52.8 },
      { type: 'Delivery Clarity', shown: 98, converted: 41, rate: 41.8 },
      { type: 'Soft Nudge', shown: 61, converted: 19, rate: 31.1 },
    ],
    hourlyData: [
      { hour: '9am', abandoned: 18, recovered: 8 },
      { hour: '10am', abandoned: 24, recovered: 11 },
      { hour: '11am', abandoned: 31, recovered: 15 },
      { hour: '12pm', abandoned: 42, recovered: 20 },
      { hour: '1pm', abandoned: 38, recovered: 18 },
      { hour: '2pm', abandoned: 29, recovered: 13 },
      { hour: '3pm', abandoned: 35, recovered: 16 },
      { hour: '4pm', abandoned: 44, recovered: 22 },
      { hour: '5pm', abandoned: 52, recovered: 25 },
      { hour: '6pm', abandoned: 61, recovered: 28 },
      { hour: '7pm', abandoned: 49, recovered: 11 },
    ],
  }
}
