import { isUndefined } from 'lodash';
import UserModel from '../../models/UserModel';
import VotesModel from '../../models/VoteModel';
import * as utils from '../../utils';

/**
  * Profile page views of followers/following requires more
  * info than just the ID.  Here we will return complete info
  * @factory
  * @param{string} userId
  * @param{string} filter follower or following?
  * @returns{Object[]}
*/

export function getUserFollowInfo() {
  return async (_, args, context) => {
    const username = args && args.username;
    const filter = args && args.filter;
    const userData = await UserModel.findOne({ username });
    if (isUndefined(userData)) {
      return {
        error: true,
        message: 'No user found',
      };
    }

    //  These follow arrays contain duplicates
    const uniqueUserIds = utils.uniqueArrayObjects(filter === 'following' ? userData._followingId : userData._followersId);

    return Promise.all(
      uniqueUserIds.map(async (f) => {
        const composedUser = await mapFollowsToUserData(f);
        composedUser.profileFollows = userData._followingId.includes(composedUser._id);
        return composedUser;
      }),
    );
  };
}

export default 'getUserFollowInfo';

/**
  * Given a username we need to find follower/following info to display to user
  @factory
  @param {string} username
  @returns {object}
*/

async function mapFollowsToUserData(userId) {
  const userData = await UserModel.findOne({ _id: userId });
  const {
    id,
    avatar,
    username,
    _followersId,
    _followingId,
  } = userData;
  const returnObj = {
    avatar,
    id,
    username,
    numFollowers: utils.uniqueArrayObjects(_followersId).length,
    numFollowing: utils.uniqueArrayObjects(_followingId).length,
  };
  return returnObj;
}
