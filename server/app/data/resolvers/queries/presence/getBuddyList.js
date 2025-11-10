import Roster from '../../models/RosterModel';
import Presence from '../../models/PresenceModel';
import User from '../../models/UserModel';

export const getBuddyList = async (root, args, context) => {
  const { user } = context;
  if (!user) throw new Error('Authentication required');

  // Get all accepted roster entries where user is involved
  // After acceptance, both users should see each other in their buddy lists
  const rosters = await Roster.find({
    $or: [
      { userId: user._id, status: 'accepted' },
      { buddyId: user._id, status: 'accepted' },
    ],
  }).lean();

  // Filter out blocked users and ensure we have unique buddies
  const validRosters = [];
  const seenBuddyIds = new Set();
  
  for (const roster of rosters) {
    const isUserInitiated = roster.userId.toString() === user._id.toString();
    const otherUserId = isUserInitiated ? roster.buddyId : roster.userId;
    const buddyIdStr = otherUserId.toString();
    
    // Skip if we've already processed this buddy
    if (seenBuddyIds.has(buddyIdStr)) continue;
    
    // Check if either user has blocked the other
    const blocked = await Roster.findOne({
      $or: [
        { userId: user._id, buddyId: otherUserId, status: 'blocked' },
        { userId: otherUserId, buddyId: user._id, status: 'blocked' },
      ],
    });

    // Only include if not blocked
    if (!blocked) {
      validRosters.push(roster);
      seenBuddyIds.add(buddyIdStr);
    }
  }

  // Build buddy list with presence information
  const buddiesWithPresence = await Promise.all(
    validRosters.map(async (roster) => {
      // Determine the buddy ID (the other user, not the current user)
      const isUserInitiated = roster.userId.toString() === user._id.toString();
      const buddyId = isUserInitiated ? roster.buddyId : roster.userId;
      
      const buddy = await User.findById(buddyId).lean();
      
      if (!buddy) return null;

      let presence = await Presence.findOne({ userId: buddyId }).lean();

      // Check if presence is stale
      if (presence) {
        const now = new Date();
        const timeDiff = now - new Date(presence.lastHeartbeat);
        
        if (timeDiff > 120000) {
          presence.status = 'offline';
        }

        // Hide invisible users
        if (presence.status === 'invisible') {
          presence = {
            userId: buddyId,
            status: 'offline',
            statusMessage: '',
            lastSeen: presence.lastSeen,
          };
        }
      } else {
        presence = {
          userId: buddyId,
          status: 'offline',
          statusMessage: '',
          lastSeen: null,
        };
      }

      return {
        user: buddy,
        roster,
        presence,
      };
    }),
  );

  // Filter out null entries (deleted users)
  return buddiesWithPresence.filter((b) => b !== null);
};

