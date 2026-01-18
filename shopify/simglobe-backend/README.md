# SimGlobe Backend API

Backend API server for SimGlobe - prediction market intelligence for Shopify merchants.

## Features

- **Polymarket Integration**: Fetch prediction market data relevant to e-commerce
- **Gemini AI Analysis**: Get AI-powered business recommendations
- **Solana Pay**: Execute hedge transactions via QR codes
- **ElevenLabs Voice**: Generate audio market briefings
- **In-memory Caching**: Fast response times with configurable TTL

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

Server runs on http://localhost:3000

## API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Prediction Markets
```
GET /api/risks
```
Returns top prediction markets relevant to e-commerce.

Query parameters:
- `limit` (number): Max results (default: 10)
- `category` (string): Filter by category

```
GET /api/risks/:marketId
```
Get specific market details.

### AI Analysis
```
POST /api/analyze
```
Analyze store and market data for recommendations.

Body:
```json
{
  "storeId": "string",
  "productIds": ["string"],
  "page": "string"
}
```

Response:
```json
{
  "riskScore": 78,
  "recommendations": [...],
  "hedgeAmount": 5000,
  "reasoning": "string"
}
```

### Hedge Transactions
```
POST /api/hedge
```
Create Solana Pay hedge transaction.

Body:
```json
{
  "marketId": "string",
  "amount": 1000,
  "walletAddress": "string"
}
```

Response:
```json
{
  "transactionId": "string",
  "qrCodeUrl": "string",
  "deepLink": "string",
  "status": "pending"
}
```

```
GET /api/hedge/:transactionId
```
Check transaction status.

### Voice Briefing
```
GET /api/voice-brief
```
Get audio market briefing.

Response:
```json
{
  "audioUrl": "string",
  "transcript": "string",
  "markets": [...],
  "generatedAt": "string"
}
```

## Mock Mode

By default, the API uses mock data for demo purposes when API keys are not configured. This allows testing without external service dependencies.

To use real APIs, add your keys to `.env`:

| Service | Get API Key |
|---------|-------------|
| Polymarket | https://docs.polymarket.com |
| Google Gemini | https://makersuite.google.com/app/apikey |
| ElevenLabs | https://elevenlabs.io/api |
| Solana RPC | Any RPC provider |

## Project Structure

```
simglobe-backend/
├── server.js              # Main entry point
├── package.json           # Dependencies
├── .env.example           # Environment template
├── routes/                # API routes
│   ├── polymarket.js     # Market data endpoints
│   ├── gemini.js         # AI analysis endpoints
│   ├── solana.js         # Hedge transaction endpoints
│   └── voice.js          # Voice briefing endpoints
├── services/              # Business logic
│   ├── polymarket-service.js
│   ├── gemini-service.js
│   ├── solana-service.js
│   ├── elevenlabs-service.js
│   └── cache-service.js
└── utils/                 # Utilities
    ├── error-handler.js
    └── validators.js
```

## Development

```bash
# Start with hot reload
npm run dev

# Start production
npm start
```

## Testing API

```bash
# Health check
curl http://localhost:3000/health

# Get risks
curl http://localhost:3000/api/risks

# Analyze store
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"storeId": "test-store", "page": "campaigns"}'

# Get voice briefing
curl http://localhost:3000/api/voice-brief
```
