import { UserInputError } from 'apollo-server-express';
import { updateUserPresence } from '../../utils/presenceService';
import { checkRateLimit } from '../../utils/rateLimiter';

export const updatePresence = () => {
  return async (_, args, context) => {
    console.log('[MUTATION] updatePresence');

    const { user } = context;
    if (!user) {
      throw new UserInputError('Authentication required');
    }

    const { status, awayMessage } = args.presence;

    // Validate status
    const validStatuses = ['online', 'away', 'dnd', 'invisible', 'offline'];
    if (!validStatuses.includes(status)) {
      throw new UserInputError('Invalid status', {
        invalidArgs: ['status'],
      });
    }

    // Check rate limit
    const rateLimitExceeded = await checkRateLimit(user._id.toString(), 'presence_update');
    if (rateLimitExceeded) {
      throw new UserInputError('Rate limit exceeded. Please try again later.');
    }

    // Update presence
    const presence = await updateUserPresence(
      user._id,
      status,
      awayMessage || ''
    );

    return {
      _id: presence._id,
      userId: presence.userId.toString(),
      status: presence.status,
      awayMessage: presence.awayMessage,
      lastHeartbeat: presence.lastHeartbeat,
      lastSeen: presence.lastSeen,
      updatedAt: presence.updatedAt,
    };
  };
};
