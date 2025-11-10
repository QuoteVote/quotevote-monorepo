import UserModel from '../resolvers/models/UserModel';

export const presenceRelationship = () => {
  return {
    async user(presence) {
      return await UserModel.findById(presence.userId);
    },
  };
};

