import UserModel from '../../models/UserModel';
import { logger } from '../../../utils/logger';

/**
 * Check the status of an email address for the eyebrow CTA flow.
 * Returns one of: "registered", "not_requested", "requested_pending", "approved_no_password"
 */
export const checkEmailStatus = () => {
  return async (_, args, context) => {
    try {
      const { email } = args;
      const requestId = context && context.requestId;

      logger.debug('checkEmailStatus called', {
        requestId,
        email,
      });

      if (!email) {
        throw new Error('Email parameter is required');
      }

      const user = await UserModel.findOne({
        email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      });

      if (!user) {
        logger.debug('checkEmailStatus result', {
          requestId,
          email,
          status: 'not_requested',
          hasUser: false,
        });
        return { status: 'not_requested' };
      }

      // Status 1 = Prospect (requested invite, pending approval)
      // Status 2 = Declined — treat as re-requestable
      if (user.status === 1 || user.status === 2) {
        logger.debug('checkEmailStatus result', {
          requestId,
          email,
          status: 'requested_pending',
          hasUser: true,
          userStatus: user.status,
          hasPassword: !!user.hash_password,
        });
        return { status: 'requested_pending' };
      }

      // Status 4 = Approved but hasn't set up password yet
      if (user.status === 4 && !user.hash_password) {
        logger.debug('checkEmailStatus result', {
          requestId,
          email,
          status: 'approved_no_password',
          hasUser: true,
          userStatus: user.status,
          hasPassword: !!user.hash_password,
        });
        return { status: 'approved_no_password' };
      }

      // User has a password set — they are a registered user
      if (user.hash_password) {
        logger.debug('checkEmailStatus result', {
          requestId,
          email,
          status: 'registered',
          hasUser: true,
          userStatus: user.status,
          hasPassword: !!user.hash_password,
        });
        return { status: 'registered' };
      }

      // Fallback for any other state
      logger.debug('checkEmailStatus result', {
        requestId,
        email,
        status: 'not_requested',
        hasUser: true,
        userStatus: user.status,
        hasPassword: !!user.hash_password,
      });
      return { status: 'not_requested' };
    } catch (err) {
      logger.error('Error in checkEmailStatus', {
        error: err.message,
        email: args.email,
        requestId: context && context.requestId,
      });
      throw new Error(`Failed to check email status: ${err.message}`);
    }
  };
};
