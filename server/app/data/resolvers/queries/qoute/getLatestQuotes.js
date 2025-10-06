import QuoteModel from '~/resolvers/models/QuoteModel';

// Constants for validation
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

/**
 * Sanitize and validate limit parameter
 * @param {any} limit - User-provided limit value
 * @returns {number} - Sanitized limit value (between 1 and MAX_LIMIT)
 */
const sanitizeLimit = (limit) => {
  // Convert to number and floor it
  const floorLimit = Math.floor(Number(limit));
  
  // Handle NaN, undefined, null, or invalid values - use default
  if (isNaN(floorLimit) || limit === undefined || limit === null) {
    return DEFAULT_LIMIT;
  }
  
  // Enforce: minimum 1, maximum MAX_LIMIT
  // limit = Math.min(MAX_LIMIT, Math.max(1, floorLimit))
  return Math.min(MAX_LIMIT, Math.max(1, floorLimit));
};

/**
 * Query the latest quotes (global feed)
 */
export const latestQuotes = async (root, args) => {
  try {
    // Sanitize limit to prevent MongoDB crashes and abuse
    const sanitizedLimit = sanitizeLimit(args.limit);

    const quotes = await QuoteModel.find({ deleted: false })
      .sort({ created: -1 })
      .limit(sanitizedLimit)
      .lean()
      .exec();

    return quotes;
  } catch (error) {
    console.error('Error in latestQuotes query:', error);
    throw error;
  }
};
