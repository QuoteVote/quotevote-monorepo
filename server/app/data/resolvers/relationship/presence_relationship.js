import UserModel from '../models/UserModel';

export const presenceRelationship = () => {
  return {
    async user(presence) {
      return await UserModel.findById(presence.userId);
    },
  };
};

