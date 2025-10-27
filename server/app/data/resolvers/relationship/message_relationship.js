import { findUserById } from '~/resolvers/queries/user';

export const messageRelationship = () => {
  return {
    async user(data, root) {
      const { userId } = data;
      const result = await findUserById()(root, { user_id: userId });
      return result;
    },
  };
};
