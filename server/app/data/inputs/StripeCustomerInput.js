export const StripeCustomerInput = `
input StripeCustomerInput {
  first_name: String!
  last_name: String
  email: String!
  card: CardPaymentMethodInput!
}
`;
