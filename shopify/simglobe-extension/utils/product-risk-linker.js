/**
 * Product-Risk Linker
 * Intelligently links products to relevant market risks
 */

const ProductRiskLinker = {
  // Keyword mappings: product keywords → risk categories/keywords
  keywordMappings: {
    // Materials
    'cotton': ['cotton', 'textile', 'fabric'],
    'leather': ['leather', 'manufacturing', 'tannery'],
    'denim': ['cotton', 'textile', 'fabric'],
    'wool': ['wool', 'textile', 'fabric'],
    'silk': ['silk', 'china', 'asia'],
    'polyester': ['oil', 'petroleum', 'synthetic'],
    'rubber': ['rubber', 'manufacturing'],
    
    // Product types
    'shoe': ['shipping', 'asia', 'china', 'manufacturing', 'tariff'],
    'sneaker': ['shipping', 'asia', 'china', 'manufacturing', 'tariff'],
    'nike': ['shipping', 'asia', 'china', 'manufacturing', 'tariff', 'vietnam'],
    'adidas': ['shipping', 'asia', 'china', 'manufacturing', 'tariff'],
    'apparel': ['shipping', 'textile', 'cotton', 'tariff'],
    'clothing': ['shipping', 'textile', 'cotton', 'tariff'],
    'shirt': ['cotton', 'textile', 'shipping'],
    't-shirt': ['cotton', 'textile', 'shipping'],
    'tshirt': ['cotton', 'textile', 'shipping'],
    'electronics': ['chip', 'semiconductor', 'china', 'taiwan', 'shipping'],
    'phone': ['chip', 'semiconductor', 'china', 'taiwan'],
    'computer': ['chip', 'semiconductor', 'china', 'taiwan'],
    
    // Origins/Supply Chain
    'china': ['china', 'tariff', 'shipping', 'asia'],
    'vietnam': ['vietnam', 'asia', 'shipping'],
    'asia': ['asia', 'shipping', 'port'],
    'import': ['tariff', 'shipping', 'customs'],
    
    // Categories
    'sneakers': ['shipping', 'asia', 'tariff', 'manufacturing'],
    't-shirts': ['cotton', 'textile', 'shipping'],
  },

  // Category to risk type mappings
  categoryMappings: {
    'Sneakers': ['Shipping', 'Tariffs', 'Economic'],
    'Shoes': ['Shipping', 'Tariffs', 'Economic'],
    'Footwear': ['Shipping', 'Tariffs', 'Economic'],
    'T-Shirts': ['Shipping', 'Economic'],
    'Apparel': ['Shipping', 'Economic'],
    'Clothing': ['Shipping', 'Economic'],
    'Electronics': ['Shipping', 'Tariffs', 'Economic'],
  },

  /**
   * Find risks relevant to a product
   * @param {Object} product - Product info {name, category, description}
   * @param {Array} allRisks - All available market risks
   * @returns {Array} Relevant risks with match scores
   */
  findRisksForProduct(product, allRisks) {
    const matches = [];
    const productText = `${product.name || ''} ${product.category || ''} ${product.description || ''}`.toLowerCase();

    allRisks.forEach(risk => {
      const riskText = `${risk.title || ''} ${risk.description || ''} ${risk.category || ''}`.toLowerCase();
      let score = 0;
      const matchReasons = [];

      // Check direct keyword matches
      for (const [keyword, relatedTerms] of Object.entries(this.keywordMappings)) {
        if (productText.includes(keyword)) {
          relatedTerms.forEach(term => {
            if (riskText.includes(term)) {
              score += 10;
              matchReasons.push(`"${keyword}" links to "${term}"`);
            }
          });
        }
      }

      // Check category mapping
      const productCategory = product.category || '';
      const categoryRiskTypes = this.categoryMappings[productCategory] || [];
      if (categoryRiskTypes.includes(risk.category)) {
        score += 15;
        matchReasons.push(`Category "${productCategory}" affected by ${risk.category}`);
      }

      // Direct text matches
      const productWords = productText.split(/\s+/).filter(w => w.length > 3);
      productWords.forEach(word => {
        if (riskText.includes(word)) {
          score += 5;
          matchReasons.push(`Direct match: "${word}"`);
        }
      });

      if (score > 0) {
        matches.push({
          risk,
          score,
          matchReasons: [...new Set(matchReasons)] // Remove duplicates
        });
      }
    });

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);
    return matches;
  },

  /**
   * Find products affected by a risk
   * @param {Object} risk - Market risk info
   * @param {Array} allProducts - All available products
   * @returns {Array} Affected products with impact levels
   */
  findProductsForRisk(risk, allProducts) {
    const matches = [];
    const riskText = `${risk.title || ''} ${risk.description || ''} ${risk.category || ''}`.toLowerCase();

    allProducts.forEach(product => {
      const productText = `${product.name || ''} ${product.category || ''} ${product.description || ''}`.toLowerCase();
      let score = 0;
      let impactLevel = 'low';
      const impactReasons = [];

      // Check keyword mappings in reverse
      for (const [keyword, relatedTerms] of Object.entries(this.keywordMappings)) {
        if (productText.includes(keyword)) {
          relatedTerms.forEach(term => {
            if (riskText.includes(term)) {
              score += 10;
              impactReasons.push(`${keyword} supply chain affected`);
            }
          });
        }
      }

      // Check category mapping
      const productCategory = product.category || '';
      const categoryRiskTypes = this.categoryMappings[productCategory] || [];
      if (categoryRiskTypes.includes(risk.category)) {
        score += 15;
        impactReasons.push(`${productCategory} category exposed`);
      }

      // Determine impact level based on score and risk probability
      const probability = parseFloat(risk.probability) || 0;
      if (score >= 20 && probability >= 0.6) {
        impactLevel = 'high';
      } else if (score >= 10 && probability >= 0.4) {
        impactLevel = 'medium';
      }

      if (score > 0) {
        matches.push({
          product,
          score,
          impactLevel,
          impactReasons: [...new Set(impactReasons)]
        });
      }
    });

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);
    return matches;
  },

  /**
   * Get impact description for a product-risk link
   * @param {Object} product - Product info
   * @param {Object} risk - Risk info
   * @returns {string} Human-readable impact description
   */
  getImpactDescription(product, risk) {
    const probability = parseFloat(risk.probability) || 0;
    const category = risk.category || '';

    if (category === 'Shipping') {
      if (probability >= 0.7) return 'High risk of 2-3 week shipping delays';
      if (probability >= 0.5) return 'Possible 1-2 week shipping delays';
      return 'Minor shipping disruptions possible';
    }

    if (category === 'Tariffs') {
      if (probability >= 0.6) return 'Likely 10-15% cost increase';
      if (probability >= 0.4) return 'Potential 5-10% cost increase';
      return 'Minimal tariff impact expected';
    }

    if (category === 'Economic') {
      if (probability >= 0.6) return 'Significant demand/pricing impact';
      if (probability >= 0.4) return 'Moderate market volatility';
      return 'Low economic impact';
    }

    return 'Potential supply chain impact';
  },

  /**
   * Calculate suggested hedge amount for a product
   * @param {Object} product - Product info with price/inventory
   * @param {Array} matchedRisks - Risks affecting this product
   * @returns {number} Suggested hedge in USDC
   */
  calculateSuggestedHedge(product, matchedRisks) {
    const baseValue = parseFloat(product.price) * (product.inventory || 10);
    const avgProbability = matchedRisks.reduce((sum, m) => 
      sum + parseFloat(m.risk.probability), 0) / Math.max(matchedRisks.length, 1);
    
    // Suggest hedging 20-50% of at-risk inventory value
    const hedgePercentage = 0.2 + (avgProbability * 0.3);
    return Math.round(baseValue * hedgePercentage);
  }
};

// Make available globally
window.ProductRiskLinker = ProductRiskLinker;

