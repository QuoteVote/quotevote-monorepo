import { logger } from './logger';

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
  'topPosts',
  'featuredPosts',
  'messages',
  'actionReactions',
  'messageReactions',
  'user',
  'getUserFollowInfo',
  'group',
  'groups',
  // add more public queries/mutations
];

const requireAuth = (query) => {
  let requireAuth = true;
  for (const publicQuery of PUBLIC_QUERIES) {
    const isFound = query.includes(publicQuery);
    if (isFound) {
      requireAuth = false;
      break;
    }
  }
  logger.debug('requireAuth check', { requireAuth, query });
  return requireAuth;
};

export default requireAuth;
