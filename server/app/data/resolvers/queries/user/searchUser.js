import UserModel from '../../models/UserModel';

export const searchUser = () => {
  return async (_, args, context) => {
    try {
      const queryName = args.queryName;

      if (!queryName || queryName.trim() === '') {
        return [];
      }

      const users = await UserModel.find({
        $or: [
          {
            username: {
              $regex: new RegExp(queryName, 'i'),
            },
          },
          {
            name: {
              $regex: new RegExp(queryName, 'i'),
            },
          }
        ],
        // Remove the exclusion of current user so you can search for yourself
        // _id: { $ne: context.user._id },
      });

      return users;
    } catch (error) {
      console.error('Error in searchUser:', error);
      return [];
    }
  };
};
