import UserModel from '../../models/UserModel';

export const updateUserAdminRight = (pubsub) => {
  return async (_, args) => {
    try {
      const { user_id } = args;
      const { admin } = args;
      await UserModel.update({ _id: user_id }, { $set: { admin, primary: true } }, { upsert: true, new: true });
      const user = await UserModel.findOne({ _id: user_id });
      return user;
    } catch (err) {
      throw `Update failed: ${err}`;
    }
  };
};
