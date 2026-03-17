import { logger } from './logger';
import { parse, Kind } from 'graphql';

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
  'checkEmailStatus',
  'sendMagicLoginLink',
  'sendOnboardingCompletionLink',
  // add more public queries/mutations
];

const PUBLIC_QUERY_SET = new Set(PUBLIC_QUERIES);

const getRootOperationFields = (query) => {
  try {
    const document = parse(query);
    const rootFields = [];

    document.definitions.forEach((definition) => {
      if (definition.kind !== Kind.OPERATION_DEFINITION) {
        return;
      }

      if (!definition.selectionSet || !definition.selectionSet.selections) {
        return;
      }

      definition.selectionSet.selections.forEach((selection) => {
        if (selection.kind === Kind.FIELD) {
          rootFields.push(selection.name.value);
          return;
        }

        // Be conservative for fragment spreads/inline fragments at root.
        rootFields.push('__NON_FIELD_SELECTION__');
      });
    });

    return rootFields;
  } catch (error) {
    logger.warn('Failed to parse GraphQL query for auth check', {
      error: error.message,
    });
    return null;
  }
};

const requireAuth = (query) => {
  let requireAuth = true;
  const rootFields = getRootOperationFields(query);

  if (rootFields && rootFields.length > 0) {
    requireAuth = !rootFields.every((fieldName) => PUBLIC_QUERY_SET.has(fieldName));
  }

  logger.debug('requireAuth check', { requireAuth, query });
  return requireAuth;
};

export default requireAuth;
