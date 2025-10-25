import mongoose from 'mongoose';
import { AuthenticationError } from 'apollo-server-express';
import ChatPresenceModel from '~/resolvers/models/ChatPresenceModel';
import ChatRosterModel from '~/resolvers/models/ChatRosterModel';
import UserModel from '~/resolvers/models/UserModel';

export const getMyBuddyList = () => {
  return async (_, __, context) => {
    const { user } = context;
    if (!user || !user._id) {
      throw new AuthenticationError('Authentication required');
    }

    const userId = mongoose.Types.ObjectId(user._id);
    const roster = await ChatRosterModel.findOne({ userId }).lean();
    const buddyIds = roster?.buddies || [];

    if (!buddyIds.length) {
      return [];
    }

    const [presenceDocs, rosterDocs, users] = await Promise.all([
      ChatPresenceModel.find({ userId: { $in: buddyIds } }).lean(),
      ChatRosterModel.find({ userId: { $in: buddyIds } }).lean(),
      UserModel.find({ _id: { $in: buddyIds } }).lean(),
    ]);
    const presenceMap = presenceDocs.reduce((acc, doc) => {
      acc.set(doc.userId.toString(), doc);
      return acc;
    }, new Map());
    const rosterMap = rosterDocs.reduce((acc, doc) => {
      acc.set(doc.userId.toString(), doc);
      return acc;
    }, new Map());

    return users.map((buddy) => {
      const presence = presenceMap.get(buddy._id.toString());
      const buddyRoster = rosterMap.get(buddy._id.toString());
      return {
        userId: buddy._id,
        username: buddy.username || buddy.name || 'Unknown User',
        presence: presence ? {
          _id: presence._id,
          userId: presence.userId,
          state: presence.state,
          statusText: presence.statusText,
          updatedAt: presence.updatedAt,
        } : null,
        statusText: presence?.statusText || buddyRoster?.statusText || null,
      };
    });
  };
};
