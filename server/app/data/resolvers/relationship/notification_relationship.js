import { findUserById } from '~/resolvers/queries/user';
import PostModel from '~/resolvers/models/PostModel';

export const notificationRelationship = () => {
  return {
    async userBy(data, root) {
      const { userIdBy } = data;
      const result = await findUserById()(root, { user_id: userIdBy });
      return result;
    },
    async post(data, root) {
      const { postId } = data;
      return await PostModel.findById(postId);
    },
  };
};
