import { UserInputError } from 'apollo-server-express';
import UserModel from '../../models/UserModel';
import { logger } from '../../../utils/logger';
import { generateHashPassword, verifyToken } from '~/utils/authentication';

export const updateUserPassword = (pubsub) => {
  return async (_, args) => {
    try {
      const { username, password, token } = args;
      const userAuth = await verifyToken(token);
      // The token decides whose password changes. A token issued for one account
      // must never set another account's password, so the username has to match it.
      // eslint-disable-next-line no-underscore-dangle
      const tokenUserId = userAuth && userAuth._id;
      const user = tokenUserId
        ? await UserModel.findById(tokenUserId).select('_id username')
        : null;
      if (!user || user.username !== username) {
        throw new UserInputError('Invalid or expired reset link', {
          invalidArgs: Object.keys(args),
        });
      }
      const hash_password = generateHashPassword(password);
      // eslint-disable-next-line no-underscore-dangle
      await UserModel.updateOne({ _id: user._id }, { hash_password });
      return true;
    } catch (err) {
      logger.error(JSON.stringify(err));
      throw `Update failed! ${err}`;
    }
  };
};
