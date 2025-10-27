import Stripe from 'stripe';

const getStripeAuth = () => {
  const { SANDBOX_STRIPE_SECRET_KEY, LIVE_STRIPE_SECRET_KEY, STRIPE_ENVIRONMENT } = process.env;
  const isSandbox = STRIPE_ENVIRONMENT !== 'production';
  console.log({
    isSandbox, SANDBOX_STRIPE_SECRET_KEY, LIVE_STRIPE_SECRET_KEY, STRIPE_ENVIRONMENT,
  });
  const stripe = Stripe(isSandbox ? SANDBOX_STRIPE_SECRET_KEY : LIVE_STRIPE_SECRET_KEY);
  return stripe;
};

export default getStripeAuth;
