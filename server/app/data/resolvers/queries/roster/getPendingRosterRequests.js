import { UserInputError } from 'apollo-server-express';
import RosterModel from '../../models/RosterModel';

export const getPendingRosterRequests = () => {
  return async (_, args, context) => {
    console.log('[QUERY] getPendingRosterRequests');

    const { user } = context;
    if (!user) {
      throw new UserInputError('Authentication required');
    }

    // Get pending requests where the current user is NOT the initiator
    const roster = await RosterModel.find({
      userId: user._id,
      status: 'pending',
      initiatedBy: { $ne: user._id },
    });

    return roster.map(r => ({
      _id: r._id,
      userId: r.userId.toString(),
      contactUserId: r.contactUserId.toString(),
      status: r.status,
      initiatedBy: r.initiatedBy.toString(),
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  };
};
