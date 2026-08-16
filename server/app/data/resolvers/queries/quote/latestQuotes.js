import QuoteModel from '../../models/QuoteModel';
import { logger } from '../../../utils/logger';

/** Upper bound so a client cannot ask for an unbounded result set. */
export const MAX_LATEST_QUOTES = 100;

export const latestQuotes = () => {
  return async (_, args) => {
    const { limit } = args;
    logger.debug('Function: latestQuotes', { limit });

    const capped = Number.isFinite(limit) && limit > 0
      ? Math.min(Math.trunc(limit), MAX_LATEST_QUOTES)
      : MAX_LATEST_QUOTES;

    return QuoteModel.find({ deleted: { $ne: true } })
      .sort({ created: 'desc' })
      .limit(capped);
  };
};
