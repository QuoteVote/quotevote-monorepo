import Presence from '../../models/PresenceModel';
import { pubsub } from '../../subscriptions';

export const updatePresence = async (root, { presence }, context) => {
  const { user } = context;
  if (!user) throw new Error('Authentication required');

  const { status, statusMessage } = presence;

  // Validate status
  const validStatuses = ['online', 'away', 'dnd', 'invisible', 'offline'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status value');
  }

  const now = new Date();
  // Update expiresAt for TTL index (5 minutes from now)
  const expiresAt = new Date(Date.now() + 300000);

  const updatedPresence = await Presence.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      status,
      statusMessage: statusMessage || '',
      // This call is the user choosing a status, so record it as their intent.
      // The cleanup job may later force `status` to offline; `preferredStatus`
      // is what the next heartbeat restores them to.
      preferredStatus: status,
      preferredStatusMessage: statusMessage || '',
      lastHeartbeat: now,
      lastSeen: now,
      expiresAt, // Explicitly set expiresAt for TTL index
    },
    { upsert: true, new: true },
  );

  // Publish presence update to subscribers (except invisible users)
  if (status !== 'invisible') {
    await pubsub.publish('presenceEvent', {
      presence: {
        userId: user._id.toString(),
        status,
        statusMessage: statusMessage || '',
        lastSeen: updatedPresence.lastSeen,
      },
    });
  }

  return updatedPresence;
};

