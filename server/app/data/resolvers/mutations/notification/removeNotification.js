import NotificationModel from '~/resolvers/models/NotificationModel';
import { logger } from '~/utils/logger';

export const removeNotification = () => {
  return async (_, args) => {
    logger.debug('[MUTATION] removeNotification', { notificationId: args.notificationId });
    const { notificationId } = args;
    return await NotificationModel.update(
      { _id: notificationId },
      { status: 'deleted' },
    );
  };
};
