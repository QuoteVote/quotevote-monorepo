import { setPresence, presenceSet } from '../../../utils/presenceService';

export const setPresenceStatus = () => async (root, { userId, status, text }, context) => {
  try {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }
    const presence = await setPresence(userId, status, text);
    return presence;
  } catch (error) {
    console.error('Error setting presence:', error);
    throw error;
  }
};

export const setPresenceForCurrentUser = () => async (root, { status, text }, context) => {
  try {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }
    // Get userId from context (authenticated user)
    const userId = context.user['_id'];
    const presence = await presenceSet(userId, status, text);
    return presence;
  } catch (error) {
    console.error('Error setting presence for current user:', error);
    throw error;
  }
};
