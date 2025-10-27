import QuotesModel from '../../models/QuoteModel';

export const getQuotes = () => {
  return async (_, args, context) => {
    return await QuotesModel.find({ ...args });
  };
};
