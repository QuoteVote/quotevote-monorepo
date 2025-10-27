import { ObjectId } from 'mongodb';
import MessageRoomModel from '../../models/MessageRoomModel';

export const createPostMessageRoom = () => {
  return async (_, args, context) => {
    const userId = context.user._id;
    const { postId } = args;
    
    // Convert postId to ObjectId if it's a string
    const postObjectId = typeof postId === 'string' ? new ObjectId(postId) : postId;
    
    let messageRoom = await MessageRoomModel.findOne({
      postId: postObjectId,
      messageType: 'POST',
    });
    
    if (messageRoom) {
      // Check user if exist
      const { users, _id } = messageRoom;
      console.log('Post chatroom already exists!');
      const usersStringArray = users.map((user) => user.toString());
      if (!usersStringArray.includes(userId)) {
        console.log(`User not found in content chatroom. Adding user ${userId}`);
        users.push(userId);
        messageRoom = await MessageRoomModel.findByIdAndUpdate(_id, { users }, { new: true });
      }
    } else {
      console.log('Creating Content chatroom...');
      const messageRoomData = {
        users: [userId],
        postId: postObjectId,
        messageType: 'POST',
      };
      messageRoom = await new MessageRoomModel(messageRoomData).save();
    }
    return messageRoom;
  };
};
