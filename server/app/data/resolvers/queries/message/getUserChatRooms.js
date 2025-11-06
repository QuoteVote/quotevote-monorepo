import mongoose from 'mongoose';
import MessageRoomModel from '~/resolvers/models/MessageRoomModel';
import MessageModel from '~/resolvers/models/MessageModel';

export const getUserChatRooms = () => {
  return async (_, args, context) => {
    const { user } = context;
    
    // Get all rooms where user is a member
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
        $lookup: {
          from: 'messages',
          localField: '_id',
          foreignField: 'messageRoomId',
          as: 'messages',
        },
      },
      {
        $addFields: {
          hasMessages: { $gt: [{ $size: '$messages' }, 0] },
          userHasMessages: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: '$messages',
                    as: 'msg',
                    cond: { $eq: ['$$msg.userId', mongoose.Types.ObjectId(user._id)] },
                  },
                },
              },
              0,
            ],
          },
          isPostCreator: {
            $eq: ['$postDetails.userId', mongoose.Types.ObjectId(user._id)],
          },
        },
      },
      {
        $match: {
          $or: [
            // Non-POST rooms (DMs) - show all
            { messageType: { $ne: 'POST' } },
            // POST rooms - only show if:
            // 1. User is the post creator, OR
            // 2. User has sent messages in the room (has participated)
            {
              $and: [
                { messageType: 'POST' },
                {
                  $or: [
                    { isPostCreator: true },
                    { userHasMessages: true },
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          users: 1,
          messageType: 1,
          created: 1,
          postId: 1,
          lastActivity: 1,
          postDetails: {
            _id: 1,
            title: 1,
            text: 1,
            userId: 1,
            url: 1,
          },
        },
      },
    ]);
    
    // Format postDetails for GraphQL response
    // Aggregate returns plain objects, so we just need to format the postDetails
    const formattedRooms = allRooms.map((room) => {
      // Format postDetails if it exists
      if (room.postDetails && room.postDetails._id) {
        room.postDetails = {
          _id: room.postDetails._id.toString(),
          title: room.postDetails.title || '',
          text: room.postDetails.text || '',
          userId: room.postDetails.userId?.toString() || '',
          url: room.postDetails.url || '',
        };
      } else {
        room.postDetails = null;
      }
      
      // Ensure _id is a string
      if (room._id) {
        room._id = room._id.toString();
      }
      
      return room;
    });
    
    return formattedRooms;
  };
};
