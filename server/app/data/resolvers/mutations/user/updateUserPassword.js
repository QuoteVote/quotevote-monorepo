import { UserInputError } from 'apollo-server-express';
import UserModel from '../../models/UserModel';
import { logger } from '../../../utils/logger';
import { generateHashPassword, verifyToken } from '~/utils/authentication';

export const updateUserPassword = (pubsub) => {
  return async (_, args) => {
    try {
      const { username, password, token } = args;
      const userAuth = await verifyToken(token);
      const hash_password = generateHashPassword(password);
      if (userAuth) {
        const userUpdate = await UserModel.update({ username }, { hash_password }, {
          upsert: true,
          new: true,
        });
        return userUpdate;
      }
      throw new UserInputError('User not found', {
        invalidArgs: Object.keys(args),
      });
    } catch (err) {
      logger.error(JSON.stringify(err));
      throw `Update failed! ${err}`;
    }
  };
};
