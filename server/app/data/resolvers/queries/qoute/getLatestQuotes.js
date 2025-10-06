import QuoteModel from '~/resolvers/models/QuoteModel';
import { sanitizeLimit, sanitizeOffset } from '~/resolvers/utils/queryValidation';

/**
 * Query the latest quotes (global feed)
 * Supports pagination via limit and offset parameters
 */
export const latestQuotes = async (root, args) => {
  try {
    // Sanitize pagination parameters to prevent MongoDB crashes and abuse
    const sanitizedLimit = sanitizeLimit(args.limit);
    const sanitizedOffset = sanitizeOffset(args.offset);

    const quotes = await QuoteModel.find({ deleted: false })
      .sort({ created: -1 })
      .skip(sanitizedOffset)
      .limit(sanitizedLimit)
      .lean()
      .exec();

    return quotes;
  } catch (error) {
    console.error('Error in latestQuotes query:', error);
    throw error;
  }
};
