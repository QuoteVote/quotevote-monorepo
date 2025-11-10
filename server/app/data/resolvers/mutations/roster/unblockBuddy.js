import Roster from '../../models/RosterModel';
import { pubsub } from '../../subscriptions';

export const unblockBuddy = async (root, { buddyId }, context) => {
  const { user } = context;
  if (!user) throw new Error('Authentication required');

  // Find the blocked roster entry
  const rosterEntry = await Roster.findOne({
    userId: user._id,
    buddyId,
    status: 'blocked',
  });

  if (!rosterEntry) {
    throw new Error('No blocked entry found for this user');
  }

  // Remove the roster entry (unblock)
  await Roster.deleteOne({ _id: rosterEntry._id });

  // Notify via subscription
  await pubsub.publish('rosterEvent', {
    roster: {
      _id: rosterEntry._id.toString(),
      userId: user._id.toString(),
      buddyId,
      status: 'removed',
    },
  });

  return rosterEntry;
};

