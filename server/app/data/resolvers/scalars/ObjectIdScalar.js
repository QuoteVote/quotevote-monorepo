import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

const ObjectId = require('mongoose').Types.ObjectId;

export default new GraphQLScalarType({
  name: 'ObjectId',
  serialize(value) {
    if (value instanceof ObjectId) {
      return value.toHexString();
    }
    return null;
  },
  parseValue(value) {
    if (typeof value === 'string') {
      return new ObjectId(value);
    }
    return null;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new ObjectId(ast.value);
    }
    return null;
  },
});
