import GraphQLJSON from 'graphql-type-json';
import { resolver_query } from './queries';
import { resolver_mutations } from './mutations';
import * as relationship from './relationship';
import { Subscription } from './subscriptions';
import * as scalars from './scalars';

const resolvers = {
  // Include JSON as a scalar type
  JSON: GraphQLJSON,

  // Get/query data functions
  Query: resolver_query(),

  // Insert/Update functions
  Mutation: resolver_mutations(),

  // Subscription resolvers are auto generated based on the definition
  Subscription,

  // Scalar
  DateTime: scalars.DateTimeScalar,

  // Object/Model relationships
  MessageRoom: relationship.messageRoomRelationship(),
  Activity: relationship.activityRelationship(),
  Post: relationship.postRelationship(),
  Comment: relationship.commentRelationship(),
  Message: relationship.messageRelationship(),
  Notification: relationship.notificationRelationship(),
  Vote: relationship.voteRelationship(),
  Quote: relationship.quoteRelationship(),
};

export { resolvers };
