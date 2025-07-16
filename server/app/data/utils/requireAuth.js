const PUBLIC_QUERIES = [
  'addStripeCustomer',
  'requestUserAccess',
  'checkDuplicateEmail',
  'sendInvestorMail',
  'sendPasswordResetEmail',
  'verifyUserPasswordResetToken',
  'updateUserPassword',
  'popPrediction',
  'posts',
  'featuredPosts',
  'post',
  // add more public queries/mutations
];

const requireAuth = (query) => {
  let requireAuth = true;
  for (let publicQuery of PUBLIC_QUERIES) {
    const isFound = query.includes(publicQuery);
    if (isFound) {
      requireAuth = false;
      break;
    }
  }
  console.log({ requireAuth });
  return requireAuth;
};

export default requireAuth;
