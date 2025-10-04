import UserModel from '../../models/UserModel';
import { AuthenticationError } from 'apollo-server-express';

export const updateUserTheme = (pubsub) => {
  return async (_, args, context) => {
    const { user } = context;
    
    if (!user) {
      throw new AuthenticationError('You must be logged in to update your theme');
    }

    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        user._id,
        { theme: args.theme },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update user theme: ${error.message}`);
    }
  };
};
