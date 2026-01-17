/**
 * Gemini AI Routes
 * Handles AI analysis endpoints
 */

const express = require('express');
const router = express.Router();
const GeminiService = require('../services/gemini-service');
const PolymarketService = require('../services/polymarket-service');

const gemini = new GeminiService();
const polymarket = new PolymarketService();

/**
 * POST /api/analyze
 * Analyze store + market data and return AI recommendations
 */
router.post('/', async (req, res, next) => {
  try {
    const { storeId, productIds, page } = req.body;

    // Validate input
    if (!storeId) {
      return res.status(400).json({
        error: {
          message: 'storeId is required'
        }
      });
    }

    // Get current market data
    const marketsData = await polymarket.getRelevantMarkets({ limit: 5 });

    // Analyze with Gemini AI
    const analysis = await gemini.analyze({
      storeId,
      productIds: productIds || [],
      markets: marketsData,
      page: page || 'general'
    });

    res.json({
      storeId,
      page,
      riskScore: analysis.riskScore,
      recommendations: analysis.recommendations,
      affectedProducts: analysis.affectedProducts,
      hedgeAmount: analysis.suggestedHedge,
      reasoning: analysis.reasoning,
      analyzedAt: new Date().toISOString()
    });

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/analyze/product
 * Analyze specific product risks
 */
router.post('/product', async (req, res, next) => {
  try {
    const { productId, productName, productCategory, storeId } = req.body;

    if (!productId) {
      return res.status(400).json({
        error: {
          message: 'productId is required'
        }
      });
    }

    // Get market data
    const marketsData = await polymarket.getRelevantMarkets({ limit: 5 });

    // Analyze product-specific risks
    const analysis = await gemini.analyzeProduct({
      productId,
      productName,
      productCategory,
      storeId,
      markets: marketsData
    });

    res.json({
      productId,
      riskScore: analysis.riskScore,
      supplyChainRisks: analysis.supplyChainRisks,
      pricingRecommendation: analysis.pricingRecommendation,
      hedgeAmount: analysis.suggestedHedge,
      reasoning: analysis.reasoning
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/analyze/summary
 * Get a quick summary of current market conditions
 */
router.get('/summary', async (req, res, next) => {
  try {
    const marketsData = await polymarket.getRelevantMarkets({ limit: 3 });

    const summary = await gemini.generateSummary(marketsData);

    res.json({
      summary: summary.text,
      keyRisks: summary.keyRisks,
      overallRiskLevel: summary.overallRiskLevel,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
