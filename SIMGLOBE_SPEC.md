# SimGlobe - Shopify Prediction Market Oracle (Hackathon POC)

## 🎯 Project Goal
Build a Chrome Extension that injects prediction market intelligence into Shopify Admin, 
allowing merchants to hedge business risks using Polymarket data + Gemini AI + Solana Pay.

Demo Flow: Install extension → Open any Shopify Admin → See SimGlobe in sidebar, 
voice briefing on home, AI recommendations on campaigns page.

---

## 📁 Project Structure

CREATE TWO SEPARATE DIRECTORIES:

### Directory 1: /simglobe-extension
````
/simglobe-extension
  manifest.json
  /content
    injector.js
    sidebar-injector.js
    home-widget.js
    campaigns-widget.js
    product-action.js
  /popup
    popup.html
    popup.js
    popup.css
  /styles
    polaris-theme.css
    components.css
  /components
    MarketRiskCard.js
    VoiceBriefing.js
    HedgeModal.js
    RiskBadge.js
  /utils
    api-client.js
    dom-helpers.js
  /assets
    icon-16.png
    icon-48.png
    icon-128.png
  README.md
````

### Directory 2: /simglobe-backend
````
/simglobe-backend
  server.js
  package.json
  .env.example
  /routes
    polymarket.js
    gemini.js
    solana.js
    voice.js
  /services
    polymarket-service.js
    gemini-service.js
    solana-service.js
    elevenlabs-service.js
    cache-service.js
  /utils
    error-handler.js
    validators.js
  README.md
````

---

## 🔧 PHASE 1: Chrome Extension Foundation

### File: manifest.json
````json
{
  "manifest_version": 3,
  "name": "SimGlobe - Shopify Market Oracle",
  "version": "1.0.0",
  "description": "Hedge your e-commerce business with prediction markets",
  "permissions": ["activeTab", "storage", "scripting"],
  "host_permissions": [
    "*://admin.shopify.com/*",
    "http://localhost:3000/*",
    "https://api.simglobe.io/*"
  ],
  "content_scripts": [
    {
      "matches": ["*://admin.shopify.com/*"],
      "js": ["content/injector.js"],
      "css": ["styles/polaris-theme.css", "styles/components.css"],
      "run_at": "document_end"
    }
  ],
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "assets/icon-16.png",
      "48": "assets/icon-48.png",
      "128": "assets/icon-128.png"
    }
  },
  "web_accessible_resources": [
    {
      "resources": ["components/*", "assets/*"],
      "matches": ["*://admin.shopify.com/*"]
    }
  ]
}
````

### File: content/injector.js
Main orchestrator that detects page and delegates to specific injectors.

REQUIREMENTS:
- Detect current Shopify Admin page using URL patterns
- Wait for DOM to be ready (use MutationObserver if needed)
- Import and execute appropriate injector based on page:
  * /home → home-widget.js
  * /marketing/campaigns → campaigns-widget.js
  * /products/* → product-action.js
  * ALL pages → sidebar-injector.js
- Console log: "SimGlobe activated on: [page-type]"
- Error handling with try-catch
- Respect if extension is disabled via storage

CODE STRUCTURE:
````javascript
// Page detection
const detectPage = () => {
  const path = window.location.pathname;
  if (path.includes('/home')) return 'home';
  if (path.includes('/marketing/campaigns')) return 'campaigns';
  if (path.includes('/products/')) return 'product';
  return 'other';
};

// Wait for DOM
const waitForElement = (selector, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    // Implementation with MutationObserver
  });
};

// Main init
const init = async () => {
  const pageType = detectPage();
  console.log(`SimGlobe activated on: ${pageType}`);
  
  // Always inject sidebar
  await injectSidebar();
  
  // Page-specific injections
  switch(pageType) {
    case 'home':
      await injectHomeWidget();
      break;
    case 'campaigns':
      await injectCampaignsWidget();
      break;
    case 'product':
      await injectProductAction();
      break;
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
````

### File: content/sidebar-injector.js
Injects SimGlobe tab into Shopify Admin sidebar.

TARGET: Find the sidebar navigation (usually <nav> with specific classes)
POSITION: Between "Markets" and "Finance" menu items
ICON: 🌐 emoji or SVG globe icon
BEHAVIOR: On click, navigate to /apps/simglobe (or show modal for POC)

IMPLEMENTATION:
- Use querySelector to find sidebar nav
- Create <li> matching Shopify's structure exactly
- Clone styling from existing menu items
- Add event listener for click
- Insert using insertBefore() between Markets and Finance

CODE HINTS:
- Shopify uses Polaris components, look for data-polaris attributes
- Sidebar items usually have structure: <li><a><span>Icon</span><span>Text</span></a></li>
- May need to inject custom CSS for hover states

### File: content/home-widget.js
Injects voice briefing widget on Home dashboard.

TARGET PAGE: admin.shopify.com/store/*/home
POSITION: After the first dashboard card/section
DESIGN: Polaris Card component with dark mode support

