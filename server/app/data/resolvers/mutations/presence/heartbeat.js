import Presence from '../../models/PresenceModel';
import { pubsub } from '../../subscriptions';

export const heartbeat = async (root, args, context) => {
  const { user } = context;
  if (!user) throw new Error('Authentication required');

  const now = new Date();
  // Update expiresAt for TTL index (5 minutes from now)
  const expiresAt = new Date(Date.now() + 300000);

  const presence = await Presence.findOneAndUpdate(
    { userId: user._id },
    {
      lastHeartbeat: now,
      lastSeen: now,
      expiresAt, // Explicitly set expiresAt for TTL index
      $setOnInsert: {
        userId: user._id,
        status: 'online',
        statusMessage: '',
      },
    },
    { upsert: true, new: true },
  );

  // The user is demonstrably here, so the cleanup job should not leave them
  // marked offline. Restore the status they chose, falling back to online if
  // they never chose one. A user who deliberately chose 'offline' is left
  // alone — that is intent, not staleness.
  if (presence.status === 'offline' && presence.preferredStatus !== 'offline') {
    presence.status = presence.preferredStatus || 'online';
    presence.statusMessage = presence.preferredStatusMessage || '';
    await presence.save();

    // Tell subscribers they are back, mirroring the offline event the cleanup
    // job publishes. Invisible users are not announced.
    if (presence.status !== 'invisible') {
      await pubsub.publish('presenceEvent', {
        presence: {
          userId: presence.userId.toString(),
          status: presence.status,
          statusMessage: presence.statusMessage,
          lastSeen: presence.lastSeen,
        },
      });
    }
  }

  return {
    success: true,
    timestamp: presence.lastHeartbeat,
    status: presence.status,
    statusMessage: presence.statusMessage,
  };
};

