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
   * @returns {Array} Mock markets
   */
  getMockMarkets() {
    return [
      {
        id: 'mock-port-strike',
        question: 'Will there be a port strike at LA/Long Beach in Q1 2026?',
        description: 'This market resolves to Yes if there is any work stoppage at the Port of Los Angeles or Port of Long Beach lasting more than 24 hours.',
        outcomePrices: ['0.78', '0.22'],
        outcomes: ['Yes', 'No'],
        category: 'Economics',
        volume: '245000',
        endDate: '2026-03-31T23:59:59Z'
      },
      {
        id: 'mock-inflation',
        question: 'Will US inflation exceed 4% in January 2026?',
        description: 'This market resolves to Yes if the Bureau of Labor Statistics reports CPI inflation above 4% year-over-year for January 2026.',
        outcomePrices: ['0.45', '0.55'],
        outcomes: ['Yes', 'No'],
        category: 'Economics',
        volume: '180000',
        endDate: '2026-02-15T23:59:59Z'
      },
      {
        id: 'mock-supply-chain',
        question: 'Will there be major supply chain disruptions in Q1 2026?',
        description: 'This market resolves to Yes if there are significant global supply chain disruptions affecting major shipping routes.',
        outcomePrices: ['0.62', '0.38'],
        outcomes: ['Yes', 'No'],
        category: 'Business',
        volume: '120000',
        endDate: '2026-03-31T23:59:59Z'
      },
      {
        id: 'mock-fed-rate',
        question: 'Will the Fed raise interest rates in March 2026?',
        description: 'This market resolves to Yes if the Federal Reserve increases the federal funds rate at their March 2026 meeting.',
        outcomePrices: ['0.35', '0.65'],
        outcomes: ['Yes', 'No'],
        category: 'Finance',
        volume: '350000',
        endDate: '2026-03-20T23:59:59Z'
      },
      {
        id: 'mock-tariffs',
        question: 'Will new tariffs be imposed on Chinese goods in 2026?',
        description: 'This market resolves to Yes if the US government announces new tariffs on goods imported from China during 2026.',
        outcomePrices: ['0.55', '0.45'],
        outcomes: ['Yes', 'No'],
        category: 'Politics',
        volume: '95000',
        endDate: '2026-12-31T23:59:59Z'
      },
      {
        id: 'mock-oil-price',
        question: 'Will oil prices exceed $100/barrel in Q1 2026?',
        description: 'This market resolves to Yes if WTI crude oil closes above $100 per barrel at any point in Q1 2026.',
        outcomePrices: ['0.28', '0.72'],
        outcomes: ['Yes', 'No'],
        category: 'Economics',
        volume: '210000',
        endDate: '2026-03-31T23:59:59Z'
      }
    ];
  }
}

module.exports = PolymarketService;
