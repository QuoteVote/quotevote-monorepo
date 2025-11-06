import Roster from '../../models/RosterModel';
import { pubsub } from '../../subscriptions';

export const removeBuddy = async (root, { buddyId }, context) => {
  const { user } = context;
  if (!user) throw new Error('Authentication required');

  // Find and remove roster entries in both directions
  const deleted = await Roster.deleteMany({
    $or: [
      { userId: user._id, buddyId },
      { userId: buddyId, buddyId: user._id },
    ],
  });

  if (deleted.deletedCount === 0) {
    throw new Error('Buddy relationship not found');
  }

  // Notify both users via subscription
  await pubsub.publish('rosterEvent', {
    roster: {
      userId: user._id.toString(),
      buddyId,
      status: 'removed',
    },
  });

  await pubsub.publish('rosterEvent', {
    roster: {
      userId: buddyId,
      buddyId: user._id.toString(),
      status: 'removed',
    },
  });

  return {
    _id: buddyId,
    success: true,
  };
};

