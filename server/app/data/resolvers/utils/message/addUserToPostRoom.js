import { ObjectId } from 'mongodb';
import MessageRoomModel from '../../models/MessageRoomModel';

/**
 * Add a user to a post's message room.
 * If the room doesn't exist, it will be created.
 * If the user is already in the room, no changes are made.
 * 
 * @param {string|ObjectId} postId - The post ID
 * @param {string|ObjectId} userId - The user ID to add
 * @returns {Promise<Object>} The message room document
 */
export const addUserToPostRoom = async (postId, userId) => {
  // Convert postId to ObjectId if it's a string
  const postObjectId = typeof postId === 'string' ? new ObjectId(postId) : postId;
  const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId;

  // Find existing room for this post
  let messageRoom = await MessageRoomModel.findOne({
    postId: postObjectId,
    messageType: 'POST',
  });

  if (messageRoom) {
    // Check if user is already in the room
    const usersStringArray = messageRoom.users.map((user) => user.toString());
    const userIdString = userObjectId.toString();

    if (!usersStringArray.includes(userIdString)) {
      // Add user to the room using $addToSet to prevent duplicates
      messageRoom = await MessageRoomModel.findByIdAndUpdate(
        messageRoom._id,
        {
          $addToSet: { users: userObjectId },
          $set: { lastActivity: new Date() },
        },
        { new: true }
      );
    } else {
      // User already in room, just update lastActivity
      messageRoom = await MessageRoomModel.findByIdAndUpdate(
        messageRoom._id,
        {
          $set: { lastActivity: new Date() },
        },
        { new: true }
      );
    }
  } else {
    // Create new room with the user
    const messageRoomData = {
      users: [userObjectId],
      postId: postObjectId,
      messageType: 'POST',
      lastActivity: new Date(),
    };
    messageRoom = await new MessageRoomModel(messageRoomData).save();
  }

  return messageRoom;
};