WIDGET CONTENT:
````html
<div class="simglobe-home-widget">
  <div class="Polaris-Card">
    <div class="Polaris-Card__Header">
      <h2>🎙️ SimGlobe Market Brief</h2>
      <button class="refresh-btn">Refresh</button>
    </div>
    <div class="Polaris-Card__Section">
      <!-- Audio Player -->
      <audio controls src="[from API]"></audio>
      
      <!-- Top 3 Risks -->
      <div class="risk-list">
        <div class="risk-item high">
          <span class="risk-badge">78%</span>
          <span class="risk-title">Port Strike Risk</span>
          <span class="risk-impact">High Impact</span>
        </div>
        <!-- Repeat for 3 risks -->
      </div>
      
      <!-- CTA -->
      <a href="#" class="view-dashboard">View Full Dashboard →</a>
    </div>
  </div>
</div>
````

API INTEGRATION:
- Call GET http://localhost:3000/api/voice-brief
- Response: { audioUrl: string, risks: [...] }
- Cache for 5 minutes using chrome.storage.local
- Loading state while fetching

### File: content/campaigns-widget.js
Injects AI recommendations on Campaigns page.

TARGET PAGE: admin.shopify.com/store/*/marketing/campaigns
POSITION: Top of page, after breadcrumbs but before campaign list
DESIGN: Alert/Banner style component

WIDGET CONTENT:
````html
<div class="simglobe-campaigns-banner">
  <div class="Polaris-Banner Polaris-Banner--statusWarning">
    <div class="banner-content">
      <div class="banner-icon">⚠️</div>
      <div class="banner-text">
        <h3>Market Alert: Port Strike Detected</h3>
        <p>Polymarket shows 78% probability. Gemini recommends:</p>
        <ul class="recommendations">
          <li>Increase "Summer Collection" prices by 12%</li>
          <li>Delay "Back to School" campaign by 2 weeks</li>
          <li>Hedge $5,000 on Solana prediction markets</li>
        </ul>
      </div>
      <div class="banner-actions">
        <button class="apply-recommendations">Apply All</button>
        <button class="hedge-now">Hedge on Solana</button>
      </div>
    </div>
  </div>
</div>
````

API INTEGRATION:
- Call POST http://localhost:3000/api/analyze with { storeId, page: 'campaigns' }
- Response: { riskScore, recommendations: [...], hedgeAmount }
- Real-time updates via polling every 30 seconds

### File: content/product-action.js
Adds "Check Market Risk" action to product pages.

TARGET PAGE: admin.shopify.com/store/*/products/*
POSITION: Add button to product page header actions
BEHAVIOR: Click opens modal showing market risks for this product

BUTTON:
````html
<button class="simglobe-product-action Polaris-Button Polaris-Button--secondary">
  <span>🌐 Check Market Risk</span>
</button>
````

MODAL ON CLICK:
````html
<div class="simglobe-modal">
  <div class="modal-content">
    <h2>Market Risks for [Product Name]</h2>
    
    <div class="risk-breakdown">
      <div class="risk-item">
        <span class="risk-name">Port Strike (LA/Long Beach)</span>
        <span class="risk-prob">78%</span>
        <span class="risk-impact">+3 week delay</span>
      </div>
      <!-- More risks -->
    </div>
    
    <div class="hedge-recommendation">
      <p>Recommended hedge: $234 USDC</p>
      <button class="hedge-btn">Execute Hedge</button>
    </div>
  </div>
</div>
````

### File: styles/polaris-theme.css
Match Shopify's Winter '26 design system.

REQUIREMENTS:
- Import Inter font from Google Fonts
- Define CSS variables for Polaris colors (dark mode)
- Component base styles
````css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  /* Polaris Colors - Dark Mode */
  --p-surface: #1a1a1a;
  --p-surface-hovered: #2e2e2e;
  --p-surface-pressed: #404040;
  --p-surface-subdued: #0f0f0f;
  --p-border: #333333;
  --p-text: #e3e3e3;
  --p-text-subdued: #b5b5b5;
  --p-action-primary: #008060;
  --p-action-primary-hovered: #006e52;
  --p-interactive: #2c6ecb;
  --p-warning: #ff8f00;
  --p-critical: #d82c0d;
  
  /* Spacing */
  --p-space-1: 4px;
  --p-space-2: 8px;
  --p-space-3: 12px;
  --p-space-4: 16px;
  --p-space-5: 20px;
  
  /* Border Radius */
  --p-border-radius-base: 8px;
  
  /* Shadows */
  --p-shadow-card: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.simglobe-home-widget,
