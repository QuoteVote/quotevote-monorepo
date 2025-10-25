import mongoose from 'mongoose';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import ChatConversationModel from '~/resolvers/models/ChatConversationModel';
import ChatMessageModel from '~/resolvers/models/ChatMessageModel';

export const getChatMessages = () => {
  return async (_, args, context) => {
    const { user } = context;
    if (!user || !user._id) {
      throw new AuthenticationError('Authentication required');
    }

    const { conversationId, after, limit = 50 } = args;
    const convoId = mongoose.Types.ObjectId(conversationId);
    const userId = mongoose.Types.ObjectId(user._id);

    const conversation = await ChatConversationModel.findById(convoId).lean();
    if (!conversation || !conversation.memberIds.some((id) => id.toString() === userId.toString())) {
      throw new ForbiddenError('Conversation not found or access denied');
    }

    const query = { conversationId: convoId };
    if (after) {
      query.createdAt = { $gt: new Date(after) };
    }

    return ChatMessageModel
      .find(query)
      .sort({ createdAt: 1 })
      .limit(Math.min(limit, 200))
      .lean();
  };
};
