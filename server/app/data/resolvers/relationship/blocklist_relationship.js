import UserModel from '../models/UserModel';

export const Blocklist = {
  blockedUser: async (parent) => {
    const user = await UserModel.findById(parent.blockedUserId);
    return user;
  },
};
