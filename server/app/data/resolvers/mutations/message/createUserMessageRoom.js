import UserModel from '../../models/UserModel';
import MessageRoomModel from '../../models/MessageRoomModel';
import RosterModel from '../../models/RosterModel';

// eslint-disable-next-line import/prefer-default-export
export const createUserMessageRoom = async (args, context) => {
  try {
    const { user } = context;
    const {
      componentId, type,
    } = args.message;
    // eslint-disable-next-line no-underscore-dangle
    const userId = user._id;
    const recipientId = componentId;

    // Check for mutual roster acceptance (buddy requirement for DMs)
    const mutualRoster = await RosterModel.findOne({
      $or: [
        { userId, buddyId: recipientId, status: 'accepted' },
        { userId: recipientId, buddyId: userId, status: 'accepted' },
      ],
    });

    // Allow admins to bypass roster check
    const currentUser = await UserModel.findById(userId);
    if (!mutualRoster && !currentUser.admin) {
      throw new Error('Cannot send DM: must be mutual buddies');
    }

    // Check if either user has blocked the other
    const blocked = await RosterModel.findOne({
      $or: [
        { userId, buddyId: recipientId, status: 'blocked' },
        { userId: recipientId, buddyId: userId, status: 'blocked' },
      ],
    });

    if (blocked) {
      throw new Error('Cannot send message: user is blocked');
    }

    const users = [userId, componentId];
    let userMessageRoom = await MessageRoomModel.findOne({ users: { $all: users }, messageType: type });
    if (!userMessageRoom) {
      console.log('Creating user chatroom...');
      const messageRoomData = { 
        users, 
        messageType: type,
        isDirect: true,
        lastActivity: new Date(),
      };
      userMessageRoom = await new MessageRoomModel(messageRoomData).save();
    }

    return userMessageRoom;
  } catch (err) {
    throw new Error(err);
  }
};
