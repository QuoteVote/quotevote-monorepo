import { getPost } from '~/resolvers/queries/post';
import { getVote } from '~/resolvers/queries/vote';
import QuotesModel from '~/resolvers/models/QuoteModel';
import CommentModel from '~/resolvers/models/CommentModel';
import UserModel from '~/resolvers/models/UserModel';

export const activityRelationship = () => {
  return {
    async post(data, root) {
      const { postId } = data;
      const result = await getPost()(root, { postId });
      return result;
    },
    async vote(data, root) {
      const { voteId } = data;
      const result = await getVote()(root, { voteId });
      return result;
    },
    async quote(data) {
      const { quoteId } = data;
      const result = await QuotesModel.findById(quoteId);
      return result;
    },
    async comment(data) {
      const { commentId } = data;
      const result = await CommentModel.findById(commentId);
      return result;
    },
    async user(data) {
      const { userId } = data;
      const result = await UserModel.findById(userId);
      return result;
    },
  };
};
