import QuoteModel from '~/resolvers/models/QuoteModel';

/**
 * Query the latest quotes (global feed)
 */
export const latestQuotes = async (root, args) => {
  try {
    const { limit = 50 } = args;

    const quotes = await QuoteModel.find({ deleted: false })
      .sort({ created: -1 })
      .limit(limit)
      .lean()
      .exec();

    return quotes;
  } catch (error) {
    console.error('Error in latestQuotes query:', error);
    throw error;
  }
};
