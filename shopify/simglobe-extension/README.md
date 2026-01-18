# SimGlobe Chrome Extension

A Chrome Extension that injects prediction market intelligence into Shopify Admin, allowing merchants to hedge business risks using Polymarket data, Gemini AI analysis, and Solana Pay.

## Features

- **Sidebar Navigation**: Quick access to SimGlobe dashboard from any Shopify Admin page
- **Voice Briefing**: Audio market briefing on Home dashboard
- **Campaign Alerts**: AI-powered recommendations on Marketing Campaigns page
- **Product Risk Analysis**: Check market risks for individual products
- **Hedge Execution**: Execute hedges via Solana Pay QR codes

## Installation for Development

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/simglobe.git
   cd simglobe/simglobe-extension
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable **Developer mode** (toggle in top right)

4. Click **Load unpacked**

5. Select the `simglobe-extension` directory

## Testing

1. Make sure the backend is running on `http://localhost:3000`

2. Navigate to any Shopify Admin page:
   - `admin.shopify.com/store/your-store/home`
   - `admin.shopify.com/store/your-store/marketing/campaigns`
   - `admin.shopify.com/store/your-store/products/123`

3. You should see:
   - SimGlobe tab in the sidebar navigation
   - Voice briefing widget on the Home page
   - Market alerts banner on Campaigns page
   - "Check Market Risk" button on product pages

## Configuration

The extension connects to `http://localhost:3000` by default.

To change the API endpoint, edit `utils/api-client.js`:
```javascript
const API_BASE = 'http://localhost:3000/api';
```

## Debugging

- **Popup**: Right-click extension icon → "Inspect popup"
- **Content Scripts**: Open DevTools on Shopify Admin → Console tab
- Look for messages starting with "SimGlobe:"

## Project Structure

```
simglobe-extension/
├── manifest.json          # Extension configuration
├── content/               # Content scripts (injected into pages)
│   ├── injector.js       # Main orchestrator
│   ├── sidebar-injector.js
│   ├── home-widget.js
│   ├── campaigns-widget.js
│   └── product-action.js
├── components/            # Reusable UI components
│   ├── MarketRiskCard.js
│   ├── VoiceBriefing.js
│   ├── HedgeModal.js
│   └── RiskBadge.js
├── popup/                 # Extension popup
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── styles/                # CSS styles
│   ├── polaris-theme.css
│   └── components.css
├── utils/                 # Utility functions
│   ├── api-client.js
│   └── dom-helpers.js
└── assets/                # Icons and images
    ├── icon-16.png
    ├── icon-48.png
    └── icon-128.png
```

## Permissions

The extension requires:
- `activeTab`: Access to current tab
- `storage`: Store settings and cache
- `scripting`: Inject content scripts
- Host permissions for `admin.shopify.com` and `localhost`
