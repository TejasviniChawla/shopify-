/**
 * SimGlobe API Server
 * Main entry point for the backend API
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const polymarketRouter = require('./routes/polymarket');
const geminiRouter = require('./routes/gemini');
const solanaRouter = require('./routes/solana');
const voiceRouter = require('./routes/voice');

// Import middleware
const errorHandler = require('./utils/error-handler');

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      /^chrome-extension:\/\/.*/,
      /^http:\/\/localhost(:\d+)?$/,
      /^https:\/\/admin\.shopify\.com$/
    ];

    const isAllowed = allowedOrigins.some(pattern => {
      if (pattern instanceof RegExp) {
        return pattern.test(origin);
      }
      return pattern === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'simglobe-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/risks', polymarketRouter);
app.use('/api/analyze', geminiRouter);
app.use('/api/hedge', solanaRouter);
app.use('/api/voice-brief', voiceRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Endpoint not found',
      path: req.path,
      method: req.method
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔═══════════════════════════════════════╗');
  console.log('  ║                                       ║');
  console.log('  ║   🌐 SimGlobe API Server              ║');
  console.log('  ║                                       ║');
  console.log(`  ║   Running on: http://localhost:${PORT}    ║`);
  console.log(`  ║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(18)}║`);
  console.log('  ║                                       ║');
  console.log('  ╚═══════════════════════════════════════╝');
  console.log('');
  console.log('  Endpoints:');
  console.log('    GET  /health         - Health check');
  console.log('    GET  /api/risks      - Get prediction markets');
  console.log('    POST /api/analyze    - AI analysis');
  console.log('    POST /api/hedge      - Create hedge transaction');
  console.log('    GET  /api/voice-brief - Get voice briefing');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
