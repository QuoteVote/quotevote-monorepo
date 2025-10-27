import UsersModel from '../../models/UserModel';
import { uniqueArrayObjects } from '../../utils/common_utils';
import MessageModel from '../../models/MessageModel';
import { verifyUserChatRoom } from './verifyUserChatRoom';

export const getUserBuddyList = (pubsub) => {
  return async (_, args, context) => {
    const userId = context.user._id;
    const user = await UsersModel.findOne({ _id: userId });
    const { _followingId } = user;
    const buddyList = [];
    for (const followingUserId of uniqueArrayObjects(_followingId)) {
      const followedUser = await UsersModel.findOne({ _id: followingUserId }, { name: 1, avatar: 1 });
      const userArgs = [userId, followingUserId];
      const messageRoom = await verifyUserChatRoom(userArgs);
      const lastMessage = await MessageModel.findOne({
        $query: { messageRoomId: messageRoom._id },
        $orderby: { $natural: -1 },
      });
      const { _id, name, avatar } = followedUser;
      buddyList.push({
        buddyId: _id, name, avatar, messageRoom, lastMessage,
      });
    }
    return buddyList;
  };
};
