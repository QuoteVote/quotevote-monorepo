import { verifyToken } from '~/utils/authentication';
import UserModel from '~/resolvers/models/UserModel';

export const verifyUserPasswordResetToken = () => {
  return async (_, args) => {
    try {
      const { token } = args;
      const verifyTokenResult = await verifyToken(token);
      const user = await UserModel.findById(verifyTokenResult._id);
      return user;
    } catch (err) {
      throw new Error(err);
    }
  };
};