.simglobe-campaigns-banner,
.simglobe-modal {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--p-text);
}

/* Add more component styles */
````

### File: components/MarketRiskCard.js
Reusable component for displaying market risk.

EXPORT:
````javascript
export function createMarketRiskCard(risk) {
  // risk = { title, probability, impact, category }
  const card = document.createElement('div');
  card.className = 'market-risk-card';
  card.innerHTML = `
    <div class="risk-header">
      <span class="risk-badge ${getProbabilityClass(risk.probability)}">
        ${risk.probability}%
      </span>
      <span class="risk-title">${risk.title}</span>
    </div>
    <div class="risk-details">
      <span class="risk-impact">${risk.impact}</span>
      <span class="risk-category">${risk.category}</span>
    </div>
  `;
  return card;
}

function getProbabilityClass(prob) {
  if (prob >= 70) return 'high';
  if (prob >= 40) return 'medium';
  return 'low';
}
````

### File: components/VoiceBriefing.js
Audio player component for ElevenLabs briefing.
````javascript
export function createVoiceBriefing(audioUrl, transcript) {
  const container = document.createElement('div');
  container.className = 'voice-briefing';
  container.innerHTML = `
    <audio controls src="${audioUrl}">
      Your browser does not support audio.
    </audio>
    <details class="transcript">
      <summary>View Transcript</summary>
      <p>${transcript}</p>
    </details>
  `;
  return container;
}
````

