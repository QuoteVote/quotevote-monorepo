import UserModel from '../models/UserModel';
import PresenceModel from '../models/PresenceModel';
import RosterModel from '../models/RosterModel';

export const rosterRelationship = () => {
  return {
    async buddy(roster, args, context) {
      // For received requests (where current user is buddyId), return the sender (userId)
      // For sent requests (where current user is userId), return the recipient (buddyId)
      const { user } = context;
      if (user && roster.buddyId?.toString() === user._id?.toString()) {
        // Current user is the recipient, return the sender
        return await UserModel.findById(roster.userId);
      }
      // Default: return the buddy (for sent requests or when no context)
      return await UserModel.findById(roster.buddyId);
    },
    async presence(roster, args, context) {
      const { user } = context;
      // Get presence for the "other" user (not the current user)
      let targetUserId = roster.buddyId;
      
      // If current user is the buddyId, get presence for userId (the sender)
      if (user && roster.buddyId?.toString() === user._id?.toString()) {
        targetUserId = roster.userId;
      }
      
      // Check if either user has blocked the other - don't show presence if blocked
      if (user && targetUserId) {
        const blocked = await RosterModel.findOne({
          $or: [
            { userId: user._id, buddyId: targetUserId, status: 'blocked' },
            { userId: targetUserId, buddyId: user._id, status: 'blocked' },
          ],
        });

        if (blocked) {
          // Return offline status for blocked users (hide their presence)
          return {
            userId: targetUserId,
            status: 'offline',
            statusMessage: '',
            lastSeen: null,
          };
        }
      }
      
      const presence = await PresenceModel.findOne({ userId: targetUserId });
      
      if (!presence) {
        return {
          userId: targetUserId,
          status: 'offline',
          statusMessage: '',
          lastSeen: null,
        };
      }

      // Check if heartbeat is stale
      const now = new Date();
      const timeDiff = now - new Date(presence.lastHeartbeat);
      
      if (timeDiff > 120000) {
        presence.status = 'offline';
      }

      // Hide invisible users
      if (presence.status === 'invisible') {
        return {
          userId: targetUserId,
          status: 'offline',
          statusMessage: '',
          lastSeen: presence.lastSeen,
        };
      }

      return presence;
    },
  };
};

