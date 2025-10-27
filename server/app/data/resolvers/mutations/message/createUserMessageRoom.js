import UserModel from '../../models/UserModel';
import MessageRoomModel from '../../models/MessageRoomModel';

// eslint-disable-next-line import/prefer-default-export
export const createUserMessageRoom = async (args, context) => {
  try {
    const { user } = context;
    const {
      componentId, type,
    } = args.message;
    // eslint-disable-next-line no-underscore-dangle
    const userId = user._id;
    const users = [userId, componentId];
    let userMessageRoom = await MessageRoomModel.findOne({ users: { $all: users }, messageType: type });
    if (!userMessageRoom) {
      console.log('Creating user chatroom...');
      const messageRoomData = { users, messageType: type };
      userMessageRoom = await new MessageRoomModel(messageRoomData).save();
    }

    return userMessageRoom;
  } catch (err) {
    throw new Error(err);
  }
};
