import { UserInputError } from 'apollo-server-express';
import { ObjectId } from 'mongodb';
import BlocklistModel from '../../models/BlocklistModel';
import RosterModel from '../../models/RosterModel';

export const unblockUser = () => {
  return async (_, args, context) => {
    console.log('[MUTATION] unblockUser');

    const { user } = context;
    if (!user) {
      throw new UserInputError('Authentication required');
    }

    const { blockedUserId } = args;

    // Find and delete block entry
    const block = await BlocklistModel.findOneAndDelete({
      userId: user._id,
      blockedUserId: new ObjectId(blockedUserId),
    });

    if (!block) {
      throw new UserInputError('Block entry not found');
    }

    // Remove roster entries (user must re-add contact)
    await RosterModel.deleteMany({
      $or: [
        { userId: user._id, contactUserId: new ObjectId(blockedUserId) },
        { userId: new ObjectId(blockedUserId), contactUserId: user._id },
      ],
    });

    return {
      success: true,
      message: 'User unblocked successfully',
    };
  };
};
