import { UserInputError } from 'apollo-server-express';
import { sendHeartbeat as sendHeartbeatService } from '../../utils/presenceService';

export const sendHeartbeat = () => {
  return async (_, args, context) => {
    console.log('[MUTATION] sendHeartbeat');

    const { user } = context;
    if (!user) {
      throw new UserInputError('Authentication required');
    }

    const presence = await sendHeartbeatService(user._id);

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
