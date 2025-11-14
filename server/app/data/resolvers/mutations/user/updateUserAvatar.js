import UserModel from '../../models/UserModel';
import { logger } from '../../../utils/logger';

export const updateUserAvatar = (pubsub) => {
  return async (_, args) => {
    logger.debug('updateUserAvatar called', { userId: args.user_id });
    const { user_id, avatarQualities } = args;
    //  Update user

    const conditions = {
      _id: user_id,
    };
    const update = {
      avatar: avatarQualities,
    };
    const options = {
      new: true,
    };
    const user = await UserModel.findOneAndUpdate(conditions, update, options);
    if (!user) throw Error('User not found');
    logger.debug('user findOne and Update', { userId: user_id });
    return user;
  };
};
