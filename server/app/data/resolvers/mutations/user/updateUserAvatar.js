import UserModel from '../../models/UserModel';

export const updateUserAvatar = (pubsub) => {
  return async (_, args) => {
    console.log('updateUserAvatar called args=>', args);
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
    console.log('user findOne and Update', user);
    return user;
  };
};
