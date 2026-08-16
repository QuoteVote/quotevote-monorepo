import { parse } from 'graphql';
import { logger } from './logger';

/**
 * Root fields that may be executed without a token.
 *
 * These are matched by *exact field name*. The previous implementation tested
 * `query.includes(publicName)` against the whole document, so any operation
 * that merely mentioned "post", "user", "group" or "messages" anywhere — a
 * `userId` field, a nested `post { _id }` selection — skipped the gate. In
 * practice almost nothing was gated.
 */
const PUBLIC_OPERATIONS = new Set([
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
  'messages',
  'actionReactions',
  'messageReactions',
  'user',
  'getUserFollowInfo',
  'group',
  'groups',
  // Public search on the landing page. The resolver excludes hash_password,
  // reset tokens, wallet and email, and caps results at 50.
  'searchUser',
]);

/** Introspection fields are handled here as well as by the server context. */
const isIntrospectionField = (name) => name.startsWith('__');

/**
 * Collect the root field names of every operation in a document.
 *
 * Root selections may be fragment spreads, so named fragments are resolved
 * one level (fragments on Query/Mutation). Returns null when the document
 * cannot be parsed or contains no operation, so callers can fail closed.
 */
export const getRootFieldNames = (query) => {
  let document;
  try {
    document = parse(query);
  } catch (error) {
    logger.debug('requireAuth could not parse query', { error: error.message });
    return null;
  }

  const fragments = new Map();
  for (const def of document.definitions) {
    if (def.kind === 'FragmentDefinition') {
      fragments.set(def.name.value, def);
    }
  }

  const names = [];
  const collect = (selectionSet, depth = 0) => {
    if (!selectionSet || depth > 5) return;
    for (const selection of selectionSet.selections) {
      if (selection.kind === 'Field') {
        names.push(selection.name.value);
      } else if (selection.kind === 'InlineFragment') {
        collect(selection.selectionSet, depth + 1);
      } else if (selection.kind === 'FragmentSpread') {
        const fragment = fragments.get(selection.name.value);
        if (fragment) collect(fragment.selectionSet, depth + 1);
      }
    }
  };

  let sawOperation = false;
  for (const def of document.definitions) {
    if (def.kind === 'OperationDefinition') {
      sawOperation = true;
      collect(def.selectionSet);
    }
  }

  if (!sawOperation) return null;
  return names;
};

/**
 * Whether a GraphQL document requires an authenticated user.
 *
 * Denies by default: an unparseable document, one with no operation, or one
 * containing any root field outside the allowlist requires authentication.
 */
const requireAuth = (query) => {
  if (!query || typeof query !== 'string') {
    return true;
  }

  const rootFields = getRootFieldNames(query);

  if (rootFields === null || rootFields.length === 0) {
    logger.debug('requireAuth check', { requireAuth: true, reason: 'no parseable operation' });
    return true;
  }

  const gated = rootFields.filter(
    (name) => !PUBLIC_OPERATIONS.has(name) && !isIntrospectionField(name),
  );

  if (gated.length > 0) {
    logger.debug('requireAuth check', { requireAuth: true, gated });
    return true;
  }

  logger.debug('requireAuth check', { requireAuth: false, rootFields });
  return false;
};

export { PUBLIC_OPERATIONS };
export default requireAuth;
