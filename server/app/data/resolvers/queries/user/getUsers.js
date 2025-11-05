import UserModel from '../../models/UserModel';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';

export const getUsers = () => {
  return async (_, args, context) => {
    // ✅ ADD AUTHENTICATION CHECK
    if (!context.user) {
      throw new AuthenticationError('Authentication required');
    }
    
    // ✅ ADD ADMIN ROLE CHECK
    if (!context.user.admin) {
      throw new ForbiddenError('Admin access required');
    }
    
    // ✅ ADD PAGINATION LIMITS
    const { limit = 50, offset = 0 } = args;
    
    // ✅ ADD FIELD FILTERING TO EXCLUDE SENSITIVE DATA
    const users = await UserModel.find()
      .limit(limit)
      .skip(offset)
      .select('-__v -passwordResetToken -passwordResetExpires -emailVerificationToken');
    
    return users.map((user) => ({
      ...user._doc,
      userId: user._id,
    }));
  };
};
