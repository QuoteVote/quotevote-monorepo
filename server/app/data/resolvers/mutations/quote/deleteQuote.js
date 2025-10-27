import QuoteModel from '../../models/QuoteModel';

export const deleteQuote = () => {
  return async (_, args, context) => {
    const { quoteId } = args;
    const { user } = context;
    
    if (!user) {
      throw new Error('Authentication required');
    }

    const quote = await QuoteModel.findById(quoteId);
    if (!quote) {
      return { _id: quoteId };
    }

    // Check if user is the quote creator or an admin
    if (quote.quoter.toString() !== user._id.toString() && !user.admin) {
      throw new Error('Not authorized to delete this quote');
    }

    // Soft delete by setting deleted flag to true
    await QuoteModel.updateOne({ _id: quoteId }, { $set: { deleted: true } });
    return { _id: quoteId };
  };
}; 