/**
 * Voice Routes
 * Handles ElevenLabs voice briefing endpoints
 */

const express = require('express');
const router = express.Router();
const ElevenLabsService = require('../services/elevenlabs-service');
const PolymarketService = require('../services/polymarket-service');
const cache = require('../services/cache-service');

const elevenlabs = new ElevenLabsService();
const polymarket = new PolymarketService();

/**
 * GET /api/voice-brief
 * Generate morning market briefing
 */
router.get('/', async (req, res, next) => {
  try {
    const { refresh } = req.query;

    // Check cache (5 min TTL) unless refresh requested
    if (!refresh) {
      const cached = cache.get('voice-brief');
      if (cached) {
        return res.json(cached);
      }
    }

    // Get latest market data
    const markets = await polymarket.getRelevantMarkets({ limit: 3 });

    // Generate briefing script
    const script = generateBriefingScript(markets);

    // Convert to audio with ElevenLabs
    const audioUrl = await elevenlabs.textToSpeech(script);

    const response = {
      audioUrl,
      transcript: script,
      markets: markets.map(m => ({
        id: m.id,
        title: m.question,
        probability: m.outcomePrices[0],
        impact: calculateImpact(m)
      })),
      generatedAt: new Date().toISOString()
    };

    // Cache for 5 minutes
    cache.set('voice-brief', response, 300);

    res.json(response);

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/voice-brief/custom
 * Generate custom voice briefing from text
 */
router.post('/custom', async (req, res, next) => {
  try {
    const { text, voiceId } = req.body;

    if (!text) {
      return res.status(400).json({
        error: { message: 'text is required' }
      });
    }

    if (text.length > 5000) {
      return res.status(400).json({
        error: { message: 'text must be less than 5000 characters' }
      });
    }

    const audioUrl = await elevenlabs.textToSpeech(text, voiceId);

    res.json({
      audioUrl,
      transcript: text,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/voice-brief/transcript
 * Get just the transcript without audio
 */
router.get('/transcript', async (req, res, next) => {
  try {
    const markets = await polymarket.getRelevantMarkets({ limit: 3 });
    const script = generateBriefingScript(markets);

    res.json({
      transcript: script,
      markets: markets.map(m => ({
        id: m.id,
        title: m.question,
        probability: m.outcomePrices[0]
      })),
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    next(error);
  }
});

/**
 * Generate briefing script from market data
 * @param {Array} markets - Array of market data
 * @returns {string} Briefing script
 */
function generateBriefingScript(markets) {
  const now = new Date();
  const timeOfDay = now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening';

  const intro = `Good ${timeOfDay}. Here's your SimGlobe market briefing for ${formatDate(now)}.`;

  if (!markets || markets.length === 0) {
    return `${intro} Currently, there are no significant market events affecting your business. Continue monitoring for updates.`;
  }

  const marketSummaries = markets.map((m, i) => {
    const prob = Math.round(parseFloat(m.outcomePrices[0]) * 100);
    const impact = calculateImpact(m);
    const impactText = getImpactDescription(impact);

    return `Risk ${i + 1}: ${cleanMarketTitle(m.question)} is currently at ${prob}% probability. ${impactText}`;
  }).join(' ');

  const highRiskCount = markets.filter(m => parseFloat(m.outcomePrices[0]) >= 0.6).length;

  let outro;
  if (highRiskCount >= 2) {
    outro = 'Multiple high-probability risks detected. Consider reviewing your hedging strategy today.';
  } else if (highRiskCount === 1) {
    outro = 'One significant risk requires your attention. Visit your dashboard for detailed recommendations.';
  } else {
    outro = 'Market conditions are relatively stable. Visit your dashboard to explore hedging options.';
  }

  return `${intro} ${marketSummaries} ${outro}`;
}

/**
 * Clean market title for speech
 */
function cleanMarketTitle(title) {
  return title
    .replace(/\?$/, '')
    .replace(/Will there be /, '')
    .replace(/Will /, '')
    .replace(/in Q\d \d{4}/, 'soon');
}

/**
 * Get impact description for speech
 */
function getImpactDescription(impact) {
  switch (impact) {
    case 'high':
      return 'This could significantly affect your supply chain and inventory planning.';
    case 'medium':
      return 'Monitor this for potential business impact.';
    case 'low':
    default:
      return 'Low immediate impact expected on your operations.';
  }
}

/**
 * Calculate impact level
 */
function calculateImpact(market) {
  const prob = parseFloat(market.outcomePrices[0]);
  const vol = parseFloat(market.volume);

  if (prob >= 0.70 && vol >= 100000) return 'high';
  if (prob >= 0.40 && vol >= 50000) return 'medium';
  return 'low';
}

/**
 * Format date for speech
 */
function formatDate(date) {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

module.exports = router;
