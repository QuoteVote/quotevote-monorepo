import { UserInputError, AuthenticationError } from 'apollo-server-express';
import UserModel from '../../models/UserModel';

export default (pubsub) => {
  return async (_, args, context) => {
    const { userId } = args;
    const { user } = context;

    if (!user) {
      throw new AuthenticationError('Authentication required');
    }

    // Only admins can enable users
    if (!user.admin) {
      throw new AuthenticationError('Admin access required');
    }

    try {
      const targetUser = await UserModel.findById(userId);
      if (!targetUser) {
        throw new UserInputError('User not found');
      }

      targetUser.accountStatus = 'active';
      await targetUser.save();

      return targetUser;
    } catch (error) {
      console.error('Error enabling user:', error);
      throw error;
    }
  };
};

