import NotificationsModel from '~/resolvers/models/NotificationModel';
import { pubsub } from '~/resolvers/subscriptions';

export const addNotification = async ({
  userId,
  userIdBy,
  notificationType,
  label,
  postId,
}) => {
  const notification = await new NotificationsModel({
    userId,
    userIdBy,
    postId,
    notificationType,
    label,
    status: 'new',
    created: new Date(),
  }).save();

  await pubsub.publish('notificationEvent', { notification });

  return notification;
};
