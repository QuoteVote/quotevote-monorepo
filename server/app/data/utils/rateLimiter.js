// In-memory rate limiter for message sending
const rateLimitMap = new Map();

/**
 * Check if a user has exceeded the rate limit
 * @param {string} userId - The user ID
 * @param {string} action - The action being rate limited (e.g., 'sendMessage')
 * @param {number} limit - Maximum number of actions allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - True if within limit, throws error if exceeded
 */
export const checkRateLimit = (userId, action, limit = 10, windowMs = 60000) => {
  const key = `${userId}:${action}`;
  const now = Date.now();

  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  const userLimit = rateLimitMap.get(key);

  // Reset window if expired
  if (now > userLimit.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  // Check if limit exceeded
  if (userLimit.count >= limit) {
    const remainingTime = Math.ceil((userLimit.resetAt - now) / 1000);
    throw new Error(
      `Rate limit exceeded for ${action}. Please try again in ${remainingTime} seconds.`,
    );
  }

  // Increment count
  userLimit.count += 1;
  return true;
};

/**
 * Reset rate limit for a user/action
 */
export const resetRateLimit = (userId, action) => {
  const key = `${userId}:${action}`;
  rateLimitMap.delete(key);
};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, 300000);

export default { checkRateLimit, resetRateLimit };

