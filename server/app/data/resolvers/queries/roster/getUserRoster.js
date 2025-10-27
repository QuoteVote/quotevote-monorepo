import { UserInputError } from 'apollo-server-express';
import RosterModel from '../../models/RosterModel';

export const getUserRoster = () => {
  return async (_, args, context) => {
    console.log('[QUERY] getUserRoster');

    const { user } = context;
    if (!user) {
      throw new UserInputError('Authentication required');
    }

    const roster = await RosterModel.find({
      userId: user._id,
      status: 'accepted',
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
