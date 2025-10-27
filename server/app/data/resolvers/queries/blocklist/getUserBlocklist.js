import { UserInputError } from 'apollo-server-express';
import BlocklistModel from '../../models/BlocklistModel';

export const getUserBlocklist = () => {
  return async (_, args, context) => {
    console.log('[QUERY] getUserBlocklist');

    const { user } = context;
    if (!user) {
      throw new UserInputError('Authentication required');
    }

    const blocklist = await BlocklistModel.find({ userId: user._id });

    return blocklist.map(b => ({
      _id: b._id,
      userId: b.userId.toString(),
      blockedUserId: b.blockedUserId.toString(),
      reason: b.reason,
      createdAt: b.createdAt,
    }));
  };
};