### File: components/HedgeModal.js
Modal for Solana Pay hedge execution.
````javascript
export function createHedgeModal(hedgeData) {
  // hedgeData = { amount, market, probability, qrCode }
  const modal = document.createElement('div');
  modal.className = 'simglobe-modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Hedge on Solana</h2>
        <button class="close-btn">×</button>
      </div>
      <div class="modal-body">
        <div class="hedge-details">
          <p>Market: ${hedgeData.market}</p>
          <p>Amount: ${hedgeData.amount} USDC</p>
          <p>Current Odds: ${hedgeData.probability}%</p>
        </div>
        <div class="qr-code">
          <img src="${hedgeData.qrCode}" alt="Solana Pay QR">
          <p>Scan with Phantom wallet</p>
        </div>
        <button class="confirm-hedge">Confirm Hedge</button>
      </div>
    </div>
  `;
  
  // Event listeners
  modal.querySelector('.close-btn').onclick = () => modal.remove();
  modal.querySelector('.confirm-hedge').onclick = () => {
    // Call API to execute hedge
    executeHedge(hedgeData);
  };
  
  return modal;
}

async function executeHedge(hedgeData) {
  const response = await fetch('http://localhost:3000/api/hedge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hedgeData)
  });
  // Handle response
}
````

### File: utils/api-client.js
Centralized API communication.
````javascript
const API_BASE = 'http://localhost:3000/api';

export const api = {
  async getRisks() {
    const cached = await getCache('risks');
    if (cached) return cached;
    
    const response = await fetch(`${API_BASE}/risks`);
    const data = await response.json();
    
    await setCache('risks', data, 300); // 5 min cache
    return data;
  },
  
  async getVoiceBrief() {
    const response = await fetch(`${API_BASE}/voice-brief`);
    return response.json();
  },
  
  async analyzeStore(storeId) {
    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeId })
    });
    return response.json();
  },
  
  async executeHedge(hedgeData) {
    const response = await fetch(`${API_BASE}/hedge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hedgeData)
    });
    return response.json();
  }
};

// Cache helpers using chrome.storage.local
async function getCache(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      const item = result[key];
      if (!item) return resolve(null);
      
      const now = Date.now();
      if (now > item.expiry) {
        chrome.storage.local.remove([key]);
        return resolve(null);
      }
      
      resolve(item.value);
    });
  });
}

async function setCache(key, value, ttlSeconds) {
  const expiry = Date.now() + (ttlSeconds * 1000);
  return chrome.storage.local.set({
    [key]: { value, expiry }
  });
}
````

### File: popup/popup.html
Extension popup UI.
````html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SimGlobe</title>
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <div class="popup-container">
    <div class="header">
      <h1>🌐 SimGlobe</h1>
      <p class="tagline">The Oracle Merchant</p>
    </div>
    
    <div class="status">
      <div class="status-indicator active"></div>
      <span>Active on Shopify Admin</span>
    </div>
    
    <div class="quick-stats">
      <div class="stat">
        <span class="stat-label">Active Risks</span>
        <span class="stat-value" id="risk-count">3</span>
      </div>
      <div class="stat">
        <span class="stat-label">Avg Probability</span>
        <span class="stat-value" id="avg-prob">62%</span>
      </div>
    </div>
    
    <div class="actions">
      <button id="refresh-btn">Refresh Data</button>
      <button id="settings-btn">Settings</button>
    </div>
    
    <div class="footer">
      <a href="https://simglobe.io/docs" target="_blank">Documentation</a>
      <a href="https://github.com/yourusername/simglobe" target="_blank">GitHub</a>
    </div>
  </div>
  
  <script src="popup.js"></script>
</body>
</html>
````

### File: popup/popup.js
Popup functionality.
````javascript
document.addEventListener('DOMContentLoaded', async () => {
  // Load stats
  const stats = await chrome.storage.local.get(['riskCount', 'avgProb']);
  document.getElementById('risk-count').textContent = stats.riskCount || '0';
  document.getElementById('avg-prob').textContent = `${stats.avgProb || 0}%`;
  
  // Refresh button
  document.getElementById('refresh-btn').onclick = async () => {
    // Clear cache
    await chrome.storage.local.clear();
    // Reload active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.reload(tab.id);
  };
  
  // Settings button
  document.getElementById('settings-btn').onclick = () => {
    chrome.runtime.openOptionsPage();
  };
});
````

---

## 🔧 PHASE 2: Backend API

