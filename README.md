# Predictify

<div align="center">

### *Wall Street trades on truth. Now Main Street can too.*

**AI-Powered Commerce Intelligence for Shopify Merchants**

[Live Demo](https://drive.google.com/file/d/1hGdsbbaiP60EIEgl2G1u3MKAfc0Cyas9/view?usp=sharing) · [Devpost](https://devpost.com/software/oracle-news-project) · [Landing Page](#)

---

</div>

---

## 🚨 The Problem

**Trump won. Polymarket knew 3 weeks before the polls closed.**

Prediction markets have proven to be one of humanity's most accurate forecasting tool—outperforming polls, pundits, and professional analysts. Wall Street has used these signals for years to gain an edge, but small business merchants are still trading on hope.

* **$2.1B** lost by SMB merchants from the Red Sea shipping crisis they didn't see coming.
* **47 days** of warning that prediction markets provided—ignored by those without access.
* **$340M** in inventory losses from tariff changes that were predictable.

> **The information asymmetry between Wall Street and Main Street has never been greater.**

---

## 💡 The Solution

<div align="center">

### Predictify
*Transform prediction market intelligence into actionable commerce decisions*

</div>

Predictify bridges the gap between prediction market data and small business commerce. We take signals from Polymarket, analyze them with multi-agent AI, and deliver actionable recommendations directly in the Shopify Admin.

### How It Works
```text
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   POLYMARKET    │      │    AI AGENTS    │      │     SHOPIFY     │      │     SOLANA      │
│  Prediction     │────▶ │   (4-Agent      │────▶ │    Extension    │────▶ │   Pay Hedging   │
│  Market Data    │      │    Pipeline)    │      │    + Actions    │      │    Protection   │
└─────────────────┘      └─────────────────┘      └─────────────────┘      └─────────────────┘
      82% Probability       "Reroute                One-Click                Lock in margins
       Suez Risk             shipments"               Apply                    on-chain
```

---

## ✨ Features

### For Shopify Merchants

| Feature | Description |
|---------|-------------|
| **Oracle Feed** | Real-time prediction market events relevant to your business |
| **AI Recommendations** | Contextual actions: adjust pricing, reroute shipments, bundle products |
| **Voice Briefings** | Morning intelligence briefings via ElevenLabs |
| **One-Click Actions** | Apply AI suggestions directly in Shopify Admin |
| **Solana Hedging** | Lock in margin protection with on-chain hedges |
| **SimGym** | Stress-test your store against 1,000 black-swan scenarios |

### The Informed Merchant Transformation

| Before Predictify | After Predictify |
|-------------------|------------------|
| Learns about crises from headlines | Sees risks 42 days before they hit |
| Adjusts prices after margins are hit | Adjusts pricing before costs change |
| Orders inventory based on gut feeling | Orders based on real market signals |
| Scrambles when supply chains break | Reroutes shipments before disruptions |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Landing Page** | Next.js 16, React 19, Framer Motion, Three.js, Tailwind CSS |
| **Chrome Extension** | Manifest V3, Vanilla JS, Shopify Polaris Design System |
| **Backend API** | Node.js, Express, node-cache |
| **AI/ML** | Google Gemini, LangGraph (Multi-Agent Orchestration) |
| **Prediction Data** | Polymarket API |
| **Voice** | ElevenLabs Text-to-Speech |
| **Payments** | Solana Pay, USDC |

---

## 🤖 Multi-Agent Architecture

Predictify uses a 4-agent orchestration pipeline built on LangGraph:
```text
┌────────────────────────────────────────────────────────────────────────────────┐
│                           MULTI-AGENT PIPELINE (LangGraph)                     │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐        │
│  │ SIGNAL ANALYST   │───▶│ MERCHANT         │───▶│ FEASIBILITY      │        │
│  │ AGENT            │    │ STRATEGIST       │    │ AGENT            │        │
│  │ • Parse markets  │    │ AGENT            │    │ • Validate       │        │
│  │ • Extract risks  │    │ • Generate       │    │   constraints    │        │
│  │ • Score severity │    │   commerce       │    │ • Check budget   │        │
│  └──────────────────┘    │   actions        │    └──────────────────┘        │
│                          └──────────────────┘              │                 │
│                                                            ▼                 │
│                                                  ┌──────────────────┐        │
│                                                  │ CREATIVE         │        │
│                                                  │ AGENT            │        │
│                                                  │ • Generate copy  │        │
│                                                  │ • Build assets   │        │
│                                                  │ • Ready to ship  │        │
│                                                  └──────────────────┘        │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📈 Analytics Loop

We implement a self-improving product loop:
```text
     ┌─────────┐        ┌─────────┐        ┌─────────┐        ┌─────────┐
     │  TRACK  │───────▶│ ANALYZE │───────▶│   AI    │───────▶│  ADAPT  │
     │ Events  │        │ Behavior│        │ Insight │        │   UX    │
     └─────────┘        └─────────┘        └─────────┘        └─────────┘
          │                                                       │
          └───────────────────────────────────────────────────────┘
```

**Event Schema:**
- `market_risk_viewed` — Track which risks merchants explore
- `action_applied` — Log when AI suggestions are used
- `suggestion_dismissed` — Learn from rejected recommendations
- `hedge_executed` — Track financial actions taken

---

## ⚡ Solana Integration

When Predictify detects high-probability risk, merchants can hedge directly via Solana Pay:

1. **Detect Risk** → AI identifies 78% probability of shipping delays.
2. **Generate QR** → Solana Pay QR code for USDC deposit.
3. **Scan & Pay** → Use Phantom/Solflare wallet.
4. **Auto-Payout** → If risk materializes, hedge pays out via smart contract.

---

## 📂 Project Structure
```bash
shopify-predictify/
├── oracle-landing-page/      # Next.js 16 Landing Page
│   ├── app/                  # App router pages
│   ├── components/           # UI & Three.js Globe
│   └── package.json
├── shopify-extension/        # Chrome Extension (Manifest V3)
│   ├── content/              # Page injectors
│   └── manifest.json
└── predictify-backend/       # Node.js API Server
    ├── routes/               # API endpoints
    └── services/             # Gemini & Polymarket Integrations
```

---

## 🚀 Getting Started

### Landing Page
```bash
cd oracle-landing-page
npm install && npm run dev
```

### Backend API
```bash
cd predictify-backend
npm install && npm run dev
```

### Chrome Extension
1. Open `chrome://extensions/`
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `shopify-extension` directory.

---

## 🏆 Prize Track Alignment

| Prize Track | How We Qualify |
|-------------|----------------|
| **Shopify** | AI-powered merchant superpowers and one-click Admin actions |
| **Amplitude** | Behavioral event schema and AI-driven personalization |
| **Foresters** | 4-agent LangGraph pipeline with state handoffs |
| **Solana** | Solana Pay integration for USDC hedging |
| **Gemini** | Core reasoning engine for multi-agent analysis |

---

<div align="center">

**Commerce is no longer a guessing game.**  
*Reclaim your identity as an informed merchant.*

</div>
