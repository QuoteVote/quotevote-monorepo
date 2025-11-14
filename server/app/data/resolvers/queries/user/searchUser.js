import UserModel from '../../models/UserModel';
import { logger } from '../../../utils/logger';

export const searchUser = () => {
  return async (_, args, context) => {
    try {
      const queryName = args.queryName;

      if (!queryName || queryName.trim() === '') {
        return [];
      }

      // FIELD FILTERING: Exclude sensitive fields from search results
      // Exclude: hash_password, password reset tokens, internal tokens, wallet info, email
      const users = await UserModel.find({
        $or: [
          {
            username: {
              $regex: new RegExp(queryName, 'i'),
            },
          },
          {
            name: {
              $regex: new RegExp(queryName, 'i'),
            },
          }
        ],
        // Remove the exclusion of current user so you can search for yourself
        // _id: { $ne: context.user._id },
      })
      .select('-hash_password -__v -passwordResetToken -passwordResetExpires -_wallet -email')
      .limit(50); // Limit results to prevent abuse

      return users;
    } catch (error) {
      logger.error('Error in searchUser', { error: error.message, stack: error.stack, queryName: args.queryName });
      return [];
    }
  };
};
