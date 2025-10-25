import mongoose from 'mongoose';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import ChatConversationModel from '~/resolvers/models/ChatConversationModel';
import ChatReceiptModel from '~/resolvers/models/ChatReceiptModel';

export const getChatReceipts = () => {
  return async (_, args, context) => {
    const { user } = context;
    if (!user || !user._id) {
      throw new AuthenticationError('Authentication required');
    }

    const { conversationId } = args;
    const convoId = mongoose.Types.ObjectId(conversationId);
    const userId = mongoose.Types.ObjectId(user._id);

    const conversation = await ChatConversationModel.findById(convoId).lean();
    if (!conversation || !conversation.memberIds.some((id) => id.toString() === userId.toString())) {
      throw new ForbiddenError('Conversation not found or access denied');
    }

    return ChatReceiptModel.find({ conversationId: convoId }).lean();
  };
};
