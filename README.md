# 🛒 AI Checkout Recovery Agent

**Kasparro Agentic Commerce Hackathon — Track 2: AI-Assisted Checkout Recovery**

> An AI agent that detects *why* users abandon checkout in real-time, classifies intent, and intervenes with personalized recovery strategies — before they leave.

---

## 🚀 Live Demo

1. Visit the **Demo Store** → add items to cart
2. Go to **Checkout**
3. Trigger abandonment signals: try a coupon, hover prices, check shipping
4. Watch the **AI Debug Panel** (bottom right) show risk rising
5. Move mouse to top of screen (exit intent) → AI recovery modal appears
6. See the **Merchant Dashboard** for aggregated recovery metrics

---

## ⚡ Quick Start

```bash
# Clone and install
git clone https://github.com/YOUR_USERNAME/kasparro-checkout-recovery
cd kasparro-checkout-recovery
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Optional: Add Claude API key for AI-powered classification
```bash
# Create .env.local
echo "ANTHROPIC_API_KEY=your_key_here" > .env.local
```
Without the key, the system uses the rule-based classifier (equally effective for demo).

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── store/page.tsx        # Demo product store
│   ├── checkout/page.tsx     # Checkout with AI recovery
│   ├── dashboard/page.tsx    # Merchant analytics
│   └── api/
│       ├── classify/route.ts # Intent classification API
│       └── track/route.ts    # Behavior event tracking
├── components/
│   └── checkout/
│       ├── RecoveryModal.tsx      # Personalized intervention UI
│       └── BehaviorDebugPanel.tsx # Real-time behavior visualization
├── lib/
│   ├── tracker.ts            # Client-side behavior tracking
│   ├── products.ts           # Synthetic product catalog
│   └── metrics.ts            # Dashboard metrics
└── types/index.ts            # TypeScript types
```

---

## 🧠 How the AI Works

### 1. Behavior Tracking
The `BehaviorTracker` class monitors:
- Coupon field focus/attempts
- Price element hover events
- Back button presses
- Mouse exit intent (cursor leaves viewport top)
- Inactivity periods (15s timeout)
- Shipping section engagement
- Payment method hesitation

### 2. Intent Classification
Behavioral signals are scored and mapped to abandonment reasons:

| Signal | Abandonment Reason | Weight |
|--------|-------------------|--------|
| Coupon attempts | Price Sensitive | +40 |
| Price hovers > 2 | Price Sensitive | +30 |
| Back button pressed | Trust Issues | +35 |
| Shipping checks > 1 | Shipping Confusion | +45 |
| Inactivity > 2 periods | Just Browsing | +40 |
| Payment hesitation | Payment Issues | +50 |

### 3. Recovery Strategies

| Reason | Strategy | Example Intervention |
|--------|----------|---------------------|
| Price Sensitive | Discount Offer | "₹200 off, expires in 10s" |
| Trust Issues | Trust Signals | Show reviews, return policy, SSL |
| Shipping Confusion | Delivery Clarity | "Arrives tomorrow if ordered now" |
| Just Browsing | Soft Nudge | "We'll save your cart for 24hrs" |
| Payment Issues | Fast Checkout | "Try 0% EMI or UPI" |

---

## 📋 Submission Checklist

- [x] Product Document (`PRODUCT_DOC.md`)
- [x] Technical Document (`TECHNICAL_DOC.md`)
- [x] Decision Log (`DECISION_LOG.md`)
- [x] Working code in public GitHub repo
- [ ] Demo video (3-5 min screen recording — record separately)
- [x] Screenshots / product walkthrough (run `npm run dev`)
- [x] README with setup instructions

---

## 👤 Team

C Shreya
Sonal M Jakhar 

---

*Kasparro Agentic Commerce Hackathon | April 2026*
