import { isUndefined } from 'lodash';
import UserModel from '../../models/UserModel';
import VotesModel from '../../models/VoteModel';
import PostModel from '../../models/PostModel';
import QuoteModel from '../../models/QuoteModel';
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
      const userVotes = await VotesModel.find({ userId, deleted: false });

      user.vote_cast = isUndefined(userVotes) ? 0 : userVotes.length;

      user._followingId = utils.uniqueArrayObjects(user._followingId);
      user._followersId = utils.uniqueArrayObjects(user._followersId);

      // Calculate user points
      // 10 pts per post, 5 pts per quote, 1 pt per vote cast
      const postCount = await PostModel.countDocuments({ userId, deleted: false });
      const quoteCount = await QuoteModel.countDocuments({ quoter: userId, deleted: false });
      const voteCount = user.vote_cast;

      user.points = (postCount * 10) + (quoteCount * 5) + voteCount;

      return user;
    } catch (err) {
      throw new Error(err);
    }
  };
};
