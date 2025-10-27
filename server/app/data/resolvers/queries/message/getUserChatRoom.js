import { verifyUserChatRoom } from '~/resolvers/queries/message/verifyUserChatRoom';

export const getUserChatRoom = () => {
  return async (_, args, context) => {
    const { otherUserId } = args;
    const { user } = context;
    const userId = user._id;
    const userArgs = [userId, otherUserId];
    const messageRoom = await verifyUserChatRoom(userArgs);
    return messageRoom;
  };
};
