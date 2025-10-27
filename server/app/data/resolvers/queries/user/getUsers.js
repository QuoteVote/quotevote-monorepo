import UserModel from '../../models/UserModel';

export const getUsers = () => {
  return async (_, args, context) => {
    const users = await UserModel.find();
    return users.map((user) => ({
      ...user._doc,
      userId: user._id,
    }));
  };
};
