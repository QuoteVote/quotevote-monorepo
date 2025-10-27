import { getUserPresence as getUserPresenceService } from '../../utils/presenceService';

export const getUserPresence = () => {
  return async (_, args) => {
    console.log('[QUERY] getUserPresence');

    const { userId } = args;
    const presence = await getUserPresenceService(userId);

    return {
      _id: presence._id,
      userId: presence.userId ? presence.userId.toString() : userId,
      status: presence.status,
      awayMessage: presence.awayMessage || '',
      lastHeartbeat: presence.lastHeartbeat,
      lastSeen: presence.lastSeen,
      updatedAt: presence.updatedAt,
    };
  };
};
