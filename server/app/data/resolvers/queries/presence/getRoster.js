import Roster from '../../models/RosterModel';

export const getRoster = async (root, args, context) => {
  const { user } = context;
  if (!user) throw new Error('Authentication required');

  // Get all roster entries where user is either userId or buddyId
  // This includes both sent and received requests
  const rosters = await Roster.find({
    $or: [
      { userId: user._id },
      { buddyId: user._id },
    ],
  }).sort({ updated: -1 });

  return rosters;
};

