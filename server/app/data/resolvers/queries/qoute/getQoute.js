import QuotesModel from '../../models/QuoteModel';

export const getQuote = (pubsub) => {
  return async (_, args, context) => {
    return await QuotesModel.findById(args.quoteId);
  };
};
