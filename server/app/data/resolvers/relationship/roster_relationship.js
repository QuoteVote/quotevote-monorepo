import UserModel from '../models/UserModel';

export const Roster = {
  user: async (parent) => {
    const user = await UserModel.findById(parent.userId);
    return user;
  },
  contact: async (parent) => {
    const contact = await UserModel.findById(parent.contactUserId);
    return contact;
  },
};
