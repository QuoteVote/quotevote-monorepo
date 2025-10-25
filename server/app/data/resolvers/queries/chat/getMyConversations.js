import mongoose from 'mongoose';
import { AuthenticationError } from 'apollo-server-express';
import ChatConversationModel from '~/resolvers/models/ChatConversationModel';

export const getMyConversations = () => {
  return async (_, __, context) => {
    const { user } = context;
    if (!user || !user._id) {
      throw new AuthenticationError('Authentication required');
    }

    const userId = mongoose.Types.ObjectId(user._id);

    return ChatConversationModel
      .find({ memberIds: userId })
      .sort({ lastMsgAt: -1 })
      .limit(200)
      .lean();
  };
};