### File: package.json
````json
{
  "name": "simglobe-backend",
  "version": "1.0.0",
  "description": "SimGlobe API server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "axios": "^1.6.0",
    "@solana/web3.js": "^1.87.0",
    "@solana/pay": "^0.2.5",
    "node-cache": "^5.1.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
````

### File: .env.example
````
PORT=3000
NODE_ENV=development

# API Keys
POLYMARKET_API_KEY=your_key_here
GEMINI_API_KEY=your_gemini_key_here
ELEVENLABS_API_KEY=your_elevenlabs_key_here

# Solana
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_PRIVATE_KEY=your_private_key_here

# CORS
CORS_ORIGIN=chrome-extension://
````

### File: server.js
Main Express server.
````javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const polymarketRouter = require('./routes/polymarket');
const geminiRouter = require('./routes/gemini');
const solanaRouter = require('./routes/solana');
const voiceRouter = require('./routes/voice');
const errorHandler = require('./utils/error-handler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'chrome-extension://*',
    'http://localhost:*',
    'https://admin.shopify.com'
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/risks', polymarketRouter);
app.use('/api/analyze', geminiRouter);
app.use('/api/hedge', solanaRouter);
app.use('/api/voice-brief', voiceRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`SimGlobe API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
````

### File: routes/polymarket.js
Polymarket API integration.
````javascript
const express = require('express');
const router = express.Router();
const PolymarketService = require('../services/polymarket-service');

const polymarket = new PolymarketService();

// GET /api/risks
// Returns top prediction markets relevant to e-commerce
router.get('/', async (req, res, next) => {
  try {
    const markets = await polymarket.getRelevantMarkets();
    
    res.json({
      markets: markets.map(m => ({
        id: m.id,
        title: m.question,
        probability: m.outcomePrices[0], // "Yes" probability
        category: m.category,
        volume: m.volume,
        endDate: m.endDate,
        impact: calculateImpact(m) // Custom logic
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/risks/:marketId
// Get specific market details
router.get('/:marketId', async (req, res, next) => {
  try {
    const market = await polymarket.getMarketById(req.params.marketId);
    res.json(market);
  } catch (error) {
    next(error);
  }
});

function calculateImpact(market) {
  // Simple heuristic: high volume + high probability = high impact
  const prob = parseFloat(market.outcomePrices[0]);
  const vol = parseFloat(market.volume);
  
  if (prob > 70 && vol > 100000) return 'high';
  if (prob > 40 && vol > 50000) return 'medium';
  return 'low';
}

module.exports = router;
````

### File: routes/gemini.js
Gemini AI analysis endpoint.
````javascript
const express = require('express');
const router = express.Router();
const GeminiService = require('../services/gemini-service');

const gemini = new GeminiService();

// POST /api/analyze
// Analyze store + market data and return recommendations
router.post('/', async (req, res, next) => {
  try {
    const { storeId, productIds, page } = req.body;
    
    // Get market data
    const markets = await getActiveMarkets();
    
    // Analyze with Gemini
    const analysis = await gemini.analyze({
      storeId,
      productIds,
      markets,
      page
    });
    
    res.json({
      riskScore: analysis.riskScore,
      recommendations: analysis.recommendations,
      affectedProducts: analysis.affectedProducts,
      hedgeAmount: analysis.suggestedHedge,
      reasoning: analysis.reasoning
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
````

### File: routes/solana.js
Solana Pay hedge execution.
````javascript
const express = require('express');
const router = express.Router();
const SolanaService = require('../services/solana-service');

const solana = new SolanaService();

// POST /api/hedge
// Create Solana Pay transaction for hedge
router.post('/', async (req, res, next) => {
  try {
    const { marketId, amount, walletAddress } = req.body;
    
    // Generate Solana Pay QR code
    const transaction = await solana.createHedgeTransaction({
      marketId,
      amount,
      recipient: walletAddress
    });
    
    res.json({
      transactionId: transaction.id,
      qrCode: transaction.qrCodeUrl,
      deepLink: transaction.deepLink,
      status: 'pending'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/hedge/:transactionId
// Check transaction status
router.get('/:transactionId', async (req, res, next) => {
  try {
    const status = await solana.getTransactionStatus(req.params.transactionId);
    res.json(status);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
````

### File: routes/voice.js
ElevenLabs voice briefing.
````javascript
const express = require('express');
const router = express.Router();
const ElevenLabsService = require('../services/elevenlabs-service');
const cache = require('../services/cache-service');

const elevenlabs = new ElevenLabsService();

// GET /api/voice-brief
// Generate morning market briefing
router.get('/', async (req, res, next) => {
  try {
    // Check cache (5 min TTL)
    const cached = cache.get('voice-brief');
    if (cached) return res.json(cached);
    
    // Get latest market data
    const markets = await getTopMarkets(3);
    
    // Generate script
    const script = generateBriefingScript(markets);
    
    // Convert to audio with ElevenLabs
    const audioUrl = await elevenlabs.textToSpeech(script);
    
    const response = {
      audioUrl,
      transcript: script,
      markets,
      generatedAt: new Date().toISOString()
    };
    
    cache.set('voice-brief', response, 300); // 5 min cache
    res.json(response);
  } catch (error) {
    next(error);
  }
});

function generateBriefingScript(markets) {
  const intro = "Good morning. Here's your SimGlobe market briefing.";
  
  const marketSummaries = markets.map((m, i) => {
    return `Risk ${i + 1}: ${m.title} is currently at ${m.probability}% probability. ${getImpactDescription(m)}.`;
  }).join(' ');
  
  const outro = "Visit your dashboard for detailed recommendations and hedging options.";
  
  return `${intro} ${marketSummaries} ${outro}`;
}

function getImpactDescription(market) {
  if (market.impact === 'high') {
    return 'This could significantly affect your supply chain';
  } else if (market.impact === 'medium') {
    return 'Monitor this for potential business impact';
  }
  return 'Low immediate impact expected';
}

module.exports = router;
````

### File: services/polymarket-service.js
Polymarket API wrapper.
````javascript
const axios = require('axios');

class PolymarketService {
  constructor() {
    this.apiKey = process.env.POLYMARKET_API_KEY;
    this.baseUrl = 'https://gamma-api.polymarket.com';
    
    // Categories relevant to e-commerce
    this.relevantCategories = [
      'Economics',
      'Business',
      'Politics',
      'World Events'
    ];
  }
  
  async getRelevantMarkets() {
    try {
      // For hackathon: Use mock data if API key not set
      if (!this.apiKey || this.apiKey === 'your_key_here') {
        return this.getMockMarkets();
      }
      
      const response = await axios.get(`${this.baseUrl}/markets`, {
        params: {
          active: true,
          closed: false,
          limit: 20
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      // Filter for e-commerce relevance
      return response.data.filter(m => 
        this.relevantCategories.includes(m.category)
      ).slice(0, 10);
      
    } catch (error) {
      console.error('Polymarket API error:', error.message);
      return this.getMockMarkets();
    }
  }
  
  getMockMarkets() {
    return [
      {
        id: 'mock-1',
        question: 'Will there be a port strike at LA/Long Beach in Q1 2026?',
        outcomePrices: ['0.78', '0.22'],
        category: 'Economics',
        volume: '245000',
        endDate: '2026-03-31T23:59:59Z'
      },
      {
        id: 'mock-2',
        question: 'Will US inflation exceed 4% in January 2026?',
        outcomePrices: ['0.45', '0.55'],
        category: 'Economics',
        volume: '180000',
        endDate: '2026-02-01T23:59:59Z'
      },
      {
        id: 'mock-3',
        question: 'Will there be major supply chain disruptions in Q1 2026?',
        outcomePrices: ['0.62', '0.38'],
        category: 'Business',
        volume: '120000',
        endDate: '2026-03-31T23:59:59Z'
      }
    ];
  }
  
  async getMarketById(marketId) {
    // Implementation
    if (!this.apiKey || this.apiKey === 'your_key_here') {
      return this.getMockMarkets().find(m => m.id === marketId);
    }
    
    const response = await axios.get(`${this.baseUrl}/markets/${marketId}`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` }
    });
    return response.data;
  }
}

