import { UserInputError } from 'apollo-server-express';
import { ObjectId } from 'mongodb';
import MessageModel from '../../models/MessageModel';
import UserModel from '../../models/UserModel';

export const markMessagesAsRead = () => {
  return async (_, args, context) => {
    console.log('[MUTATION] markMessagesAsRead');

    const { user } = context;
    if (!user) {
      throw new UserInputError('Authentication required');
    }

    const { conversationId } = args;
    const now = new Date();

    // Find all unread messages in the conversation
    const messages = await MessageModel.find({
      messageRoomId: new ObjectId(conversationId),
      'readBy.userId': { $ne: user._id },
      deleted: { $ne: true },
    });

    // Update each message to mark as read
    const updatedMessages = [];
    for (const message of messages) {
      message.readBy.push({
        userId: user._id,
        readAt: now,
      });
      await message.save();

      // Get user details for response
      const messageUser = await UserModel.findById(message.userId);
      
      updatedMessages.push({
        _id: message._id,
        messageRoomId: message.messageRoomId.toString(),
        userId: message.userId.toString(),
        userName: messageUser ? messageUser.name : 'Unknown User',
        userAvatar: messageUser ? messageUser.avatar : '',
        title: message.title,
        text: message.text,
        created: message.created,
        readBy: message.readBy.map(r => ({
          userId: r.userId.toString(),
          readAt: r.readAt,
        })),
      });
    }

    return updatedMessages;
  };
};
