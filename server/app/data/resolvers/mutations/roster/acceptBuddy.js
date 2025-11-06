import Roster from '../../models/RosterModel';
import { pubsub } from '../../subscriptions';

export const acceptBuddy = async (root, { rosterId }, context) => {
  const { user } = context;
  if (!user) throw new Error('Authentication required');

  // Find the pending roster entry
  const rosterEntry = await Roster.findById(rosterId);

  if (!rosterEntry) {
    throw new Error('Roster entry not found');
  }

  // Verify this user is the recipient (buddyId)
  if (rosterEntry.buddyId.toString() !== user._id.toString()) {
    throw new Error('Not authorized to accept this buddy request');
  }

  if (rosterEntry.status !== 'pending') {
    throw new Error('Buddy request is not pending');
  }

  // Update status to accepted
  rosterEntry.status = 'accepted';
  rosterEntry.updated = new Date();
  await rosterEntry.save();

  // Create or update reciprocal roster entry
  let reciprocalRoster = await Roster.findOne({
    userId: user._id,
    buddyId: rosterEntry.userId,
  });

  if (!reciprocalRoster) {
    reciprocalRoster = await Roster.create({
      userId: user._id,
      buddyId: rosterEntry.userId,
      status: 'accepted',
      initiatedBy: rosterEntry.initiatedBy,
    });
  } else {
    reciprocalRoster.status = 'accepted';
    reciprocalRoster.updated = new Date();
    await reciprocalRoster.save();
  }

  // Notify the initiator (original sender) about the acceptance
  await pubsub.publish('rosterEvent', {
    roster: {
      ...rosterEntry.toObject(),
      userId: rosterEntry.userId.toString(),
    },
  });

  // Also notify the accepter (current user) about the reciprocal entry
  await pubsub.publish('rosterEvent', {
    roster: {
      ...reciprocalRoster.toObject(),
      userId: user._id.toString(),
    },
  });

  return rosterEntry;
};

