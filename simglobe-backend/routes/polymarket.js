/**
 * Polymarket Routes
 * Handles prediction market data endpoints
 */

const express = require('express');
const router = express.Router();
const PolymarketService = require('../services/polymarket-service');

const polymarket = new PolymarketService();

/**
 * GET /api/risks
 * Returns top prediction markets relevant to e-commerce
 */
router.get('/', async (req, res, next) => {
  try {
    const { category, limit = 10 } = req.query;

    const markets = await polymarket.getRelevantMarkets({
      category,
      limit: parseInt(limit, 10)
    });

    // Transform to frontend format
    const transformedMarkets = markets.map(m => ({
      id: m.id,
      title: m.question,
      probability: m.outcomePrices[0],
      category: m.category,
      volume: m.volume,
      endDate: m.endDate,
      impact: calculateImpact(m)
    }));

    res.json({
      markets: transformedMarkets,
      count: transformedMarkets.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/risks/:marketId
 * Get specific market details
 */
router.get('/:marketId', async (req, res, next) => {
  try {
    const { marketId } = req.params;

    const market = await polymarket.getMarketById(marketId);

    if (!market) {
      return res.status(404).json({
        error: {
          message: 'Market not found',
          marketId
        }
      });
    }

    res.json({
      id: market.id,
      title: market.question,
      probability: market.outcomePrices[0],
      category: market.category,
      volume: market.volume,
      endDate: market.endDate,
      impact: calculateImpact(market),
      outcomes: market.outcomes,
      description: market.description
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/risks/search
 * Search markets by keyword
 */
router.get('/search/:query', async (req, res, next) => {
  try {
    const { query } = req.params;
    const { limit = 5 } = req.query;

    const markets = await polymarket.searchMarkets(query, parseInt(limit, 10));

    res.json({
      markets,
      query,
      count: markets.length
    });

  } catch (error) {
    next(error);
  }
});

/**
 * Calculate business impact based on market data
 * @param {Object} market - Market data
 * @returns {string} Impact level: 'high', 'medium', or 'low'
 */
function calculateImpact(market) {
  const prob = parseFloat(market.outcomePrices[0]);
  const vol = parseFloat(market.volume);

  // High impact: high probability AND high volume
  if (prob >= 0.70 && vol >= 100000) return 'high';
  if (prob >= 0.60 && vol >= 200000) return 'high';

  // Medium impact
  if (prob >= 0.40 && vol >= 50000) return 'medium';
  if (prob >= 0.50 && vol >= 30000) return 'medium';

  // Low impact
  return 'low';
}

module.exports = router;