module.exports = PolymarketService;
````

### File: services/gemini-service.js
Google Gemini AI wrapper.
````javascript
const axios = require('axios');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.model = 'gemini-pro';
  }
  
  async analyze({ storeId, productIds, markets, page }) {
    try {
      // For hackathon: Mock response if no API key
      if (!this.apiKey || this.apiKey === 'your_gemini_key_here') {
        return this.getMockAnalysis(markets);
      }
      
      const prompt = this.buildPrompt({ storeId, productIds, markets, page });
      
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/${this.model}:generateContent`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.apiKey
          }
        }
      );
      
      const text = response.data.candidates[0].content.parts[0].text;
      return JSON.parse(text);
      
    } catch (error) {
      console.error('Gemini API error:', error.message);
      return this.getMockAnalysis(markets);
    }
  }
  
  buildPrompt({ storeId, productIds, markets, page }) {
    return `You are a business analyst for an e-commerce store.
    
Context:
- Store ID: ${storeId}
- Current page: ${page}
- Product IDs: ${productIds ? productIds.join(', ') : 'N/A'}

Market Events:
${markets.map(m => `- ${m.question}: ${(parseFloat(m.outcomePrices[0]) * 100).toFixed(0)}% probability`).join('\n')}

Task: Analyze how these prediction market events could impact this store's business.

Provide your response as JSON with this structure:
{
  "riskScore": <number 0-100>,
  "recommendations": [
    {
      "action": "<what to do>",
      "reason": "<why>",
      "impact": "<estimated $ impact>"
    }
  ],
  "affectedProducts": ["<product IDs that are most at risk>"],
  "suggestedHedge": <$ amount to hedge>,
  "reasoning": "<brief explanation>"
}`;
  }
  
  getMockAnalysis(markets) {
    const highestRisk = markets.reduce((max, m) => 
      parseFloat(m.outcomePrices[0]) > parseFloat(max.outcomePrices[0]) ? m : max
    );
    
    return {
      riskScore: Math.round(parseFloat(highestRisk.outcomePrices[0]) * 100),
      recommendations: [
        {
          action: 'Increase prices on Summer Collection by 12%',
          reason: 'Port strike will delay restocks by 3 weeks',
          impact: '+$2,300 margin preservation'
        },
        {
          action: 'Delay "Back to School" campaign launch',
          reason: 'Supply chain uncertainty',
          impact: '-$500 wasted ad spend'
        },
        {
          action: 'Hedge $5,000 on Polymarket',
          reason: 'Protect against worst-case scenario',
          impact: '$5,000 insurance'
        }
      ],
      affectedProducts: ['prod_123', 'prod_456'],
      suggestedHedge: 5000,
      reasoning: `The ${highestRisk.question} poses significant risk to your supply chain.`
    };
  }
}

module.exports = GeminiService;
````

### File: services/solana-service.js
Solana Pay integration.
````javascript
const { Connection, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');
const { encodeURL, createQR } = require('@solana/pay');

class SolanaService {
  constructor() {
    this.connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
    );
  }
  
  async createHedgeTransaction({ marketId, amount, recipient }) {
    try {
      // For hackathon: Return mock transaction
      if (process.env.NODE_ENV === 'development') {
        return this.getMockTransaction(amount);
      }
      
      // Real Solana Pay implementation would go here
      const reference = new PublicKey.random();
      const label = `SimGlobe Hedge - Market ${marketId}`;
      const message = `Hedging ${amount} USDC`;
      
      const url = encodeURL({
        recipient: new PublicKey(recipient),
        amount,
        reference,
        label,
        message,
        memo: `HEDGE:${marketId}`
      });
      
      const qrCode = createQR(url);
      
      return {
        id: reference.toString(),
        qrCodeUrl: await qrCode.getRawData('png'),
        deepLink: url.toString(),
        status: 'pending'
      };
      
    } catch (error) {
      console.error('Solana transaction error:', error);
      throw error;
    }
  }
  
  getMockTransaction(amount) {
    return {
      id: `mock_tx_${Date.now()}`,
      qrCodeUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      deepLink: `solana:https://simglobe.io/hedge?amount=${amount}`,
      status: 'pending'
    };
  }
  
  async getTransactionStatus(transactionId) {
    // For hackathon: Mock success after 2 seconds
    if (process.env.NODE_ENV === 'development') {
      return {
        transactionId,
        status: 'confirmed',
        signature: `mock_sig_${transactionId}`,
        timestamp: new Date().toISOString()
      };
    }
    
    // Real implementation: Check on-chain
    // const signature = await this.connection.getSignatureStatus(transactionId);
    // return signature;
  }
}

