import UserModel from '../models/UserModel';

export const typingIndicatorRelationship = () => {
  return {
    async user(typingIndicator) {
      return await UserModel.findById(typingIndicator.userId);
    },
  };
};

