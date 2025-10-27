import UserModel from '../models/UserModel';

export const TypingIndicator = {
  user: async (parent) => {
    const user = await UserModel.findById(parent.userId);
    return user;
  },
};
