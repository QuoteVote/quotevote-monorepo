import MessageRoomModel from '../../models/MessageRoomModel';

export const removeContentChatRoom = (pubsub) => {
  return async (_, args, context) => {
    console.log('[MUTATION] removeContentChatRoom');
    const messageType = 'CONTENT';
    try {
      const userId = context.user._id;
      const { contentId } = args;
      let messageRoom = await MessageRoomModel.findOne({
        contentId,
        messageType,
      });
      if (messageRoom) {
        const { users, _id } = messageRoom;
        const newUsers = users.filter((user) => user.toString() !== userId);
        messageRoom = await MessageRoomModel.findByIdAndUpdate(_id, { users: newUsers }, { new: true });
      } else {
        throw new Error('Bookmarked content not found!');
      }
      return messageRoom;
    } catch (err) {
      throw new Error(err);
    }
  };
};
