import { getUnreadMessages } from '~/resolvers/utils/message/getUnreadMessages';
import MessageModel from '~/resolvers/models/MessageModel';

export const updateMessageReadBy = (pubsub) => {
  return async (_, args, context) => {
    console.log('[MUTATION] updateMessageReadBy');
    try {
      const { messageRoomId } = args;
      const unreadMessages = await getUnreadMessages(messageRoomId, context);
      const userId = context.user._id;
      const readMessages = [];
      for (const unreadMessage of unreadMessages) {
        const { _id, readBy } = unreadMessage;
        const newReadBy = readBy ? [...readBy, userId] : [userId];
        console.log({
          _id,
          readBy,
          newReadBy,
        });
        const readMessage = await MessageModel.update(
          { _id }, { readBy: newReadBy },
        );
        readMessages.push(readMessage);
      }
      return unreadMessages;
    } catch (err) {
      throw new Error(err);
    }
  };
};
