import Roster from '../../models/RosterModel';
import { pubsub } from '../../subscriptions';

export const declineBuddy = async (root, { rosterId }, context) => {
  const { user } = context;
  if (!user) throw new Error('Authentication required');

  // Find the pending roster entry
  const rosterEntry = await Roster.findById(rosterId);

  if (!rosterEntry) {
    throw new Error('Roster entry not found');
  }

  // Verify this user is the recipient (buddyId)
  if (rosterEntry.buddyId.toString() !== user._id.toString()) {
    throw new Error('Not authorized to decline this buddy request');
  }

  if (rosterEntry.status !== 'pending') {
    throw new Error('Buddy request is not pending');
  }

  // Delete the pending roster entry
  await Roster.deleteOne({ _id: rosterId });

  // Notify the initiator (original sender) that the request was declined
  await pubsub.publish('rosterEvent', {
    roster: {
      _id: rosterId,
      userId: rosterEntry.userId.toString(),
      buddyId: user._id.toString(),
      status: 'declined',
    },
  });

  return {
    _id: rosterId,
    success: true,
  };
};

