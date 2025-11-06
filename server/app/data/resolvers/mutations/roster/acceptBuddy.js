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

  // Create reciprocal roster entry
  const reciprocalExists = await Roster.findOne({
    userId: user._id,
    buddyId: rosterEntry.userId,
  });

  if (!reciprocalExists) {
    await Roster.create({
      userId: user._id,
      buddyId: rosterEntry.userId,
      status: 'accepted',
      initiatedBy: rosterEntry.initiatedBy,
    });
  } else {
    reciprocalExists.status = 'accepted';
    await reciprocalExists.save();
  }

  // Notify the initiator
  await pubsub.publish('rosterEvent', {
    roster: {
      ...rosterEntry.toObject(),
      userId: rosterEntry.userId.toString(),
    },
  });

  return rosterEntry;
};

