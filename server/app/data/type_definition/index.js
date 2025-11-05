import * as types from '../types';
import * as inputs from '../inputs';
import Query from './query_definition';
import { Mutation } from './mutation_definition';
import { Scalar } from './scalar_definition';
import Subscription from './subscription_definition';

export const typeDefs = [
  // so we don't to keep on adding here and forgetting about adding it here
  ...Object.values(types),
  ...Object.values(inputs),
  Query,
  Mutation,
  Subscription,
  Scalar,
  `
  # we need to tell the server which types represent the root query
  # and root mutation types.
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`,
];
