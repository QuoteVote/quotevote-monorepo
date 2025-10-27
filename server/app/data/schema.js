import { makeExecutableSchema } from '@graphql-tools/schema';

import { typeDefs } from './type_definition';
import { resolvers } from './resolvers';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export { schema };
