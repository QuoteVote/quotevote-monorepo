import mongoose from 'mongoose';
import MessageRoomModel from '~/resolvers/models/MessageRoomModel';
import MessageModel from '~/resolvers/models/MessageModel';
import RosterModel from '~/resolvers/models/RosterModel';

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
        $lookup: {
          from: 'comments', // MongoDB collection name (lowercase plural of 'Comments' model)
          localField: 'postId',
          foreignField: 'postId',
          as: 'postComments',
          pipeline: [
            // Only include comments that have a postId (not null/undefined)
            { $match: { postId: { $exists: true, $ne: null } } },
          ],
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
          userHasCommented: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: '$postComments',
                    as: 'comment',
                    cond: {
                      $and: [
                        { $eq: ['$$comment.userId', mongoose.Types.ObjectId(user._id)] },
                        { $ne: ['$$comment.deleted', true] }, // Exclude deleted comments
                      ],
                    },
                  },
                },
              },
              0,
            ],
          },
          isPostCreator: {
            $eq: ['$postDetails.userId', mongoose.Types.ObjectId(user._id)],
          },
          // Get the most recent message timestamp for sorting
          lastMessageTime: {
            $cond: {
              if: { $gt: [{ $size: '$messages' }, 0] },
              then: { $max: '$messages.created' },
              else: '$lastActivity', // Fall back to lastActivity if no messages
            },
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
            // 2. User has sent messages in the room, OR
            // 3. User has commented on the post
            {
              $and: [
                { messageType: 'POST' },
                {
                  $or: [
                    { isPostCreator: true },
                    { userHasMessages: true },
                    { userHasCommented: true },
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
          lastMessageTime: 1,
          postDetails: {
            _id: 1,
            title: 1,
            text: 1,
            userId: 1,
            url: 1,
          },
        },
      },
      // Sort by last message time (most recent first), then by lastActivity as fallback
      {
        $sort: {
          lastMessageTime: -1,
          lastActivity: -1,
        },
      },
    ]);
    
    // Format postDetails for GraphQL response
    // Aggregate returns plain objects, so we just need to format the postDetails
    // Note: We no longer filter out blocked chats - both users can see their chat history
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
