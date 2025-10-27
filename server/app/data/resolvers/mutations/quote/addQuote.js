import QuoteModel from '../../models/QuoteModel';
import PostModel from '../../models/PostModel';
import { logActivity } from '../../utils/activities_utils';
import { logger } from '../../../utils/logger';
import { updateTrending } from '../../utils/post_utils';

export const addQuote = (pubsub) => {
  return async (_, args) => {
    logger.info('Function: addQuote');
    const quoteData = { ...args.quote, created: new Date() };

    try {
      const quote = await new QuoteModel(quoteData).save();
      await updateTrending(quote.postId);
      const post = await PostModel.findById(quote.postId);
      await logActivity(
        'QUOTED',
        { userId: quote.quoter, postId: quote.postId, quoteId: quote._id },
        `Quoted on '${post.title}' post.`,
      );
      return quote;
    } catch (err) {
      throw new Error(err);
    }
  };
};
