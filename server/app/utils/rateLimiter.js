import { createClient } from 'redis';
import { logger } from './logger';

// Redis client for rate limiting
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error in rate limiter', err);
});

redisClient.connect().catch(logger.error);

/**
 * Rate limiter using token bucket algorithm with Redis
 */
class RateLimiter {
  /**
   * Check if user has exceeded rate limit
   * @param {string} userId - User ID
   * @param {string} action - Action type (e.g., 'msgSend')
   * @param {number} limit - Maximum requests allowed
   * @param {number} window - Time window in seconds
   * @returns {Promise<boolean>} - True if user is allowed, false if rate limited
   */
  async check(userId, action, limit = 30, window = 60) {
    try {
      const key = `rate_limit:${action}:${userId}`;
      const now = Math.floor(Date.now() / 1000);
      const windowStart = now - window;

      // Remove old entries outside the time window
      await redisClient.zRemRangeByScore(key, 0, windowStart);

      // Get current count
      const currentCount = await redisClient.zCard(key);

      // Check if user has exceeded the limit
      if (currentCount >= limit) {
        return false; // Rate limited
      }

      // Add current request timestamp
      await redisClient.zAdd(key, { score: now, value: `${now}-${Math.random()}` });

      // Set expiration to clean up old keys
      await redisClient.expire(key, window);

      return true; // Allowed
    } catch (error) {
      logger.error('Error in rate limiter check:', error);
      // Fail open - allow request if Redis is down
      return true;
    }
  }

  /**
   * Get current usage for a user
   * @param {string} userId - User ID
   * @param {string} action - Action type
   * @param {number} window - Time window in seconds
   * @returns {Promise<number>} - Current usage count
   */
  async getUsage(userId, action, window = 60) {
    try {
      const key = `rate_limit:${action}:${userId}`;
      const now = Math.floor(Date.now() / 1000);
      const windowStart = now - window;

      // Remove old entries outside the time window
      await redisClient.zRemRangeByScore(key, 0, windowStart);

      // Get current count
      return await redisClient.zCard(key);
    } catch (error) {
      logger.error('Error getting rate limiter usage:', error);
      return 0;
    }
  }
}

export const rateLimiter = new RateLimiter();
export default rateLimiter;