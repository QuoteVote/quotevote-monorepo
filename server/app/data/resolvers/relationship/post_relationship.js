import { ObjectId } from 'mongodb';
import { findUserById } from '~/resolvers/queries/user';
import CommentModel from '~/resolvers/models/CommentModel';
import VoteModel from '~/resolvers/models/VoteModel';
import QuoteModel from '~/resolvers/models/QuoteModel';
import MessageRoomModel from '~/resolvers/models/MessageRoomModel';

export const postRelationship = () => {
  return {
    async creator(data, root) {
      const { userId } = data;
      const result = await findUserById()(root, { user_id: userId });
      return result;
    },
    async comments(post) {
      const comments = await CommentModel.find({ postId: post._id, deleted: { $ne: true } });
      return comments;
    },
    async votes(post) {
      const votes = await VoteModel.find({ postId: post._id, deleted: { $ne: true } });
      return votes;
    },
    async quotes(post) {
      const quotes = await QuoteModel.find({ postId: post._id, deleted: { $ne: true } });
      return quotes;
    },
    async messageRoom(post) {
      // Convert post._id to ObjectId if it's a string
      const postObjectId = typeof post._id === 'string' ? new ObjectId(post._id) : post._id;
      const messageRoom = await MessageRoomModel.findOne({ postId: postObjectId });
      return messageRoom;
    },
  };
};
