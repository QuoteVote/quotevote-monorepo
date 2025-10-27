import NotificationModel from '~/resolvers/models/NotificationModel';

export const removeNotification = () => {
  return async (_, args) => {
    console.log('[MUTATION] removeNotification');
    const { notificationId } = args;
    return await NotificationModel.update(
      { _id: notificationId },
      { status: 'deleted' },
    );
  };
};
