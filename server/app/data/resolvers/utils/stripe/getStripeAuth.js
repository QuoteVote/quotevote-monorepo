import Stripe from 'stripe';
import { logger } from '../../../utils/logger';

const getStripeAuth = () => {
  const { SANDBOX_STRIPE_SECRET_KEY, LIVE_STRIPE_SECRET_KEY, STRIPE_ENVIRONMENT } = process.env;
  const isSandbox = STRIPE_ENVIRONMENT !== 'production';
  logger.debug('getStripeAuth', {
    isSandbox,
    hasSandboxKey: !!SANDBOX_STRIPE_SECRET_KEY,
    hasLiveKey: !!LIVE_STRIPE_SECRET_KEY,
    stripeEnvironment: STRIPE_ENVIRONMENT,
  });
  const stripe = Stripe(isSandbox ? SANDBOX_STRIPE_SECRET_KEY : LIVE_STRIPE_SECRET_KEY);
  return stripe;
};

export default getStripeAuth;
