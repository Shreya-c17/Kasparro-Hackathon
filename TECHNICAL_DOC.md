# Technical Document — AI Checkout Recovery Agent

**Kasparro Agentic Commerce Hackathon | Track 2 | April 2026**

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     BROWSER (Client)                    │
│                                                         │
│  ┌─────────────┐   ┌──────────────┐   ┌─────────────┐  │
│  │  Demo Store  │→  │  Checkout    │→  │  Recovery   │  │
│  │  (Next.js)  │   │  Page        │   │  Modal      │  │
│  └─────────────┘   └──────┬───────┘   └─────────────┘  │
│                           │                             │
│                    ┌──────▼───────┐                     │
│                    │  Behavior    │                     │
│                    │  Tracker     │                     │
│                    │  (Client)    │                     │
│                    └──────┬───────┘                     │
└───────────────────────────┼─────────────────────────────┘
                            │ POST /api/classify
                            ▼
┌─────────────────────────────────────────────────────────┐
│                     SERVER (Next.js API)                │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │           /api/classify (route.ts)              │   │
│  │                                                 │   │
│  │  1. Receive UserSession object                  │   │
│  │  2. Try Claude API (if key available)           │   │
│  │  3. Fallback: Rule-based classifier             │   │
│  │  4. Attach InterventionStrategy                 │   │
│  │  5. Return IntentClassification                 │   │
│  └──────────────────┬──────────────────────────────┘   │
│                     │                                   │
│              ┌──────▼──────┐                            │
│              │  Claude API │  (optional, graceful       │
│              │  (Haiku)    │   fallback if unavailable) │
│              └─────────────┘                            │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 14 (App Router) | SSR + API routes in one; fast development |
| Styling | Tailwind CSS | Rapid UI, consistent design system |
| Charts | Recharts | Lightweight, works with React |
| AI Classification | Claude Haiku + rule-based fallback | Fast, cheap, works offline |
| State Management | React useState/useEffect | Simple enough; no Redux needed |
| Type Safety | TypeScript | Catches bugs, documents contracts |

---

## Components & Data Flow

### BehaviorTracker (`src/lib/tracker.ts`)
Singleton class that:
- Collects `BehaviorEvent` objects with timestamps
- Maintains aggregated counters (couponAttempts, priceHovers, etc.)
- Computes a `riskScore` (0–100) from weighted signal combination
- Supports pub/sub for real-time UI updates

**Risk Score Formula:**
```
score = 0
if couponAttempts > 0:    score += 25
if priceHovers > 2:       score += 20
if backButtonPresses > 0: score += 20
if inactivityPeriods > 1: score += 15
if shippingChecks > 1:    score += 10
if timeOnCheckout > 120s: score += 10
score = min(score, 100)
```

### Intent Classification (`/api/classify`)
**AI/Deterministic Boundary:**
- Deterministic: signal collection, risk scoring, trigger thresholds
- AI (Claude): natural language reasoning about signal combination
- Fallback: pure rule-based scoring when API unavailable

The rule-based fallback is not a degraded experience — it performs identically for the signals we track. Claude adds nuance for edge cases (e.g., "user hovered price AND tried coupon AND checked shipping" → higher price_sensitive confidence).

### Trigger Logic (in `checkout/page.tsx`)
Two triggers for classification:
1. **Exit intent**: `mouseleave` event when `clientY <= 10`
2. **Inactivity**: 15s timer reset on any user interaction

Only one modal shown per session (`hasShownModal` ref prevents re-triggering).

---

## Failure Handling

| Failure Scenario | How System Handles It |
|-----------------|----------------------|
| Claude API down | Falls back to rule-based classifier. User sees identical experience. |
| Claude returns malformed JSON | Try/catch around JSON.parse; falls through to rule-based |
| Claude API rate limited | Caught in try/catch, falls through to rule-based |
| Network timeout on classify | Rule-based always available synchronously |
| Empty cart at checkout | Classifier handles gracefully (zero cart value = lower urgency) |
| User dismisses modal | `hasShownModal` flag prevents re-triggering; session continues normally |
| Shopify API unavailable | Using synthetic data; no external dependency |

---

## Key Implementation Decisions

### Why rule-based fallback AND Claude API?
The rule-based classifier runs in milliseconds with zero external calls. The intervention window is 2-3 seconds at exit intent. If the Claude API adds latency, the user may already be gone. The hybrid approach ensures the intervention is always fast.

### Why client-side tracking, not server-side?
Server-side would require websockets or polling. Client-side is instant and sufficient for the signals we need. The session is sent to the server only when classification is triggered (one API call).

### Why Haiku and not Sonnet?
For classification with structured output, Haiku is fast enough and significantly cheaper. The structured prompt constrains the output to a JSON object — no need for Sonnet's reasoning depth.

### Why no database?
For a hackathon demo, in-memory state is sufficient. The architecture is designed so that adding a database (e.g., Postgres, Supabase) is a single layer — the tracker already prepares a `UserSession` object that maps cleanly to a DB schema.

---

## Known Limitations

1. **Session state is in-memory** — refreshing the page resets tracking. In production: persist to localStorage or server.
2. **Mock dashboard metrics** — the dashboard shows synthetic data, not live tracked sessions. In production: connect to real session DB.
3. **No real Shopify integration** — uses synthetic product catalog per hackathon rules.
4. **Single intervention per session** — the system shows one modal. In production: could have a multi-step recovery sequence.

---

## What I Would Improve with More Time

1. **Real Shopify Storefront API** — connect to actual merchant catalog
2. **Session persistence** — store sessions in Supabase for real dashboard data
3. **A/B testing** — compare intervention strategies statistically
4. **Multi-turn recovery** — if modal dismissed, try a softer nudge 30s later
5. **Email/SMS fallback** — if real-time intervention fails, trigger post-abandonment sequence
