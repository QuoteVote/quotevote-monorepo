import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import moment from 'moment-timezone';
import { DateFormat_DATETIME } from '../constants/common';

export default new GraphQLScalarType({
  name: 'DateTime',
  description: `Returns a Date of format of "${DateFormat_DATETIME}" in String`,
  serialize(value) {
    if (value instanceof Date) {
      return value.getTime();
    }
    if (typeof value === 'number') {
      return Math.trunc(value);
    }
    if (typeof value === 'string') {
      if (!moment(value).isValid()) {
        return null;
      }
      return Date.parse(value);
    }
    return null;
  },
  parseValue(value) {
    if (value === null) {
      return null;
    }
    if (!moment(value).isValid()) {
      throw new Error('Invalid Date.');
    }
    if (moment(value, DateFormat_DATETIME).format(DateFormat_DATETIME) === value) {
      return value;
    }
    throw new Error(`Invalid Date Format. It should follow this format (${DateFormat_DATETIME})`);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      if (!moment(ast.value).isValid()) {
        throw new Error('Invalid Date.');
      }
      if (moment(ast.value, DateFormat_DATETIME).format(DateFormat_DATETIME) === ast.value) {
        return ast.value;
      }
      throw new Error(`Invalid Date Format. It should follow this format (${DateFormat_DATETIME})`);
    }
    return null;
  },
});
