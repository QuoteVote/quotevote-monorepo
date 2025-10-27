import UserModel from '../models/UserModel';

export const Presence = {
  user: async (parent) => {
    const user = await UserModel.findById(parent.userId);
    return user;
  },
};
