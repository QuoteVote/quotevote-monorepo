import MessageModel from '~/resolvers/models/MessageModel';

export const getUnreadMessages = async (messageRoomId, context) => {
  const userId = context.user._id;
  const unReadMessages = await MessageModel.find({
    messageRoomId,
    userId: { $ne: userId },
    readBy: { $nin: userId },
    deleted: { $ne: true },
  });
  return unReadMessages;
};
