import mongoose from 'mongoose';
import { AuthenticationError } from 'apollo-server-express';
import ChatMessageModel from '~/resolvers/models/ChatMessageModel';
import ChatConversationModel from '~/resolvers/models/ChatConversationModel';

export const searchChatMessages = () => {
  return async (_, args, context) => {
    const { user } = context;
    if (!user || !user._id) {
      throw new AuthenticationError('Authentication required');
    }

    const { q, limit = 50 } = args;
    if (!q || !q.trim()) {
      return [];
    }

    const userId = mongoose.Types.ObjectId(user._id);

    const conversations = await ChatConversationModel
      .find({ memberIds: userId })
      .select('_id')
      .lean();

    if (!conversations.length) {
      return [];
    }

    const conversationIds = conversations.map((c) => c._id);

    return ChatMessageModel
      .find({
        conversationId: { $in: conversationIds },
        $text: { $search: q },
      })
      .limit(Math.min(limit, 200))
      .lean();
  };
};
