import blocklist from '../../../utils/blocklist';

/**
 * Block a user
 */
export const blockUser = () => async (root, { userId }, context) => {
  try {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const currentUserId = context.user['_id'];

    // Don't allow user to block themselves
    if (currentUserId.toString() === userId.toString()) {
      throw new Error('Cannot block yourself');
    }

    // Block the user
    await blocklist.blockUser(currentUserId, userId);

    return true;
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
};

/**
 * Unblock a user
 */
export const unblockUser = () => async (root, { userId }, context) => {
  try {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const currentUserId = context.user['_id'];

    // Unblock the user
    await blocklist.unblockUser(currentUserId, userId);

    return true;
  } catch (error) {
    console.error('Error unblocking user:', error);
    throw error;
  }
};

/**
 * Get blocked users
 */
export const getBlockedUsers = () => async (root, args, context) => {
  try {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const currentUserId = context.user['_id'];

    // Get blocked users
    const blockedUsers = await blocklist.getBlockedUsers(currentUserId);

    return blockedUsers;
  } catch (error) {
    console.error('Error getting blocked users:', error);
    throw error;
  }
};