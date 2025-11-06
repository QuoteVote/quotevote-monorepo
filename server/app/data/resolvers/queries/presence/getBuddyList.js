import Roster from '../../models/RosterModel';
import Presence from '../../models/PresenceModel';
import User from '../../models/UserModel';

export const getBuddyList = async (root, args, context) => {
  const { user } = context;
  if (!user) throw new Error('Authentication required');

  // Get all accepted roster entries
  const rosters = await Roster.find({
    userId: user._id,
    status: 'accepted',
  }).lean();

  // Build buddy list with presence information
  const buddiesWithPresence = await Promise.all(
    rosters.map(async (roster) => {
      const buddy = await User.findById(roster.buddyId).lean();
      
      if (!buddy) return null;

      let presence = await Presence.findOne({ userId: roster.buddyId }).lean();

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
            userId: roster.buddyId,
            status: 'offline',
            statusMessage: '',
            lastSeen: presence.lastSeen,
          };
        }
      } else {
        presence = {
          userId: roster.buddyId,
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

