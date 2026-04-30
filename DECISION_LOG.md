# Decision Log

Running log of decisions made during the build.

---

## Day 1

### Chose Track 2 over Track 3

Considered Track 3 (AI Checkout Copilot), which focuses on preventing friction before it happens.

Chose Track 2 because recovery is the higher-impact and more measurable problem. Real-time intervention before the user leaves is also a stronger differentiator than a checkout assistant.

Track 3 is prevention. Track 2 is recovery. Recovery has a clearer success metric.

### Decided to classify intent, not just detect abandonment

Initial idea: detect exit intent and immediately show a discount.

Rejected that because blanket discounts train users to abandon for discounts. Also, a trust-hesitant user does not need a discount — they need reassurance.

The classifier adds complexity, but it is the core value proposition of the product.

### Chose 5 abandonment types, not more

Started with 8 types, including comparison shopping and distraction.

Reduced the list to 5 because the browser signals being tracked can reliably distinguish only a smaller set. More types would reduce confidence per classification.

Kept: `price_sensitive`, `trust_issues`, `shipping_confusion`, `just_browsing`, and `payment_issues`.

### Chose rule-based fallback over API-only

Claude API can add roughly 500ms to 2s of latency.

The exit-intent window is only 2 to 3 seconds. If the API is slow, the user may leave before the modal appears.

Decision: build the rule-based classifier first, then layer Claude on top. The rule-based system is not just a fallback — it is the foundation.

### Chose Next.js over separate frontend/backend

Considered React + Express.

Chose Next.js because API routes are co-located with the app, there is no CORS setup, deployment is simpler, and development is faster for a hackathon.

There was no meaningful downside for this project.

---

## Day 2

### Decided not to use localStorage for session persistence

Considered persisting session data across page reloads.

Rejected it because it adds complexity, and the demo flow is linear: store → checkout → intervention.

If the user refreshes checkout, the session is treated as fresh anyway.

### Chose exit intent plus inactivity as triggers, not a timer

Considered triggering intervention after a fixed number of seconds on the page.

Rejected that because a timer treats every user the same. Exit intent is more precise because it detects genuine intent to leave.

Inactivity at 15 seconds captures hesitation without being too aggressive.

### Kept debug panel visible by default

Judges need to see the AI working.

A hidden debug panel assumes the viewer already knows where to look. Keeping it visible by default makes the system easier to understand during the demo.

This is a hackathon build, so transparency helps more than it hurts.

### Chose one modal intervention, not multiple nudges

Considered a sequence such as a small toast first and then a modal after dismissal.

Rejected that because extra flows increase complexity and introduce more chances for bugs.

One well-timed modal is easier to demonstrate and creates a more trustworthy user experience.

---

## Day 3

### Chose synthetic metrics for dashboard, not live session data

Without a database, live session data during the demo would only reflect the few sessions created during judging.

That would not tell the product story clearly. Synthetic metrics with realistic values communicate the outcome better, as long as they are clearly labeled.

Decision: synthetic dashboard metrics, live session debug panel.

### Decided to expose confidence score in the UI

Could have hidden outputs like `87% confidence: price sensitive`.

Chose to show it because it builds merchant trust, shows that the AI is reasoning rather than guessing, and differentiates the product from a simple rules engine.

Judges can see the system thinking, which makes the demo stronger.