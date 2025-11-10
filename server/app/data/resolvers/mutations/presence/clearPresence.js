import Presence from '../../models/PresenceModel';
import { pubsub } from '../../subscriptions';

export const clearPresence = async (root, args, context) => {
  const { user } = context;
  if (!user) throw new Error('Authentication required');

  // Set status to offline
  await Presence.findOneAndUpdate(
    { userId: user._id },
    {
      status: 'offline',
      lastSeen: new Date(),
    },
    { new: true },
  );

  // Publish offline status
  await pubsub.publish('presenceEvent', {
    presence: {
      userId: user._id.toString(),
      status: 'offline',
      statusMessage: '',
      lastSeen: new Date(),
    },
  });

  return true;
};

