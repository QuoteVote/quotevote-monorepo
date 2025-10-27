import NotificationsModel from '../../models/NotificationModel';

export const getNotifications = (pubsub) => {
  return async (_, args, context) => {
    const contextUserId = context.user._id;
    return await NotificationsModel.find({
      userId: contextUserId,
      status: 'new',
    }).sort({ created: 'desc' });
  };
};
