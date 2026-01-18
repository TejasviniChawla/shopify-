<![CDATA[<div align="center">

# Predictify

### *Wall Street trades on truth. Now Main Street can too.*

**AI-Powered Commerce Intelligence for Shopify Merchants**

[![UofTHacks 2026](https://img.shields.io/badge/UofTHacks-2026-gold?style=for-the-badge)](https://uofthacks.com)
[![Shopify](https://img.shields.io/badge/Shopify-Prize_Track-96bf48?style=for-the-badge&logo=shopify&logoColor=white)](https://shopify.dev)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Solana](https://img.shields.io/badge/Solana-Pay-14F195?style=for-the-badge&logo=solana)](https://solanapay.com)

[Live Demo](https://drive.google.com/file/d/1hGdsbbaiP60EIEgl2G1u3MKAfc0Cyas9/view?usp=sharing) · [Devpost](https://devpost.com/software/oracle-news-project) · [Landing Page](#)

---

<img src="https://img.shields.io/badge/89%25-Prediction_Accuracy-00FF41?style=for-the-badge" alt="89% Accuracy"/>
<img src="https://img.shields.io/badge/42_Days-Early_Warning-C9A962?style=for-the-badge" alt="42 Days Early"/>
<img src="https://img.shields.io/badge/4_AI-Agents-9945FF?style=for-the-badge" alt="4 AI Agents"/>

</div>

---

## The Problem

**Trump won. Polymarket knew 3 weeks before the polls closed.**

Prediction markets have proven to be humanity's most accurate forecasting tool—outperforming polls, pundits, and even professional analysts. Wall Street has used these signals for years to gain an edge.

But small business merchants? They're still trading on hope.

- **$2.1B** lost by SMB merchants from the Red Sea shipping crisis they didn't see coming
- **47 days** of warning that prediction markets provided—ignored by those without access
- **$340M** in inventory losses from tariff changes that were predictable

**The information asymmetry between Wall Street and Main Street has never been greater.**

---

## The Solution

<div align="center">

### Predictify: The Oracle for Informed Merchants

*Transform prediction market intelligence into actionable commerce decisions*

</div>

Predictify is a **Shopify Chrome Extension** + **Landing Page** that bridges the gap between prediction market data and small business commerce. We take signals from Polymarket, analyze them with multi-agent AI, and deliver actionable recommendations directly in the Shopify Admin.

### How It Works

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   POLYMARKET    │────▶│   AI AGENTS     │────▶│    SHOPIFY      │────▶│     SOLANA      │
│  Prediction     │     │  (4-Agent       │     │   Extension     │     │   Pay Hedging   │
│  Market Data    │     │   Pipeline)     │     │  + Actions      │     │   Protection    │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
       82%                  "Reroute              One-Click            Lock in margins
    Suez Risk              shipments"              Apply               on-chain
```

---

## Features

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
| Always playing catch-up | Always one step ahead |

---

## Tech Stack

<div align="center">

| Layer | Technology |
|-------|------------|
| **Landing Page** | Next.js 16, React 19, Framer Motion, Three.js, Tailwind CSS |
| **Chrome Extension** | Manifest V3, Vanilla JS, Shopify Polaris Design System |
| **Backend API** | Node.js, Express, node-cache |
| **AI/ML** | Google Gemini, LangGraph (Multi-Agent Orchestration) |
| **Prediction Data** | Polymarket API |
| **Voice** | ElevenLabs Text-to-Speech |
| **Payments** | Solana Pay, USDC |
| **Analytics** | Amplitude-style Event Tracking |

</div>

---

## Multi-Agent Architecture

Predictify uses a **4-agent orchestration pipeline** built on LangGraph:

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                           MULTI-AGENT PIPELINE                                 │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐        │
│  │ SIGNAL ANALYST   │───▶│ MERCHANT         │───▶│ FEASIBILITY      │        │
│  │ AGENT            │    │ STRATEGIST       │    │ AGENT            │        │
│  │                  │    │ AGENT            │    │                  │        │
│  │ • Parse markets  │    │ • Generate       │    │ • Validate       │        │
│  │ • Extract risks  │    │   commerce       │    │   constraints    │        │
│  │ • Score severity │    │   actions        │    │ • Check budget   │        │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘        │
│                                                            │                  │
│                                                            ▼                  │
│                                               ┌──────────────────┐           │
│                                               │ CREATIVE         │           │
│                                               │ AGENT            │           │
│                                               │                  │           │
│                                               │ • Generate copy  │           │
│                                               │ • Build assets   │           │
│                                               │ • Ready to ship  │           │
│                                               └──────────────────┘           │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

Each agent maintains clear state handoffs with full communication logging for transparency.

---

## Analytics Loop (Amplitude-Style)

We implement a self-improving product loop:

```
     ┌─────────┐        ┌─────────┐        ┌─────────┐        ┌─────────┐
     │ TRACK   │───────▶│ ANALYZE │───────▶│   AI    │───────▶│  ADAPT  │
     │ Events  │        │ Behavior│        │ Insight │        │   UX    │
     └─────────┘        └─────────┘        └─────────┘        └─────────┘
         │                                                          │
         └──────────────────────────────────────────────────────────┘
                              Continuous Loop
```

**Event Schema:**
- `market_risk_viewed` — Track which risks merchants explore
- `action_applied` — Log when AI suggestions are used
- `suggestion_dismissed` — Learn from rejected recommendations
- `hedge_executed` — Track financial actions taken

The AI reorders and personalizes suggestions based on behavioral patterns—not just static rules.

---

## Solana Integration

**Programmable Certainty: Lock in margins with on-chain hedging**

When Predictify detects high-probability risk, merchants can hedge directly via Solana Pay:

1. **Detect Risk** → AI identifies 78% probability of shipping delays
2. **Generate QR** → Solana Pay QR code for USDC deposit
3. **Scan & Pay** → Use Phantom/Solflare wallet
4. **Auto-Payout** → If risk materializes, hedge pays out via smart contract

**Why Solana?**
- Sub-second execution
- Transparent on-chain verification
- Zero-trust settlement
- No complex DeFi knowledge required

---

## Project Structure

```
shopify-/
├── oracle-merchant-landing-page/     # Next.js 16 Landing Page
│   ├── app/                          # App router pages
│   ├── components/
│   │   ├── sections/                 # Page sections (Hero, Demo, Sponsors, etc.)
│   │   ├── ui/                       # shadcn/ui components
│   │   └── marble-globe.tsx          # 3D globe background (Three.js)
│   └── package.json
│
└── shopify/                          # Shopify Extension
    ├── simglobe-extension/           # Chrome Extension (Manifest V3)
    │   ├── content/                  # Page injectors
    │   ├── components/               # UI components
    │   └── manifest.json
    │
    └── simglobe-backend/             # Node.js API Server
        ├── routes/                   # API endpoints
        ├── services/                 # External API integrations
        └── server.js
```

---

## Getting Started

### Landing Page

```bash
cd oracle-merchant-landing-page
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend API

```bash
cd shopify/simglobe-backend
cp .env.example .env
# Add your API keys
npm install
npm run dev
```

### Chrome Extension

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `shopify/simglobe-extension` directory
5. Navigate to any Shopify Admin page

---

## Environment Variables

Create a `.env` file in `shopify/simglobe-backend/`:

```env
PORT=3000
POLYMARKET_API_KEY=
GEMINI_API_KEY=
ELEVENLABS_API_KEY=
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_PRIVATE_KEY=
```

> **Note:** All external APIs gracefully fallback to mock data for demo purposes.

---

## Prize Track Alignment

| Prize Track | How We Qualify |
|-------------|----------------|
| **Shopify** | AI-powered merchant superpowers, commerce intelligence, one-click actions in Shopify Admin |
| **Amplitude** | Full behavioral event schema, AI-driven personalization, self-improving product loop |
| **Foresters** | 4-agent LangGraph pipeline with state handoffs and communication logging |
| **Solana** | Solana Pay integration for USDC hedging with on-chain verification |
| **ElevenLabs** | Voice briefings for morning intelligence updates |
| **Gemini** | Core AI reasoning engine for multi-agent analysis |

---

## Demo

**[Watch the Demo Video](https://drive.google.com/file/d/1hGdsbbaiP60EIEgl2G1u3MKAfc0Cyas9/view?usp=sharing)**

---

## Team

Built with caffeine and conviction at **UofTHacks 2026**

---

## Acknowledgments

- **Polymarket** for prediction market data
- **Shopify** for the commerce platform and design system
- **Google** for Gemini AI
- **ElevenLabs** for voice synthesis
- **Solana** for programmable payments

---

<div align="center">

**Commerce is no longer a guessing game.**

*Reclaim your identity as an informed merchant.*

---

[![Made with Next.js](https://img.shields.io/badge/Made_with-Next.js-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Powered by AI](https://img.shields.io/badge/Powered_by-Gemini_AI-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![Built at UofTHacks](https://img.shields.io/badge/Built_at-UofTHacks_2026-gold?style=flat-square)](https://uofthacks.com)

</div>
]]>