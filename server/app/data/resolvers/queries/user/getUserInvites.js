import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import UserInviteModel from '../../models/UserInviteModel';
import UserModel from '../../models/UserModel';
import { logger } from '../../../utils/logger';

export const getUserInvites = () => {
  return async (_, args, context) => {
    const { userId, status } = args || {};

    try {
      // AUTHENTICATION CHECK: Require user to be authenticated
      if (!context.user) {
        throw new AuthenticationError('Authentication required to access invite data');
      }

      // If userId is provided, return UserInvite records (invites sent by that user)
      if (userId) {
        // AUTHORIZATION CHECK: Users can only view their own invites unless they're admin
        if (userId !== context.user._id.toString() && !context.user.admin) {
          throw new ForbiddenError('You can only view your own invites');
        }

        const query = { _inviterId: userId };
        if (status) {
          query.status = status;
        }

        logger.debug('getUserInvites query (with userId)', { query, userId });
        const invites = await UserInviteModel.find(query)
          .populate('_inviterId', 'username name')
          .populate('_invitedUserId', 'username name')
          .sort({ createdAt: -1 });

        logger.debug('getUserInvites found invites', { count: invites?.length || 0, userId });
        return invites || [];
      }

      // If no userId, return prospect users (status 1) converted to UserInvite format
      // This is for the userInviteRequests query used in admin panel
      // AUTHORIZATION CHECK: Only admins can view all invite requests
      if (!context.user.admin) {
        throw new ForbiddenError('Admin access required to view all invite requests');
      }

      logger.debug('getUserInvites: fetching invite requests (status 1 and 2)');
      const prospectUsers = await UserModel.find({ status: { $in: [1, 2] } })
        .sort({ createdAt: -1 });

      logger.debug('getUserInvites found prospect users', { count: prospectUsers?.length || 0 });

      // Convert prospect users to UserInvite format
      const invites = prospectUsers.map((user) => ({
        // eslint-disable-next-line no-underscore-dangle
        _id: user._id.toString(),
        email: user.email,
        status: String(user.status),
        joined: user.joined || null,
        createdAt: user.createdAt || user.joined || new Date(),
      }));

      return invites || [];
    } catch (error) {
      logger.error('Error getting user invites', { error: error.message, stack: error.stack });
      // Re-throw authentication/authorization errors as-is
      if (error instanceof AuthenticationError || error instanceof ForbiddenError) {
        throw error;
      }
      throw new Error('Failed to get user invites');
    }
  };
};
