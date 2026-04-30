# 🛒 AI Checkout Recovery Agent

**Kasparro Agentic Commerce Hackathon — Track 2: AI-Assisted Checkout Recovery**

> An AI agent that detects *why* users abandon checkout in real-time, classifies intent, and intervenes with personalized recovery strategies — before they leave.

---

## 💡 Problem Statement

Cart abandonment is one of the largest revenue leaks in ecommerce. Most existing solutions rely on delayed recovery methods like emails or retargeting — after the user has already left.

There is no real-time system that understands *why* a user is hesitating during checkout and proactively resolves that friction.

---

## 🚀 Solution Overview

This project introduces an **AI-powered checkout recovery system** that:

* Tracks behavioral signals in real-time
* Classifies user intent (price sensitivity, trust issues, etc.)
* Intervenes with targeted recovery strategies
* Provides merchant analytics via a dashboard

👉 Prevents drop-off *before it happens*

---

## 🎥 Demo Video

https://drive.google.com/file/d/16Xluew0UbKGyryWcE6zX0fOHqwNDdeJ4/view

---

## ⚡ Quick Start

```bash
git clone https://github.com/Shreya-c17/Kasparro-Hackathon
cd Kasparro-Hackathon
npm install
npm run dev
```

Open: http://localhost:3000

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── store/page.tsx
│   ├── checkout/page.tsx
│   ├── dashboard/page.tsx
│   └── api/
├── components/
├── lib/
└── types/
```

---

## 🧠 How the System Works

### 1. Behavior Tracking

Tracks:

* Coupon attempts
* Price hovers
* Shipping checks
* Payment hesitation
* Exit intent
* Inactivity

---

### 2. Intent Classification

| Signal             | Reason             |
| ------------------ | ------------------ |
| Coupon attempts    | Price Sensitive    |
| Shipping checks    | Shipping Confusion |
| Back navigation    | Trust Issues       |
| Inactivity         | Just Browsing      |
| Payment hesitation | Payment Issues     |

---

### 3. Recovery Strategies

| Intent             | Action            |
| ------------------ | ----------------- |
| Price Sensitive    | Discount          |
| Trust Issues       | Reviews / Policy  |
| Shipping Confusion | Delivery clarity  |
| Just Browsing      | Save cart         |
| Payment Issues     | Alternate payment |

---

## ⚙️ AI vs Deterministic Logic

* AI → interprets behavioral patterns
* Logic → handles tracking, scoring, and triggering interventions

---

## ⚠️ Failure Handling

* AI unavailable → fallback to rule-based classification
* Missing signals → use last known behavior
* No clear intent → generic recovery
* API failure → UI continues without breaking

---

## 📊 Merchant Value

* Reduces cart abandonment in real-time
* Improves conversion rates
* Provides actionable insights into user behavior

---

## 📋 Submission Checklist

* [x] Product Document
* [x] Technical Document
* [x] Decision Log
* [x] Working code in public GitHub repo
* [x] Demo video included in README
* [x] Contribution note

---

## 👥 Contribution Note

**Shreya C**

* Led product thinking, system design, and implementation
* Built core features: behavior tracking, intent classification, and recovery logic
* Developed UI, checkout flow, and merchant dashboard
* Authored Product Document, Technical Document, and Decision Log

**Sonal M Jakhar**

* Contributed to testing and validation of user flows
* Assisted in UI refinement and usability improvements
* Supported documentation review and clarity
* Helped prepare demo assets

---

## 🧩 Decision Log (Summary)

* Chose real-time intervention over post-abandonment recovery
* Used hybrid AI + rule-based approach for reliability
* Focused on behavioral signals rather than static user data
* Prioritized actionable interventions over passive recommendations

---

## 👤 Team

* Shreya C
* Sonal M Jakhar

---

*Kasparro Agentic Commerce Hackathon | April 2026*
