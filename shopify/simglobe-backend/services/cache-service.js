/**
 * Cache Service
 * Simple in-memory caching with TTL support
 */

const NodeCache = require('node-cache');

class CacheService {
  constructor() {
    this.cache = new NodeCache({
      stdTTL: 300,           // Default TTL: 5 minutes
      checkperiod: 60,       // Check for expired keys every 60 seconds
      useClones: true,       // Return cloned values
      deleteOnExpire: true   // Auto-delete expired entries
    });

    // Log cache statistics periodically in development
    if (process.env.NODE_ENV === 'development') {
      setInterval(() => {
        const stats = this.cache.getStats();
        if (stats.hits > 0 || stats.misses > 0) {
          console.log(`Cache stats - Hits: ${stats.hits}, Misses: ${stats.misses}, Keys: ${stats.keys}`);
        }
      }, 60000);
    }
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or undefined
   */
  get(key) {
    return this.cache.get(key);
  }

  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live in seconds (optional)
   * @returns {boolean} Success status
   */
  set(key, value, ttl) {
    if (ttl !== undefined) {
      return this.cache.set(key, value, ttl);
    }
    return this.cache.set(key, value);
  }

  /**
   * Delete value from cache
   * @param {string} key - Cache key
   * @returns {number} Number of deleted entries
   */
  del(key) {
    return this.cache.del(key);
  }

  /**
   * Delete multiple keys
   * @param {Array<string>} keys - Array of keys to delete
   * @returns {number} Number of deleted entries
   */
  delMany(keys) {
    return this.cache.del(keys);
  }

  /**
   * Check if key exists
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Get TTL of a key
   * @param {string} key - Cache key
   * @returns {number} TTL in seconds, or undefined if not found
   */
  getTtl(key) {
    return this.cache.getTtl(key);
  }

  /**
   * Reset TTL of a key
   * @param {string} key - Cache key
   * @param {number} ttl - New TTL in seconds
   * @returns {boolean} Success status
   */
  ttl(key, ttl) {
    return this.cache.ttl(key, ttl);
  }

  /**
   * Get all keys
   * @returns {Array<string>} Array of all keys
   */
  keys() {
    return this.cache.keys();
  }

  /**
   * Get multiple values
   * @param {Array<string>} keys - Array of keys
   * @returns {Object} Object with key-value pairs
   */
  mget(keys) {
    return this.cache.mget(keys);
  }

  /**
   * Set multiple values
   * @param {Array<{key: string, val: *, ttl?: number}>} items - Array of items
   * @returns {boolean} Success status
   */
  mset(items) {
    return this.cache.mset(items);
  }

  /**
   * Flush all cached data
   */
  flush() {
    this.cache.flushAll();
  }

  /**
   * Get cache statistics
   * @returns {Object} Statistics object
   */
  getStats() {
    return this.cache.getStats();
  }

  /**
   * Get or set with callback
   * If key exists, returns cached value
   * If not, calls callback to generate value, caches it, and returns it
   * @param {string} key - Cache key
   * @param {Function} callback - Async function to generate value
   * @param {number} ttl - TTL in seconds (optional)
   * @returns {Promise<*>} Cached or generated value
   */
  async getOrSet(key, callback, ttl) {
    const cached = this.get(key);
    if (cached !== undefined) {
      return cached;
    }

    const value = await callback();
    this.set(key, value, ttl);
    return value;
  }

  /**
   * Wrap a function with caching
   * @param {Function} fn - Function to wrap
   * @param {Function} keyGenerator - Function to generate cache key from arguments
   * @param {number} ttl - TTL in seconds
   * @returns {Function} Wrapped function
   */
  wrap(fn, keyGenerator, ttl) {
    return async (...args) => {
      const key = keyGenerator(...args);
      return this.getOrSet(key, () => fn(...args), ttl);
    };
  }
}

// Export singleton instance
module.exports = new CacheService();
