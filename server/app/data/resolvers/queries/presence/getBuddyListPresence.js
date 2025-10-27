import { getBuddyListPresence as getBuddyListPresenceService } from '../../utils/presenceService';

export const getBuddyListPresence = () => {
  return async (_, args) => {
    console.log('[QUERY] getBuddyListPresence');

    const { userIds } = args;
    const presences = await getBuddyListPresenceService(userIds);

    return presences.map(p => ({
      _id: p._id,
      userId: p.userId ? p.userId.toString() : p.userId,
      status: p.status,
      awayMessage: p.awayMessage || '',
      lastHeartbeat: p.lastHeartbeat,
      lastSeen: p.lastSeen,
      updatedAt: p.updatedAt,
    }));
  };
};
