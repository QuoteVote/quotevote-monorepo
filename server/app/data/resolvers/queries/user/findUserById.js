import { isUndefined } from 'lodash';
import UserModel from '../../models/UserModel';
import VotesModel from '../../models/VoteModel';
import * as utils from '../../utils';

export const findUserById = () => {
  return async (_, args, context) => {
    try {
      let userId = args && args.user_id;
      const username = args && args.username;
      let user = {};

      if (username !== '' && username !== undefined) {
        user = await UserModel.findOne({ username });
      } else if (userId !== '' && userId !== undefined) {
        user = await UserModel.findOne({ _id: userId });
      } else if ('creatorId' in args && args.creatorId !== undefined) {
        const { ObjectId } = require('mongodb');
        user = await UserModel.findOne({ creatorId: new ObjectId(args.creatorId) });
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
      const userVotes = await VotesModel.find({ _userId: userId });

      user.vote_cast = isUndefined(userVotes) ? 0 : userVotes.length;

      user._followingId = utils.uniqueArrayObjects(user._followingId);
      user._followersId = utils.uniqueArrayObjects(user._followersId);

      // TODO: calculate user points
      user.points = 0;

      return user;
    } catch (err) {
      throw new Error(err);
    }
  };
};
