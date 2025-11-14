import UserModel from '../../models/UserModel';
import { logger } from '../../../utils/logger';

/**
 * Find users by email with duplicate detection
 * @param {Object} args - Query arguments
 * @param {string} args.email - Email address to search for
 * @param {Object} context - GraphQL context
 * @returns {Array} Array of users with the given email
 */
export const findUserByEmail = () => {
  return async (_, args, context) => {
    try {
      const { email } = args;

      // Validate email parameter
      if (!email) {
        throw new Error('Email parameter is required');
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      // Find all users with the given email (case-insensitive)
      const duplicateUsers = await UserModel.find({
        email: { $regex: new RegExp(`^${email}$`, 'i') },
      });

      logger.debug('Found users with email', { email, count: duplicateUsers.length });

      // Check if any users have status 1 (prospect/not yet invited)
      const hasProspectUser = duplicateUsers.some((user) => Number(user.status) === 1);

      if (hasProspectUser) {
        logger.debug('Found prospect user - not yet invited', { email });
        return [];
      }

      // Return duplicate users with additional metadata
      return duplicateUsers.map((user) => ({
        ...user.toObject(),
        isDuplicate: duplicateUsers.length > 1,
        duplicateCount: duplicateUsers.length,
        userStatus: user.status,
        createdAt: user.created,
        lastLogin: user.lastLogin || null,
      }));
    } catch (err) {
      logger.error('Error in findUserByEmail', { error: err.message, stack: err.stack, email });
      throw new Error(`Failed to find users by email: ${err.message}`);
    }
  };
};

/**
 * Enhanced duplicate user detection with more detailed information
 * @param {string} email - Email address to check
 * @returns {Object} Detailed duplicate user information
 */
export const getDuplicateUserInfo = async (email) => {
  try {
    const users = await UserModel.find({
      email: { $regex: new RegExp(`^${email}$`, 'i') },
    });

    const duplicateInfo = {
      email,
      totalUsers: users.length,
      isDuplicate: users.length > 1,
      users: users.map((user) => ({
        id: user._id,
        username: user.username,
        status: user.status,
        statusText: getStatusText(user.status),
        createdAt: user.created,
        lastLogin: user.lastLogin,
        isActive: user.status === 2, // Assuming status 2 is active
        isProspect: user.status === 1,
        isInactive: user.status === 0,
      })),
      summary: {
        activeUsers: users.filter((u) => u.status === 2).length,
        prospectUsers: users.filter((u) => u.status === 1).length,
        inactiveUsers: users.filter((u) => u.status === 0).length,
      },
    };

    return duplicateInfo;
  } catch (err) {
    logger.error('Error in getDuplicateUserInfo', { error: err.message, stack: err.stack, email });
    throw new Error(`Failed to get duplicate user info: ${err.message}`);
  }
};

/**
 * Helper function to get status text
 * @param {number} status - User status code
 * @returns {string} Status description
 */
const getStatusText = (status) => {
  switch (Number(status)) {
    case 0:
      return 'Inactive';
    case 1:
      return 'Prospect (Not Invited)';
    case 2:
      return 'Active';
    default:
      return 'Unknown';
  }
};
