# Decision Log

Running log of decisions made during the build.

---

**[Day 1] Chose Track 2 over Track 3**
Considered Track 3 (AI Checkout Copilot) which prevents friction from happening. Chose Track 2 because recovery is the higher-impact, more measurable problem — and "real-time intervention before they leave" is a stronger differentiator than a checkout assistant. Track 3 is prevention; Track 2 is recovery. Recovery has a clearer success metric.

---

**[Day 1] Decided to classify intent, not just detect abandonment**
Initial idea: detect exit intent → show discount. Rejected because: (a) blanket discounts train users to abandon for discounts, (b) a trust-hesitant user doesn't need a discount, they need reassurance. Classifier adds complexity but is the core value proposition.

---

**[Day 1] Chose 5 abandonment types, not more**
Started with 8 types including "comparison shopping" and "distraction." Reduced to 5 because: the signals we can track from browser behavior reliably distinguish only 5. More types = lower confidence per type. Kept: price_sensitive, trust_issues, shipping_confusion, just_browsing, payment_issues.

---

**[Day 1] Chose rule-based fallback over API-only**
Claude API adds ~500ms–2s of latency. Exit intent window is 2-3 seconds. If the API is slow, the user is gone before the modal appears. Decision: build rule-based classifier first, layer Claude on top. The rule-based system is not a fallback — it's the foundation.

---

**[Day 1] Chose Next.js over separate frontend/backend**
Considered React + Express. Chose Next.js because: API routes are co-located, no CORS config, one deployment, faster to build. No downside for a hackathon project.

---

**[Day 2] Decided NOT to use localStorage for session persistence**
Considered persisting session across page reloads. Rejected because: (1) adds complexity, (2) the demo flow is linear (store → checkout → intervention), not multi-session. If the user refreshes checkout, they're starting fresh anyway.

---

**[Day 2] Chose exit intent + inactivity as triggers, not timer**
Considered triggering after X seconds on page. Rejected because: a timer treats all users identically. Exit intent is more precise — it captures genuine intent to leave. Inactivity (15s) catches hesitation without being aggressive.

---

**[Day 2] Kept debug panel visible by default**
Judges need to see the AI working. A hidden debug panel requires judges to know to enable it. Made it visible by default with a toggle. This is a demo — transparency helps, not hurts.

---

**[Day 2] Chose one modal intervention, not multiple nudges**
Considered a sequence: first a small toast → then modal if dismissed. Rejected because: complexity adds bugs, and the demo needs to clearly demonstrate the intervention. One well-timed modal is more demonstrable and more trustworthy UX.

---

**[Day 3] Chose synthetic metrics for dashboard, not live session data**
Without a database, live session data from the demo would show only the sessions run during judging — not useful. Synthetic data with realistic numbers tells the story better and is clearly labeled as a demo. Decision: synthetic metrics, live session debug panel.

---

**[Day 3] Decided to expose confidence score in the UI**
Could have hidden "87% confidence: price sensitive." Chose to show it because: (1) builds merchant trust, (2) demonstrates the AI is reasoning, not guessing, (3) differentiates from a simple rules engine. Judges can see the system thinking.
