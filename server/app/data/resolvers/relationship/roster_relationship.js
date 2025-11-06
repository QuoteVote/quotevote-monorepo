import UserModel from '../models/UserModel';
import PresenceModel from '../models/PresenceModel';

export const rosterRelationship = () => {
  return {
    async buddy(roster) {
      return await UserModel.findById(roster.buddyId);
    },
    async presence(roster) {
      const presence = await PresenceModel.findOne({ userId: roster.buddyId });
      
      if (!presence) {
        return {
          userId: roster.buddyId,
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
          userId: roster.buddyId,
          status: 'offline',
          statusMessage: '',
          lastSeen: presence.lastSeen,
        };
      }

      return presence;
    },
  };
};

