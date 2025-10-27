import UsersModel from '../../models/UserModel';

export const searchCreator = (pubsub) => {
  return async (_, args, context) => {
    return await UsersModel.find({
      name: new RegExp(args.text, 'i'),
    });
  };
};
