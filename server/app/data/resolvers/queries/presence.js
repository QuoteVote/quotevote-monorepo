import { getPresence, presenceOnlineUsers } from '../../../utils/presenceService';

export const getPresenceById = () => async (root, { userId }, context) => {
  try {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }
    const presence = await getPresence(userId);
    return presence;
  } catch (error) {
    console.error('Error fetching presence:', error);
    throw error;
  }
};

export const getPresenceOnlineUsers = () => async (root, args, context) => {
  try {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }
    const presenceUsers = await presenceOnlineUsers();
    return presenceUsers;
  } catch (error) {
    console.error('Error fetching online users presence:', error);
    throw error;
  }
};
