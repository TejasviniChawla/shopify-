/**
 * Predictify API Client
 * Handles all communication with the backend API
 */

const API_BASE = 'http://localhost:4000/api';

const PredictifyApi = {
  /**
   * Get cached data from chrome.storage.local
   * @param {string} key - Cache key
   * @returns {Promise<any>}
   */
  async getCache(key) {
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
  },

  /**
   * Set cached data in chrome.storage.local
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttlSeconds - Time to live in seconds
   * @returns {Promise<void>}
   */
  async setCache(key, value, ttlSeconds) {
    const expiry = Date.now() + (ttlSeconds * 1000);
    return chrome.storage.local.set({
      [key]: { value, expiry }
    });
  },

  /**
   * Make API request with error handling
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<any>}
   */
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Predictify API error:', error);
      throw error;
    }
  },

  /**
   * Get market risks from Polymarket
   * @returns {Promise<Object>}
   */
  async getRisks() {
    const cacheKey = 'simglobe_risks';
    const cached = await this.getCache(cacheKey);
    if (cached) return cached;

    const data = await this.request('/risks');
    await this.setCache(cacheKey, data, 300); // 5 min cache

    // Update stats in storage
    if (data.markets) {
      const avgProb = Math.round(
        data.markets.reduce((sum, m) => sum + parseFloat(m.probability) * 100, 0) / data.markets.length
      );
      chrome.storage.local.set({
        riskCount: data.markets.length,
        avgProb: avgProb
      });
    }

    return data;
  },

  /**
   * Get voice briefing audio and transcript
   * @returns {Promise<Object>}
   */
  async getVoiceBrief() {
    const cacheKey = 'simglobe_voice_brief';
    const cached = await this.getCache(cacheKey);
    if (cached) return cached;

    const data = await this.request('/voice-brief');
    await this.setCache(cacheKey, data, 300); // 5 min cache

    return data;
  },

  /**
   * Analyze store with Gemini AI
   * @param {Object} params - Analysis parameters
   * @returns {Promise<Object>}
   */
  async analyzeStore(params) {
    const { storeId, productIds, page } = params;

    const cacheKey = `simglobe_analysis_${storeId}_${page}`;
    const cached = await this.getCache(cacheKey);
    if (cached) return cached;

    const data = await this.request('/analyze', {
      method: 'POST',
      body: JSON.stringify({ storeId, productIds, page })
    });

    await this.setCache(cacheKey, data, 180); // 3 min cache

    return data;
  },

  /**
   * Execute hedge transaction on Solana
   * @param {Object} hedgeData - Hedge parameters
   * @returns {Promise<Object>}
   */
  async executeHedge(hedgeData) {
    return this.request('/hedge', {
      method: 'POST',
      body: JSON.stringify(hedgeData)
    });
  },

  /**
   * Check hedge transaction status
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>}
   */
  async getHedgeStatus(transactionId) {
    return this.request(`/hedge/${transactionId}`);
  },

  /**
   * Get specific market details
   * @param {string} marketId - Market ID
   * @returns {Promise<Object>}
   */
  async getMarketById(marketId) {
    return this.request(`/risks/${marketId}`);
  },

  /**
   * Clear all cached data
   * @returns {Promise<void>}
   */
  async clearCache() {
    return new Promise((resolve) => {
      chrome.storage.local.clear(() => resolve());
    });
  },

  /**
   * Check if API is healthy
   * @returns {Promise<boolean>}
   */
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE.replace('/api', '')}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
};

// Make available globally
window.PredictifyApi = PredictifyApi;
