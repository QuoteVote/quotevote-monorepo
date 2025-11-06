import Presence from '../../models/PresenceModel';

export const getPresence = async (root, { userId }) => {
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

