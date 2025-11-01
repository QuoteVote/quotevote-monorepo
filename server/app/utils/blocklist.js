import UserModel from '../data/resolvers/models/UserModel';
import { logger } from '../data/utils/logger';

/**
 * Blocklist utility for managing user blocking functionality
 */
class Blocklist {
  /**
   * Block a user
   * @param {string} userId - The user ID doing the blocking
   * @param {string} blockedUserId - The user ID being blocked
   * @returns {Promise<boolean>} - True if successful
   */
  async blockUser(userId, blockedUserId) {
    try {
      // Add blocked user to the user's blocked list
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Initialize blockedUserIds array if it doesn't exist
      if (!user.blockedUserIds) {
        user.blockedUserIds = [];
      }

      // Check if user is already blocked
      const isAlreadyBlocked = user.blockedUserIds.some(
        (id) => id.toString() === blockedUserId.toString()
      );

      if (!isAlreadyBlocked) {
        user.blockedUserIds.push(blockedUserId);
        await user.save();
      }

      return true;
    } catch (error) {
      logger.error('Error blocking user:', error);
      throw error;
    }
  }

  /**
   * Unblock a user
   * @param {string} userId - The user ID doing the unblocking
   * @param {string} blockedUserId - The user ID being unblocked
   * @returns {Promise<boolean>} - True if successful
   */
  async unblockUser(userId, blockedUserId) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Remove blocked user from the user's blocked list
      if (user.blockedUserIds) {
        user.blockedUserIds = user.blockedUserIds.filter(
          (id) => id.toString() !== blockedUserId.toString()
        );
        await user.save();
      }

      return true;
    } catch (error) {
      logger.error('Error unblocking user:', error);
      throw error;
    }
  }

  /**
   * Check if a user is blocked by another user
   * @param {string} userId - The user ID that might be doing the blocking
   * @param {string} blockedUserId - The user ID that might be blocked
   * @returns {Promise<boolean>} - True if blocked
   */
  async isUserBlocked(userId, blockedUserId) {
    try {
      const user = await UserModel.findById(userId);
      if (!user || !user.blockedUserIds) {
        return false;
      }

      return user.blockedUserIds.some(
        (id) => id.toString() === blockedUserId.toString()
      );
    } catch (error) {
      logger.error('Error checking if user is blocked:', error);
      // Fail secure - assume not blocked if there's an error
      return false;
    }
  }

  /**
   * Get list of blocked users for a user
   * @param {string} userId - The user ID
   * @returns {Promise<Array>} - Array of blocked user IDs
   */
  async getBlockedUsers(userId) {
    try {
      const user = await UserModel.findById(userId);
      if (!user || !user.blockedUserIds) {
        return [];
      }

      return user.blockedUserIds.map(id => id.toString());
    } catch (error) {
      logger.error('Error getting blocked users:', error);
      return [];
    }
  }
}

export const blocklist = new Blocklist();
export default blocklist;