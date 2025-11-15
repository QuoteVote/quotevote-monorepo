import { UserInputError, AuthenticationError } from 'apollo-server-express';
import UserModel from '../../models/UserModel';

export default (pubsub) => {
  return async (_, args, context) => {
    const { userId } = args;
    const { user } = context;

    if (!user) {
      throw new AuthenticationError('Authentication required');
    }

    // Only admins can disable users
    if (!user.admin) {
      throw new AuthenticationError('Admin access required');
    }

    try {
      const targetUser = await UserModel.findById(userId);
      if (!targetUser) {
        throw new UserInputError('User not found');
      }

      // Don't allow disabling admin accounts
      if (targetUser.admin) {
        throw new UserInputError('Cannot disable admin accounts');
      }

      targetUser.accountStatus = 'disabled';
      await targetUser.save();

      return targetUser;
    } catch (error) {
      console.error('Error disabling user:', error);
      throw error;
    }
  };
};

