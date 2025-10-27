import { findUserById } from '~/resolvers/queries/user';

export const quoteRelationship = () => {
  return {
    async user(data, root) {
      const { quoter } = data;
      const result = await findUserById()(root, { user_id: quoter });
      return result;
    },
  };
};
