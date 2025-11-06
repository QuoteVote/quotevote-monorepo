import Roster from '../../models/RosterModel';
import { pubsub } from '../../subscriptions';

export const blockBuddy = async (root, { buddyId }, context) => {
  const { user } = context;
  if (!user) throw new Error('Authentication required');

  // Find or create roster entry and set to blocked
  const blockedRoster = await Roster.findOneAndUpdate(
    { userId: user._id, buddyId },
    {
      userId: user._id,
      buddyId,
      status: 'blocked',
      initiatedBy: user._id,
      updated: new Date(),
    },
    { upsert: true, new: true },
  );

  // Notify via subscription
  await pubsub.publish('rosterEvent', {
    roster: {
      ...blockedRoster.toObject(),
      userId: user._id.toString(),
    },
  });

  return blockedRoster;
};

