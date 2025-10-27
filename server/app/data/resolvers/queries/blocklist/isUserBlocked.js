import { UserInputError } from 'apollo-server-express';
import { ObjectId } from 'mongodb';
import BlocklistModel from '../../models/BlocklistModel';

export const isUserBlocked = () => {
  return async (_, args, context) => {
    console.log('[QUERY] isUserBlocked');

    const { user } = context;
    if (!user) {
      throw new UserInputError('Authentication required');
    }

    const { userId } = args;

    // Check if either user has blocked the other
    const block = await BlocklistModel.findOne({
      $or: [
        { userId: user._id, blockedUserId: new ObjectId(userId) },
        { userId: new ObjectId(userId), blockedUserId: user._id },
      ],
    });

    return !!block;
  };
};
