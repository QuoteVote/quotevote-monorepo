import { AuthenticationError } from 'apollo-server-express';
import requireAuth from './requireAuth';
import { logger } from './logger';

/**
 * Every query text an HTTP request carries.
 *
 * Apollo runs the URL `query` on GET and the body `query` on POST, and Express
 * parses a JSON body on any method, so both are collected and checked. A
 * request that carries both is gated on both.
 */
export const collectRequestQueries = (req) => {
  const queries = [];
  if (req && req.body && req.body.query !== undefined) queries.push(req.body.query);
  if (req && req.query && req.query.query !== undefined) queries.push(req.query.query);
  return queries;
};

/**
 * Resolve the user for a token. A token that fails verification is treated
 * exactly like no token: the request continues as logged out and is still
 * held to the allowlist.
 */
export const resolveTokenUser = async (authToken, verifyToken) => {
  if (!authToken || !authToken.length) return null;
  try {
    return await verifyToken(authToken);
  } catch (error) {
    logger.debug('Invalid token, continuing as logged out', { error: error.message });
    return null;
  }
};

/**
 * Throw unless the request is allowed without a user: every query it carries
 * must be a string whose root fields are all on the `requireAuth` allowlist.
 * Introspection is allowed through the allowlist's `__` field rule, not by
 * trusting the client-supplied operation name.
 */
export const assertAllowedWithoutUser = (queries) => {
  const blocked = queries.some((query) => typeof query !== 'string' || requireAuth(query));
  if (blocked) {
    throw new AuthenticationError('Auth token not found in request');
  }
};
