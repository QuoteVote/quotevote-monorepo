import Roster from '../../models/RosterModel';
import User from '../../models/UserModel';
import { pubsub } from '../../subscriptions';

export const addBuddy = async (root, { roster }, context) => {
  const { user } = context;
  if (!user) throw new Error('Authentication required');

  const { buddyId } = roster;

  // Don't allow adding yourself
  if (buddyId === user._id.toString()) {
    throw new Error('Cannot add yourself as a buddy');
  }

  // Verify buddy exists
  const buddy = await User.findById(buddyId);
  if (!buddy) throw new Error('User not found');

  // Check if already exists in either direction
  const existing = await Roster.findOne({
    $or: [
      { userId: user._id, buddyId },
      { userId: buddyId, buddyId: user._id },
    ],
  });

  if (existing) {
    if (existing.status === 'blocked') {
      throw new Error('Cannot add buddy: user is blocked');
    }
    throw new Error('Buddy relationship already exists');
  }

  // Create roster entry
  const newRoster = await Roster.create({
    userId: user._id,
    buddyId,
    status: 'pending',
    initiatedBy: user._id,
  });

  // Notify buddy via subscription
  await pubsub.publish('rosterEvent', {
    roster: {
      ...newRoster.toObject(),
      userId: buddyId.toString(),
    },
  });

  return newRoster;
};

