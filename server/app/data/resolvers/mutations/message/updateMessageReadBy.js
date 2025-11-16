import { getUnreadMessages } from '~/resolvers/utils/message/getUnreadMessages';
import MessageModel from '~/resolvers/models/MessageModel';
import MessageRoomModel from '~/resolvers/models/MessageRoomModel';
import { logger } from '../../../utils/logger';

export const updateMessageReadBy = (pubsub) => {
  return async (_, args, context) => {
    // Removed console.log spam - use logger.debug() if detailed logging is needed
    try {
      const { messageRoomId } = args;
      const userId = context.user._id;
      
      // Get all messages in the room, sorted by creation date
      const allMessages = await MessageModel.find({
        messageRoomId,
        deleted: { $ne: true },
      }).sort({ created: 1 }); // Oldest first
      
      // Get unread messages (messages not sent by user and not read by user)
      const unreadMessages = allMessages.filter(
        (msg) => msg.userId.toString() !== userId.toString() 
          && !(msg.readBy || []).some((id) => id.toString() === userId.toString())
      );
      
      if (unreadMessages.length === 0) {
        // No unread messages, but still update last seen to the latest message
        const latestMessage = allMessages[allMessages.length - 1];
        if (latestMessage) {
          await MessageRoomModel.findByIdAndUpdate(messageRoomId, {
            $set: { [`lastSeenMessages.${userId}`]: latestMessage._id },
          });
        }
        return [];
      }
      
      // Get the last unread message (most recent)
      const lastUnreadMessage = unreadMessages[unreadMessages.length - 1];
      
      // Mark all unread messages as read
      const readMessages = [];
      for (const unreadMessage of unreadMessages) {
        const { _id, readBy } = unreadMessage;
        const newReadBy = readBy ? [...readBy, userId] : [userId];
        
        await MessageModel.updateOne(
          { _id }, 
          { $addToSet: { readBy: userId } }, // Use $addToSet to avoid duplicates
        );
        readMessages.push(unreadMessage);
      }
      
      // Update the room's last seen message for this user
      if (lastUnreadMessage) {
        await MessageRoomModel.findByIdAndUpdate(messageRoomId, {
          $set: { [`lastSeenMessages.${userId}`]: lastUnreadMessage._id },
        });
      }
      
      return readMessages;
    } catch (err) {
      throw new Error(err);
    }
  };
};
