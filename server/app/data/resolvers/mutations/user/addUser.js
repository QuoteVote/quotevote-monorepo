import bcrypt from 'bcryptjs';
import { logger } from '../../../utils/logger';
import UserModel from '../../models/UserModel';

export const addUser = (pubsub) => {
  return async (_, args) => {
    logger.info(args);
    const userData = args.user;
    const salt = bcrypt.genSaltSync(10);
    userData.hash_password = bcrypt.hashSync(userData.password, salt);
    try {
      return await new UserModel(userData).save();
    } catch (err) {
      throw err.errmsg;
    }
  };
};
