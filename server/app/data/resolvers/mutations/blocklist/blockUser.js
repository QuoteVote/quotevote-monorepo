import { UserInputError } from 'apollo-server-express';
import { ObjectId } from 'mongodb';
import BlocklistModel from '../../models/BlocklistModel';
import RosterModel from '../../models/RosterModel';
import UserModel from '../../models/UserModel';

export const blockUser = () => {
  return async (_, args, context) => {
    console.log('[MUTATION] blockUser');

    const { user } = context;
    if (!user) {
      throw new UserInputError('Authentication required');
    }

    const { blockedUserId, reason } = args.block;

    // Validate blocked user exists
    const blockedUser = await UserModel.findById(blockedUserId);
    if (!blockedUser) {
      throw new UserInputError('User not found');
    }

    // Can't block yourself
    if (user._id.toString() === blockedUserId) {
      throw new UserInputError('Cannot block yourself');
    }

    // Check if already blocked
    const existingBlock = await BlocklistModel.findOne({
      userId: user._id,
      blockedUserId: new ObjectId(blockedUserId),
    });

    if (existingBlock) {
      throw new UserInputError('User already blocked');
    }

    // Create block entry
    const block = await new BlocklistModel({
      userId: user._id,
      blockedUserId: new ObjectId(blockedUserId),
      reason: reason || '',
    }).save();

    // Update roster entries to blocked status
    await RosterModel.updateMany(
      {
        $or: [
          { userId: user._id, contactUserId: new ObjectId(blockedUserId) },
          { userId: new ObjectId(blockedUserId), contactUserId: user._id },
        ],
      },
      { status: 'blocked', updatedAt: new Date() }
    );

    return {
      _id: block._id,
      userId: block.userId.toString(),
      blockedUserId: block.blockedUserId.toString(),
      reason: block.reason,
      createdAt: block.createdAt,
    };
  };
};
