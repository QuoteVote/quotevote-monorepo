import UserModel from '../models/UserModel';

export const ReadReceipt = {
  user: async (parent) => {
    const user = await UserModel.findById(parent.userId);
    return user;
  },
};
