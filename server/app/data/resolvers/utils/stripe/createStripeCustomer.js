import getStripeAuth from './getStripeAuth';
import createStripePaymentMethod from './createStripePaymentMethod';

const createStripeCustomer = async ({ stripeCustomer }) => {
  const stripe = getStripeAuth();
  const {
    first_name, last_name, email, card, balance, companyName,
  } = stripeCustomer;
  const firstName = first_name || '';
  const lastName = last_name || '';
  const fullName = `${firstName} ${lastName}`;
  const name = companyName ? `${fullName} (${companyName})` : fullName;
  const paymentMethod = await createStripePaymentMethod(card);
  const customer = await stripe.customers.create({
    description: name,
    name,
    email,
    payment_method: paymentMethod.id,
    balance: balance || 0,
  });

  return customer;
};

export default createStripeCustomer;
