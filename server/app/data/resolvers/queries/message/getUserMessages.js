import { ObjectId } from 'mongodb';
import MessageModel from '../../models/MessageModel';
import MessageRoomModel from '../../models/MessageRoomModel';
import UserModel from '../../models/UserModel';

export const getUserMessages = () => {
  return async (_, args) => {
    const messageRoomObjectId = new ObjectId(args.messageRoomId);
    const messages = await MessageModel.find({ 
      messageRoomId: messageRoomObjectId,
      deleted: { $ne: true }
    });
    const messageRoom = await MessageRoomModel.findById(messageRoomObjectId);
    const messagesWithUserData = await Promise.all(
      messages.map(async (message) => {
        const {
          _id, messageRoomId, userId, title, text, created,
        } = message;
        const user = await UserModel.findOne({ _id: userId });
        
        return {
          _id,
          messageRoomId,
          userId,
          userName: user ? user.name : 'Unknown User',
          userAvatar: user ? user.avatar : '',
          title,
          text,
          created,
          type: messageRoom ? messageRoom.messageType : 'POST',
        };
      }),
    );

    return messagesWithUserData;
  };
};
