import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import UserModel from '../../models/UserModel';

export const getUsers = () => {
  return async (_, args, context) => {
    // AUTHENTICATION CHECK: Require user to be authenticated
    if (!context.user) {
      throw new AuthenticationError('Authentication required to access user data');
    }

    // AUTHORIZATION CHECK: Require admin privileges
    if (!context.user.admin) {
      throw new ForbiddenError('Admin access required to query all users');
    }

    // PAGINATION: Add pagination to prevent DoS attacks
    // Default limit of 50, max limit of 100 to prevent abuse
    const limit = Math.min(args.limit || 50, 100);
    const offset = args.offset || 0;

    // FIELD FILTERING: Exclude sensitive fields from query results
    // Exclude: hash_password, password reset tokens, internal tokens, wallet info
    const users = await UserModel.find()
      .limit(limit)
      .skip(offset)
      .select('-hash_password -__v -passwordResetToken -passwordResetExpires -_wallet')
      .sort({ joined: -1 }); // Sort by joined date (newest first)

    return users.map((user) => ({
      ...user._doc,
      userId: user._id,
    }));
  };
};
