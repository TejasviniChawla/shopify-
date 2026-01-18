/**
 * Gemini AI Service
 * Handles Google Gemini AI analysis
 */

const axios = require('axios');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.model = 'gemini-pro';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1';
  }

  /**
   * Analyze store and market data
   * @param {Object} params - Analysis parameters
   * @returns {Promise<Object>} Analysis results
   */
  async analyze({ storeId, productIds, markets, page }) {
    try {
      // Use mock analysis if no API key
      if (!this.apiKey || this.apiKey === 'your_gemini_key_here') {
        console.log('Gemini: Using mock analysis (no API key configured)');
        return this.getMockAnalysis(markets, page);
      }

      const prompt = this.buildAnalysisPrompt({ storeId, productIds, markets, page });

      const response = await axios.post(
        `${this.baseUrl}/models/${this.model}:generateContent`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.apiKey
          },
          timeout: 30000
        }
      );

      const text = response.data.candidates[0]?.content?.parts[0]?.text;

      if (!text) {
        throw new Error('Empty response from Gemini');
      }

      // Parse JSON from response
      return this.parseAnalysisResponse(text, markets);

    } catch (error) {
      console.error('Gemini API error:', error.message);
      return this.getMockAnalysis(markets, page);
    }
  }

  /**
   * Analyze product-specific risks
   * @param {Object} params - Product parameters
   * @returns {Promise<Object>} Product analysis
   */
  async analyzeProduct({ productId, productName, productCategory, storeId, markets }) {
    try {
      if (!this.apiKey || this.apiKey === 'your_gemini_key_here') {
        return this.getMockProductAnalysis(productName, markets);
      }

      const prompt = this.buildProductPrompt({
        productId,
        productName,
        productCategory,
        markets
      });

      const response = await axios.post(
        `${this.baseUrl}/models/${this.model}:generateContent`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.apiKey
          },
          timeout: 30000
        }
      );

      const text = response.data.candidates[0]?.content?.parts[0]?.text;
      return this.parseProductResponse(text, productName, markets);

    } catch (error) {
      console.error('Gemini product analysis error:', error.message);
      return this.getMockProductAnalysis(productName, markets);
    }
  }

  /**
   * Generate market summary
   * @param {Array} markets - Market data
   * @returns {Promise<Object>} Summary
   */
  async generateSummary(markets) {
    if (!this.apiKey || this.apiKey === 'your_gemini_key_here') {
      return this.getMockSummary(markets);
    }

    try {
      const prompt = `Summarize these prediction market events for an e-commerce merchant in 2-3 sentences:
${markets.map(m => `- ${m.question}: ${Math.round(parseFloat(m.outcomePrices[0]) * 100)}%`).join('\n')}

Focus on business implications.`;

      const response = await axios.post(
        `${this.baseUrl}/models/${this.model}:generateContent`,
        {
          contents: [{ parts: [{ text: prompt }] }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.apiKey
          },
          timeout: 15000
        }
      );

      const text = response.data.candidates[0]?.content?.parts[0]?.text || '';

      return {
        text,
        keyRisks: markets.slice(0, 2).map(m => m.question),
        overallRiskLevel: this.calculateOverallRisk(markets)
      };

    } catch (error) {
      return this.getMockSummary(markets);
    }
  }

  /**
   * Build analysis prompt
   */
  buildAnalysisPrompt({ storeId, productIds, markets, page }) {
    return `You are a business analyst for an e-commerce store. Analyze how prediction market events could impact business operations.

Store ID: ${storeId}
Current page context: ${page}
${productIds?.length ? `Product IDs: ${productIds.join(', ')}` : ''}

Current Market Events:
${markets.map(m => `- ${m.question}: ${Math.round(parseFloat(m.outcomePrices[0]) * 100)}% probability`).join('\n')}

Provide analysis as JSON:
{
  "riskScore": <0-100>,
  "recommendations": [
    {"action": "<specific action>", "reason": "<why>", "impact": "<estimated $ impact>"}
  ],
  "affectedProducts": ["<product IDs at risk>"],
  "suggestedHedge": <$ amount>,
  "reasoning": "<brief explanation>"
}

Be specific and actionable. Focus on the ${page} page context.`;
  }

  /**
   * Build product analysis prompt
   */
  buildProductPrompt({ productId, productName, productCategory, markets }) {
    return `Analyze supply chain and pricing risks for this product:

Product: ${productName || productId}
Category: ${productCategory || 'Unknown'}

Market Events:
${markets.map(m => `- ${m.question}: ${Math.round(parseFloat(m.outcomePrices[0]) * 100)}%`).join('\n')}

Respond as JSON:
{
  "riskScore": <0-100>,
  "supplyChainRisks": [{"risk": "<description>", "probability": <0-100>}],
  "pricingRecommendation": "<suggestion>",
  "suggestedHedge": <$ amount>,
  "reasoning": "<explanation>"
}`;
  }

  /**
   * Parse analysis response
   */
  parseAnalysisResponse(text, markets) {
    try {
      // Try to extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Error parsing Gemini response:', e.message);
    }

    // Fallback to mock
    return this.getMockAnalysis(markets, 'general');
  }

  /**
   * Parse product response
   */
  parseProductResponse(text, productName, markets) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Error parsing product response:', e.message);
    }

    return this.getMockProductAnalysis(productName, markets);
  }

  /**
   * Calculate overall risk level
   */
  calculateOverallRisk(markets) {
    if (!markets || markets.length === 0) return 'low';

    const avgProb = markets.reduce((sum, m) =>
      sum + parseFloat(m.outcomePrices[0]), 0
    ) / markets.length;

    if (avgProb >= 0.6) return 'high';
    if (avgProb >= 0.4) return 'medium';
    return 'low';
  }

  /**
   * Get mock analysis for demo
   */
  getMockAnalysis(markets, page) {
    const highestRisk = markets?.reduce((max, m) =>
      parseFloat(m.outcomePrices[0]) > parseFloat(max.outcomePrices[0]) ? m : max
    , markets[0]) || { outcomePrices: ['0.5'], question: 'Market uncertainty' };

    const riskScore = Math.round(parseFloat(highestRisk.outcomePrices[0]) * 100);

    const recommendations = [
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
        action: `Hedge $${Math.round(riskScore * 50)} on prediction markets`,
        reason: 'Protect against worst-case scenario',
        impact: `$${Math.round(riskScore * 50)} insurance`
      }
    ];

    // Adjust recommendations based on page context
    if (page === 'campaigns') {
      recommendations[0] = {
        action: 'Pause high-budget campaigns temporarily',
        reason: 'Market volatility detected',
        impact: '-$1,000 potential wasted spend'
      };
    }

    return {
      riskScore,
      recommendations,
      affectedProducts: ['prod_123', 'prod_456'],
      suggestedHedge: Math.round(riskScore * 50),
      reasoning: `The ${highestRisk.question} poses significant risk to your supply chain.`
    };
  }

  /**
   * Get mock product analysis
   */
  getMockProductAnalysis(productName, markets) {
    const avgProb = markets?.reduce((sum, m) =>
      sum + parseFloat(m.outcomePrices[0]), 0
    ) / (markets?.length || 1);

    const riskScore = Math.round(avgProb * 100);

    return {
      riskScore,
      supplyChainRisks: [
        { risk: 'Shipping delays from port congestion', probability: 78 },
        { risk: 'Raw material cost increase', probability: 45 }
      ],
      pricingRecommendation: riskScore > 50
        ? 'Consider increasing price by 8-12% to offset potential supply chain costs'
        : 'Current pricing is appropriate given market conditions',
      suggestedHedge: Math.round(riskScore * 10),
      reasoning: `${productName || 'This product'} may be affected by current market events, particularly supply chain disruptions.`
    };
  }

  /**
   * Get mock summary
   */
  getMockSummary(markets) {
    const avgProb = markets?.reduce((sum, m) =>
      sum + parseFloat(m.outcomePrices[0]), 0
    ) / (markets?.length || 1);

    return {
      text: `Current market conditions show elevated risk levels. Port strike probability at 78% could significantly impact shipping timelines. Inflation concerns remain moderate. Consider reviewing inventory levels and pricing strategy.`,
      keyRisks: markets?.slice(0, 2).map(m => m.question) || [],
      overallRiskLevel: avgProb >= 0.6 ? 'high' : avgProb >= 0.4 ? 'medium' : 'low'
    };
  }
}

module.exports = GeminiService;
