import __ from 'lodash';
import UserModel from '../../models/UserModel';
import NotificationsModel from '../../models/NotificationModel';
import { addNotification } from '~/resolvers/utils/notifications/addNotification';

export const followUser = (pubsub) => {
  return async (_, args, context) => {
    try {
      console.log('[MUTATION] followUser', context);
      const userId = context.user._id;
      const followingUserId = args.user_id;
      const followAction = 'follow';

      if (userId == followingUserId) {
        throw 'Can\'t follow the same user.';
      }

      const userData = await UserModel.findOne({ _id: userId });
      const followingUserData = await UserModel.findOne({ _id: followingUserId });

      if (followAction === args.action) {
        console.log('Following...');
        const { ObjectId } = require('mongodb');
        const followerUserObjectId = new ObjectId(followingUserId);
        if (!userData._followingId.includes(followerUserObjectId)) {
          console.log('Inserting user to userData._followingId');
          userData._followingId.push(followerUserObjectId);
        }

        const followingUserObjectId = new ObjectId(userId);
        if (!followingUserData._followersId.includes(followingUserObjectId)) {
          console.log('Inserting user to followingUserData._followersId');
          followingUserData._followersId.push(followingUserObjectId);
        }

        // Prevent duplicate 'following' notification.
        const beenFollowed = await NotificationsModel.findOne({
          userId,
          entityId: followingUserId,
          notificationType: 'FOLLOW',
        });
        if (!beenFollowed) {
          await addNotification({
            userId: followingUserId,
            userIdBy: userId,
            label: `${userData.name} has started following you.`,
            notificationType: 'FOLLOW',
          });
        }
      } else {
        console.log('Un-follow...');
        // Remove following user from the current user
        userData._followingId = await userData._followingId.pull(followingUserId);

        // Remove current user from the follower users
        followingUserData._followersId = await followingUserData._followersId.pull(userId);
      }

      await UserModel.updateOne({ _id: userId }, userData, {
        upsert: true,
        new: true,
      });
      await UserModel.updateOne({ _id: followingUserId }, followingUserData, {
        upsert: true,
        new: true,
      });
      return userData;
    } catch (err) {
      throw `Update failed: ${err}`;
    }
  };
};
