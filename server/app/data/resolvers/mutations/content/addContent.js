import crypto from 'crypto';
import { isEmpty, uniq } from 'lodash';
import { logger } from '../../../utils/logger';
import ContentsModel from '../../models/ContentModel';
import UserModel from '../../models/UserModel';
import DomainsModel from '../../models/DomainModel';
import NotificationsModel from '../../models/NotificationModel';
import { NOTIFICATION_CREATED } from '../../../utils/constants';
import { logActivity } from '../../utils/activities_utils';

export const addContent = (pubsub) => {
  return async (_, args) => {
    logger.info('Function: add content');
    const newContent = {
      ...args.content,
      url: crypto.randomBytes(20).toString('hex'),
      created: new Date(),
    };

    try {
      const content = await new ContentsModel(newContent).save();
      const ids = {
        contentId: content._id,
      };
      const contentCreator = await UserModel.findOne({ creatorId: content.creatorId });
      const contentDomain = await DomainsModel.findOne({ _id: content.domainId });
      const followers = uniq(
        contentCreator._followersId.map(
          (followers) => followers.toString().trim(),
        ),
      );
      if (!isEmpty(followers)) {
        followers.forEach(async (follower) => {
          const { ObjectId } = require('mongodb');
          const userId = new ObjectId(follower);
          const postNotifAdded = await new NotificationsModel({
            userId,
            contentId: content._id,
            contentDomain: contentDomain.url,
            label: `${contentCreator.name} posted a content.`,
            status: 'new',
            created: new Date(),
            notifType: 'post',
          }).save();

          if (postNotifAdded) {
            const notify = await NotificationsModel.find({ userId });
            const notificationCreated = [];
            notify.forEach((item) => {
              const notification = {
                _id: item._id,
                userId: item.userId,
                senderUserId: item.senderUserId,
                messageRoomId: item.messageRoomId,
                followerUserId: item.followerUserId,
                contentId: item.contentId,
                contentDomain: item.contentDomain,
                label: item.label,
                status: item.status,
                created: item.created,
                notifType: item.notifType,
              };
              notificationCreated.push(notification);
            });
            pubsub.publish(NOTIFICATION_CREATED, { notificationCreated });
          }
        });
      }
      await logActivity('POSTED', ids, content.title);
      return content;
    } catch (err) {
      throw new Error(err);
    }
  };
};
