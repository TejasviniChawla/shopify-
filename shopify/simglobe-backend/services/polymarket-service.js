/**
 * Polymarket Service
 * Handles all Polymarket API interactions
 */

const axios = require('axios');

class PolymarketService {
  constructor() {
    this.apiKey = process.env.POLYMARKET_API_KEY;
    this.baseUrl = 'https://gamma-api.polymarket.com';

    // Categories relevant to e-commerce merchants
    this.relevantCategories = [
      'Economics',
      'Business',
      'Politics',
      'World Events',
      'Finance'
    ];

    // Keywords for filtering relevant markets
    this.relevantKeywords = [
      'port', 'shipping', 'supply chain', 'inflation', 'tariff',
      'trade', 'strike', 'oil', 'gas', 'recession', 'fed',
      'interest rate', 'dollar', 'china', 'manufacturing'
    ];
  }

  /**
   * Get markets relevant to e-commerce
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of market data
   */
  async getRelevantMarkets(options = {}) {
    const { category, limit = 10 } = options;

    try {
      // Check if API key is configured
      if (!this.apiKey || this.apiKey === 'your_polymarket_key_here') {
        console.log('Polymarket: Using mock data (no API key configured)');
        return this.getMockMarkets().slice(0, limit);
      }

      const response = await axios.get(`${this.baseUrl}/markets`, {
        params: {
          active: true,
          closed: false,
          limit: 50 // Fetch more to filter
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        timeout: 10000
      });

      // Filter for e-commerce relevance
      let markets = response.data.filter(m =>
        this.isRelevantMarket(m, category)
      );

      // Sort by volume (most active first)
      markets.sort((a, b) =>
        parseFloat(b.volume) - parseFloat(a.volume)
      );

      return markets.slice(0, limit);

    } catch (error) {
      console.error('Polymarket API error:', error.message);
      // Fallback to mock data on error
      return this.getMockMarkets().slice(0, limit);
    }
  }

  /**
   * Get specific market by ID
   * @param {string} marketId - Market ID
   * @returns {Promise<Object>} Market data
   */
  async getMarketById(marketId) {
    // Check mock markets first
    const mockMarket = this.getMockMarkets().find(m => m.id === marketId);

    if (!this.apiKey || this.apiKey === 'your_polymarket_key_here') {
      return mockMarket || null;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/markets/${marketId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        timeout: 10000
      });

      return response.data;

    } catch (error) {
      console.error('Polymarket API error:', error.message);
      return mockMarket || null;
    }
  }

  /**
   * Search markets by keyword
   * @param {string} query - Search query
   * @param {number} limit - Max results
   * @returns {Promise<Array>} Matching markets
   */
  async searchMarkets(query, limit = 5) {
    if (!this.apiKey || this.apiKey === 'your_polymarket_key_here') {
      const mockMarkets = this.getMockMarkets();
      return mockMarkets.filter(m =>
        m.question.toLowerCase().includes(query.toLowerCase())
      ).slice(0, limit);
    }

    try {
      const response = await axios.get(`${this.baseUrl}/markets`, {
        params: {
          search: query,
          active: true,
          limit
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        timeout: 10000
      });

      return response.data;

    } catch (error) {
      console.error('Polymarket search error:', error.message);
      return [];
    }
  }

  /**
   * Check if market is relevant to e-commerce
   * @param {Object} market - Market data
   * @param {string} category - Optional category filter
   * @returns {boolean}
   */
  isRelevantMarket(market, category) {
    // Category filter
    if (category && market.category !== category) {
      return false;
    }

    // Must be in relevant categories
    if (!this.relevantCategories.includes(market.category)) {
      return false;
    }

    // Check for relevant keywords in question
    const question = market.question.toLowerCase();
    return this.relevantKeywords.some(keyword =>
      question.includes(keyword)
    );
  }

  /**
   * Get mock market data for development/demo
   * Small business focused events with clear merchant impact
   * @returns {Array} Mock markets
   */
  getMockMarkets() {
    return [
      {
        id: 'shipping-delay-feb',
        question: 'Shipping delays over 7 days from Asia this month?',
        description: 'Major shipping delays from Asian suppliers could affect your inventory arrival times and customer delivery promises.',
        outcomePrices: ['0.72', '0.28'],
        outcomes: ['Yes', 'No'],
        category: 'Shipping',
        volume: '185000',
        endDate: '2026-01-31T23:59:59Z'
      },
      {
        id: 'usps-rate-hike',
        question: 'USPS shipping rate increase before Valentine\'s Day?',
        description: 'Postal service may raise rates before the February holiday rush, affecting your shipping costs and margins.',
        outcomePrices: ['0.65', '0.35'],
        outcomes: ['Yes', 'No'],
        category: 'Shipping',
        volume: '92000',
        endDate: '2026-02-01T23:59:59Z'
      },
      {
        id: 'consumer-spending-drop',
        question: 'Consumer spending drops 5%+ in February?',
        description: 'Post-holiday spending fatigue could reduce customer purchases. Consider promotional strategies.',
        outcomePrices: ['0.58', '0.42'],
        outcomes: ['Yes', 'No'],
        category: 'Economic',
        volume: '156000',
        endDate: '2026-02-28T23:59:59Z'
      },
      {
        id: 'china-tariff-increase',
        question: 'New 15% tariffs on Chinese imports by March?',
        description: 'Proposed tariff increases would raise your product costs if you source from China. Pre-order inventory now.',
        outcomePrices: ['0.48', '0.52'],
        outcomes: ['Yes', 'No'],
        category: 'Tariffs',
        volume: '245000',
        endDate: '2026-03-15T23:59:59Z'
      },
      {
        id: 'cotton-price-surge',
        question: 'Cotton prices rise 20%+ by Spring?',
        description: 'If you sell apparel or textiles, cotton price spikes will squeeze your margins. Lock in supplier pricing.',
        outcomePrices: ['0.41', '0.59'],
        outcomes: ['Yes', 'No'],
        category: 'Economic',
        volume: '78000',
        endDate: '2026-04-01T23:59:59Z'
      },
      {
        id: 'valentines-rush',
        question: 'Valentine\'s gift category sales surge 30%+?',
        description: 'Strong Valentine\'s demand expected. Stock up on gift-able items and prepare marketing campaigns.',
        outcomePrices: ['0.76', '0.24'],
        outcomes: ['Yes', 'No'],
        category: 'Economic',
        volume: '134000',
        endDate: '2026-02-14T23:59:59Z'
      },
      {
        id: 'payment-processor-outage',
        question: 'Major payment processor outage this month?',
        description: 'Payment disruptions could block customer checkouts. Have backup payment options ready.',
        outcomePrices: ['0.23', '0.77'],
        outcomes: ['Yes', 'No'],
        category: 'Economic',
        volume: '45000',
        endDate: '2026-01-31T23:59:59Z'
      },
      {
        id: 'fuel-cost-spike',
        question: 'Fuel prices spike 15%+ affecting delivery costs?',
        description: 'Rising fuel costs increase your shipping expenses. Consider adjusting free shipping thresholds.',
        outcomePrices: ['0.52', '0.48'],
        outcomes: ['Yes', 'No'],
        category: 'Shipping',
        volume: '167000',
        endDate: '2026-02-28T23:59:59Z'
      }
    ];
  }
}

module.exports = PolymarketService;
