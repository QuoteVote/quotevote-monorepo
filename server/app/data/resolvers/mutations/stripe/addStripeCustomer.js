import createStripeCustomer from '~/resolvers/utils/stripe/createStripeCustomer';
import { logger } from '~/utils/logger';

export const addStripeCustomer = (pubsub) => {
  return async (_, args, context) => {
    logger.debug('[MUTATION] addStripeCustomer', { userId: context.user?._id });
    try {
      const stripeCustomer = await createStripeCustomer(args);
      return stripeCustomer;
    } catch (err) {
      throw new Error(err);
    }
  };
};
