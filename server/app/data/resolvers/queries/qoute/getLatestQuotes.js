import QuoteModel from '~/resolvers/models/QuoteModel';
import { sanitizeLimit } from '~/resolvers/utils/queryValidation';

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
