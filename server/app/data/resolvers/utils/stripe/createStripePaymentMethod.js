import getStripeAuth from './getStripeAuth';

const createStripePaymentMethod = async (card) => {
  const stripe = getStripeAuth();
  const paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card,
  });
  return paymentMethod;
};

export default createStripePaymentMethod;
