import bcrypt from 'bcryptjs';
import { UserInputError } from 'apollo-server-express';
import UserModel from '../../models/UserModel';
import { logger } from '../../../utils/logger';
import PostModel from '~/resolvers/models/PostModel';

export const updateUser = (pubsub) => {
  return async (_, args) => {
    const userData = args.user;
    const salt = bcrypt.genSaltSync(10);

    try {
      if ('password' in userData) {
        userData.hash_password = bcrypt.hashSync(userData.password, salt);
      }

      if ('username' in userData) {
        const checkUserName = await UserModel.findOne({
          _id: { $ne: userData._id },
          username: userData.username,
        });

        if (checkUserName) {
          throw new UserInputError('Username already exists!', {
            invalidArgs: Object.keys(args),
          });
        }
      }

      if ('email' in userData) {
        const checkEmail = await UserModel.findOne({
          _id: { $ne: userData._id },
          email: userData.email,
        });
        if (checkEmail) {
          throw new UserInputError('Email address already exists!');
        }
      }

      await UserModel.update({ _id: userData._id }, userData, {
        upsert: true,
        new: true,
      });
      const query = { _id: userData._id };
      const user = await UserModel.findOne(query);
      return user;
    } catch (err) {
      throw err;
    }
  };
};
