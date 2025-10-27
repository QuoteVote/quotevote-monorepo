import { logger } from '../../../utils/logger';
import DomainsModel from '../../models/DomainModel';

export const acceptUserToBoard = (pubsub) => {
  return async (_, args, context) => {
    logger.info('Function: acceptUserToBoard');

    try {
      const domain = await DomainsModel.findById(args.domainId);
      const allowedUserIds = [...domain.allowedUserIds, args.userId];
      const userIndex = domain.pendingUserIds.findIndex(
        (id) => id === args.userId,
      );
      const pendingUserIds = [...domain.pendingUserIds];
      pendingUserIds.splice(userIndex, 1);

      return await DomainsModel.findByIdAndUpdate(
        args.domainId,
        {
          allowedUserIds,
          pendingUserIds,
        },
        { new: true },
      );
    } catch (err) {
      throw new Error(err);
    }
  };
};
