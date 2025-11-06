import Presence from '../../models/PresenceModel';
import RosterModel from '../../models/RosterModel';

export const getPresence = async (root, { userId }, context) => {
  const { user } = context;
  
  // Check if either user has blocked the other - don't show presence if blocked
  if (user && userId) {
    const blocked = await RosterModel.findOne({
      $or: [
        { userId: user._id, buddyId: userId, status: 'blocked' },
        { userId: userId, buddyId: user._id, status: 'blocked' },
      ],
    });

    if (blocked) {
      // Return offline status for blocked users (hide their presence)
      return {
        userId,
        status: 'offline',
        statusMessage: '',
        lastSeen: null,
        lastHeartbeat: null,
      };
    }
  }

  const presence = await Presence.findOne({ userId });

  if (!presence) {
    return {
      userId,
      status: 'offline',
      statusMessage: '',
      lastSeen: null,
      lastHeartbeat: null,
    };
  }

  // Check if heartbeat is stale (>2 minutes)
  const now = new Date();
  const timeDiff = now - new Date(presence.lastHeartbeat);
  
  if (timeDiff > 120000) {
    // Mark as offline if heartbeat is stale
    presence.status = 'offline';
  }

  return presence;
};

