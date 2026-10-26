import { verifyToken } from '~/utils/authentication';
import UserModel from '~/resolvers/models/UserModel';

export const verifyUserPasswordResetToken = () => {
  return async (_, args) => {
    try {
      const { token } = args;
      const verifyTokenResult = await verifyToken(token);
      // Public query: return the profile fields the signup and reset pages use,
      // never the password hash or other private fields.
      const user = await UserModel.findById(verifyTokenResult._id)
        .select('_id username name email avatar')
        .lean();
      return user;
    } catch (err) {
      throw new Error(err);
    }
  };
};
