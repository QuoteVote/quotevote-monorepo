import RateLimitModel from '../models/RateLimitModel';

// Rate limit configurations (requests per window)
const RATE_LIMITS = {
  message: { limit: 30, windowMs: 60000 }, // 30 messages per minute
  presence_update: { limit: 120, windowMs: 60000 }, // 120 updates per minute (2 per second)
  typing: { limit: 60, windowMs: 60000 }, // 60 typing updates per minute
};

/**
 * Check if a user has exceeded the rate limit for a specific action
 * @param {String} userId - The user ID
 * @param {String} action - The action type (message, presence_update, typing)
 * @returns {Promise<Boolean>} - True if rate limit exceeded, false otherwise
 */
export async function checkRateLimit(userId, action) {
  const config = RATE_LIMITS[action];
  if (!config) {
    throw new Error(`Unknown action type: ${action}`);
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowMs);

  // Find or create rate limit record
  let rateLimitRecord = await RateLimitModel.findOne({
    userId,
    action,
    windowStart: { $gte: windowStart },
  });

  if (!rateLimitRecord) {
    // Create new rate limit record
    const expiresAt = new Date(now.getTime() + config.windowMs);
    rateLimitRecord = await new RateLimitModel({
      userId,
      action,
      count: 1,
      windowStart: now,
      expiresAt,
    }).save();
    return false;
  }

  // Check if limit exceeded
  if (rateLimitRecord.count >= config.limit) {
    return true;
  }

  // Increment count
  rateLimitRecord.count += 1;
  await rateLimitRecord.save();
  return false;
}

/**
 * Reset rate limit for a user and action
 * @param {String} userId - The user ID
 * @param {String} action - The action type
 */
export async function resetRateLimit(userId, action) {
  await RateLimitModel.deleteMany({ userId, action });
}
