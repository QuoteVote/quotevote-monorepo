import createStripeCustomer from '~/resolvers/utils/stripe/createStripeCustomer';

export const addStripeCustomer = (pubsub) => {
  return async (_, args, context) => {
    console.log('[MUTATION] addStripeCustomer');
    try {
      const stripeCustomer = await createStripeCustomer(args);
      return stripeCustomer;
    } catch (err) {
      throw new Error(err);
    }
  };
};
