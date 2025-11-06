import Presence from '../../models/PresenceModel';

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

  return {
    success: true,
    timestamp: presence.lastHeartbeat,
  };
};

