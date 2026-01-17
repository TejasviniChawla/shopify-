/**
 * Request Validators
 * Input validation utilities
 */

/**
 * Validate hedge request
 * @param {Object} body - Request body
 * @returns {Object} Validation result
 */
function validateHedgeRequest(body) {
  const errors = [];

  if (!body.marketId) {
    errors.push('marketId is required');
  }

  if (!body.amount) {
    errors.push('amount is required');
  } else if (typeof body.amount !== 'number' || body.amount <= 0) {
    errors.push('amount must be a positive number');
  } else if (body.amount > 1000000) {
    errors.push('amount exceeds maximum limit');
  }

  if (body.walletAddress && !isValidSolanaAddress(body.walletAddress)) {
    errors.push('Invalid Solana wallet address');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate analysis request
 * @param {Object} body - Request body
 * @returns {Object} Validation result
 */
function validateAnalysisRequest(body) {
  const errors = [];

  if (!body.storeId) {
    errors.push('storeId is required');
  }

  if (body.productIds && !Array.isArray(body.productIds)) {
    errors.push('productIds must be an array');
  }

  if (body.page && typeof body.page !== 'string') {
    errors.push('page must be a string');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate voice briefing request
 * @param {Object} body - Request body
 * @returns {Object} Validation result
 */
function validateVoiceRequest(body) {
  const errors = [];

  if (body.text) {
    if (typeof body.text !== 'string') {
      errors.push('text must be a string');
    } else if (body.text.length > 5000) {
      errors.push('text must be less than 5000 characters');
    } else if (body.text.length < 10) {
      errors.push('text must be at least 10 characters');
    }
  }

  if (body.voiceId && typeof body.voiceId !== 'string') {
    errors.push('voiceId must be a string');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate Solana address format
 * @param {string} address - Address to validate
 * @returns {boolean}
 */
function isValidSolanaAddress(address) {
  if (!address || typeof address !== 'string') {
    return false;
  }

  // Solana addresses are base58 encoded and 32-44 characters
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

/**
 * Validate pagination parameters
 * @param {Object} query - Query parameters
 * @returns {Object} Sanitized pagination
 */
function validatePagination(query) {
  let limit = parseInt(query.limit, 10) || 10;
  let offset = parseInt(query.offset, 10) || 0;

  // Enforce limits
  limit = Math.min(Math.max(limit, 1), 100);
  offset = Math.max(offset, 0);

  return { limit, offset };
}

/**
 * Sanitize string input
 * @param {string} input - Input string
 * @param {number} maxLength - Maximum length
 * @returns {string} Sanitized string
 */
function sanitizeString(input, maxLength = 1000) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ''); // Basic XSS prevention
}

/**
 * Validate market ID format
 * @param {string} marketId - Market ID
 * @returns {boolean}
 */
function isValidMarketId(marketId) {
  if (!marketId || typeof marketId !== 'string') {
    return false;
  }

  // Allow alphanumeric, hyphens, underscores
  const marketIdRegex = /^[a-zA-Z0-9_-]{1,64}$/;
  return marketIdRegex.test(marketId);
}

/**
 * Validate store ID format
 * @param {string} storeId - Store ID
 * @returns {boolean}
 */
function isValidStoreId(storeId) {
  if (!storeId || typeof storeId !== 'string') {
    return false;
  }

  // Shopify store IDs are typically alphanumeric with hyphens
  const storeIdRegex = /^[a-z0-9-]{1,64}$/;
  return storeIdRegex.test(storeId.toLowerCase());
}

module.exports = {
  validateHedgeRequest,
  validateAnalysisRequest,
  validateVoiceRequest,
  validatePagination,
  sanitizeString,
  isValidSolanaAddress,
  isValidMarketId,
  isValidStoreId
};
