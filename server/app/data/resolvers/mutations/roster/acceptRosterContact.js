import { UserInputError } from 'apollo-server-express';
import { ObjectId } from 'mongodb';
import RosterModel from '../../models/RosterModel';
import { pubsub } from '../../subscriptions';

export const acceptRosterContact = () => {
  return async (_, args, context) => {
    console.log('[MUTATION] acceptRosterContact');

    const { user } = context;
    if (!user) {
      throw new UserInputError('Authentication required');
    }

    const { contactUserId } = args;

    // Find the roster entry
    const roster = await RosterModel.findOne({
      userId: user._id,
      contactUserId: new ObjectId(contactUserId),
      status: 'pending',
    });

    if (!roster) {
      throw new UserInputError('Roster request not found');
    }

    // Update both roster entries to accepted
    await RosterModel.updateMany(
      {
        $or: [
          { userId: user._id, contactUserId: new ObjectId(contactUserId) },
          { userId: new ObjectId(contactUserId), contactUserId: user._id },
        ],
      },
      { status: 'accepted', updatedAt: new Date() }
    );

    const updatedRoster = await RosterModel.findById(roster._id);

    // Publish roster update to both users
    await pubsub.publish('rosterUpdate', {
      rosterUpdate: {
        _id: updatedRoster._id,
        userId: updatedRoster.userId.toString(),
        contactUserId: updatedRoster.contactUserId.toString(),
        status: updatedRoster.status,
        initiatedBy: updatedRoster.initiatedBy.toString(),
        createdAt: updatedRoster.createdAt,
        updatedAt: updatedRoster.updatedAt,
      },
    });

    return {
      _id: updatedRoster._id,
      userId: updatedRoster.userId.toString(),
      contactUserId: updatedRoster.contactUserId.toString(),
      status: updatedRoster.status,
      initiatedBy: updatedRoster.initiatedBy.toString(),
      createdAt: updatedRoster.createdAt,
      updatedAt: updatedRoster.updatedAt,
    };
  };
};