module.exports = SolanaService;
````

### File: services/elevenlabs-service.js
ElevenLabs text-to-speech.
````javascript
const axios = require('axios');

class ElevenLabsService {
  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    this.voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Professional male voice
  }
  
  async textToSpeech(text) {
    try {
      // For hackathon: Return mock audio URL if no API key
      if (!this.apiKey || this.apiKey === 'your_elevenlabs_key_here') {
        return this.getMockAudioUrl();
      }
      
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`,
        {
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );
      
      // In production: Save to S3/CDN and return URL
      // For hackathon: Convert to base64 data URL
      const base64Audio = Buffer.from(response.data).toString('base64');
      return `data:audio/mpeg;base64,${base64Audio}`;
      
    } catch (error) {
      console.error('ElevenLabs API error:', error.message);
      return this.getMockAudioUrl();
    }
  }
  
  getMockAudioUrl() {
    // Return a silent 1-second MP3 for demo
    return 'data:audio/mpeg;base64,SUQzAwAAAAAAFlRTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADhADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAA4T/r4CYAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZDgP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
  }
}

module.exports = ElevenLabsService;
````

### File: services/cache-service.js
Simple in-memory cache.
````javascript
const NodeCache = require('node-cache');

class CacheService {
  constructor() {
    this.cache = new NodeCache({
      stdTTL: 300, // 5 minutes default
      checkperiod: 60 // Check for expired keys every 60s
    });
  }
  
  get(key) {
    return this.cache.get(key);
  }
  
  set(key, value, ttl) {
    return this.cache.set(key, value, ttl);
  }
  
  del(key) {
    return this.cache.del(key);
  }
  
  flush() {
    return this.cache.flushAll();
  }
}

module.exports = new CacheService();
````

### File: utils/error-handler.js
Express error handling middleware.
````javascript
module.exports = (err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      timestamp: new Date().toISOString()
    }
  });
};
````

---

## 🔧 PHASE 3: Integration & Testing

### File: simglobe-extension/README.md
````markdown
# SimGlobe Chrome Extension

## Installation for Development

1. Clone the repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the `simglobe-extension` directory

## Testing

1. Navigate to any Shopify Admin (e.g., `admin.shopify.com/store/test-store/home`)
2. You should see:
   - SimGlobe tab in sidebar
   - Voice briefing widget on home page
   - Market alerts on campaigns page

## Configuration

- API endpoint is set to `http://localhost:3000` by default
- Change in `utils/api-client.js` if needed

## Debugging

- Right-click extension icon → "Inspect popup" to debug popup
- Open DevTools on Shopify Admin to see content script logs
- Check Console for any injection errors
````

### File: simglobe-backend/README.md
````markdown
# SimGlobe Backend API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in API keys:
```bash
cp .env.example .env
```

3. Start the server:
```bash
npm run dev
```

Server runs on http://localhost:3000

## API Endpoints

### GET /api/risks
Returns top prediction markets relevant to e-commerce.

### POST /api/analyze
Analyzes store and returns AI recommendations.
Body: `{ storeId, productIds, page }`

### POST /api/hedge
Creates Solana Pay transaction for hedging.
Body: `{ marketId, amount, walletAddress }`

### GET /api/voice-brief
Returns ElevenLabs audio briefing + transcript.

## Mock Mode

By default, the API uses mock data for demo purposes. To use real APIs:
1. Get API keys from:
   - Polymarket: https://docs.polymarket.com
   - Google AI Studio: https://makersuite.google.com/app/apikey
   - ElevenLabs: https://elevenlabs.io/api
   - Solana: Any RPC provider

2. Add keys to `.env`
3. Restart server

## Testing
