import MessageRoomModel from '../../models/MessageRoomModel';

export const verifyUserChatRoom = async (users) => {
  let messageRoom = await MessageRoomModel.findOne({ users: { $all: users }, messageType: 'USER' });
  if (!messageRoom) {
    const messageRoomData = { users, messageType: 'USER' };
    messageRoom = await new MessageRoomModel(messageRoomData).save();
  }
  return messageRoom;
};
