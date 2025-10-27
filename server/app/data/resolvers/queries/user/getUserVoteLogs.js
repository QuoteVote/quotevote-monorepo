import UserModel from '../../models/UserModel';
import VoteLogsModel from '../../models/VoteLogModel';

export const getUserVoteLogs = () => {
  return async (_, args, context) => {
    try {
      let userId = args && args.user_id;
      const username = args && args.username;
      let user = {};

      if (userId === '' && username !== '') {
        user = await UserModel.findOne({ username });
      } else if (userId !== '' && username === '') {
        user = await UserModel.findOne({ _id: userId });
      } else {
        userId = context.user._id;
        user = await UserModel.findOne({ _id: userId });
      }

      // Check user
      const b = Object.is(user, null);
      if (b) {
        throw new Error('User not found');
      }

      userId = user._id;

      // get user total votes
      const voteLog = await VoteLogsModel.find({ _userId: userId });

      return voteLog;
    } catch (err) {
      throw new Error(err);
    }
  };
};
