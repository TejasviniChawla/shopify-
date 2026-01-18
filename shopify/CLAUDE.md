# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SimGlobe is a Chrome Extension that injects prediction market intelligence into Shopify Admin, allowing merchants to hedge business risks using Polymarket data, Gemini AI analysis, and Solana Pay.

## Repository Structure

Two separate directories:
- `/simglobe-extension` - Chrome Extension (Manifest V3, vanilla JavaScript)
- `/simglobe-backend` - Node.js/Express API server

## Development Commands

### Backend (`simglobe-backend/`)
```bash
npm install          # Install dependencies
npm run dev          # Start dev server with nodemon (http://localhost:3000)
npm start            # Start production server
```

### Extension (`simglobe-extension/`)
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `simglobe-extension` directory
4. Navigate to any Shopify Admin page to test

## Architecture

### Chrome Extension Flow
- `content/injector.js` - Main orchestrator that detects Shopify Admin page type and delegates to specific injectors
- Page detection based on URL path:
  - `/home` → `home-widget.js` (voice briefing widget)
  - `/marketing/campaigns` → `campaigns-widget.js` (AI recommendations banner)
  - `/products/*` → `product-action.js` (market risk button)
  - All pages → `sidebar-injector.js` (SimGlobe nav item)
- Components in `/components/` are vanilla JS DOM builders (MarketRiskCard, VoiceBriefing, HedgeModal, RiskBadge)
- API client uses `chrome.storage.local` for caching with TTL

### Backend API Endpoints
- `GET /api/risks` - Polymarket prediction markets relevant to e-commerce
- `POST /api/analyze` - Gemini AI analysis with recommendations (body: `{ storeId, productIds, page }`)
- `POST /api/hedge` - Create Solana Pay transaction (body: `{ marketId, amount, walletAddress }`)
- `GET /api/voice-brief` - ElevenLabs audio briefing with transcript
- `GET /health` - Health check

### External Services
- **Polymarket** (`services/polymarket-service.js`) - Prediction market data from `gamma-api.polymarket.com`
- **Gemini** (`services/gemini-service.js`) - AI analysis via Google's Generative Language API
- **Solana Pay** (`services/solana-service.js`) - Crypto hedging transactions
- **ElevenLabs** (`services/elevenlabs-service.js`) - Text-to-speech for voice briefings

All services have mock data fallbacks when API keys are not configured.

## Styling

Extension uses Shopify Polaris design system with dark mode support:
- `styles/polaris-theme.css` - Polaris CSS variables and base styles
- `styles/components.css` - SimGlobe-specific component styles
- Use Inter font, match Shopify's Winter '26 design system

## Environment Variables (Backend)

Copy `.env.example` to `.env`:
```
PORT=3000
POLYMARKET_API_KEY=
GEMINI_API_KEY=
ELEVENLABS_API_KEY=
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_PRIVATE_KEY=
```

## Key Implementation Notes

- Extension targets `*://admin.shopify.com/*` host permissions
- DOM injection uses MutationObserver for dynamic Shopify Admin pages
- Backend uses `node-cache` for in-memory caching (5-minute default TTL)
- CORS configured for Chrome extension origins and localhost
- All external API calls gracefully fallback to mock data for hackathon demo
