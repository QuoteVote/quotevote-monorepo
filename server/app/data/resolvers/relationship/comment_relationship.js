import { findUserById } from '~/resolvers/queries/user';
import VoteModel from '~/resolvers/models/VoteModel';
import AnonymousVoteModel from '~/resolvers/models/AnonymousVoteModel';

export const commentRelationship = () => {
  return {
    async user(data, root) {
      const { userId } = data;
      const result = await findUserById()(root, { user_id: userId });
      return result;
    },
    async votes(comment) {
      return VoteModel.find({ commentId: comment._id, deleted: { $ne: true } });
    },
    async anonymousVotes(comment) {
      const votes = await AnonymousVoteModel.find({
        commentId: comment._id,
        deleted: { $ne: true },
      });

      return votes.map((vote) => ({
        ...vote.toObject(),
        anonymous: true,
      }));
    },
  };
};
