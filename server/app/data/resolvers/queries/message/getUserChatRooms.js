import mongoose from 'mongoose';
import MessageRoomModel from '~/resolvers/models/MessageRoomModel';

export const getUserChatRooms = () => {
  return async (_, args, context) => {
    //  console.log("NOT BUDDY LIST", context)
    const { user } = context;
    // const messageRooms = await MessageRoomModel.find({users: user._id, messageType: 'USER'});
    //  console.log(messageRooms)
    // return messageRooms;

    const allRooms = await MessageRoomModel.aggregate([
      {
        $match: { users: mongoose.Types.ObjectId(user._id) },
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'postId',
          foreignField: '_id',
          as: 'postDetails',
        },
      },
      {
        $unwind: {
          path: '$postDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { messageType: { $ne: 'POST' } },
            {
              $and: [
                { messageType: 'POST' },
                { 'postDetails.bookmarkedBy': user._id },
              ],
            },
          ],
        },
      },
    ]);
    // console.log("ALL ROOMS", allRooms)
    return allRooms;
  };
};
