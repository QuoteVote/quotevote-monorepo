import MessageRoomModel from '../../models/MessageRoomModel';

export const getBookmarkedContents = (pubsub) => {
  return async (_, args, context) => {
    try {
      const messageType = 'CONTENT';
      const userId = context.user._id;
      const { ObjectId } = require('mongodb');
      const userObjectId = new ObjectId(userId);
      const bookmarkedMessageRooms = await MessageRoomModel.find({
        messageType,
        users: { $in: [userObjectId] },
      });
      if (bookmarkedMessageRooms) {
        return bookmarkedMessageRooms;
      }
      throw new Error('No bookmarked contents.');
    } catch (err) {
      throw new Error(err);
    }
  };
};
