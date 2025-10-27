import { logger } from '../../../utils/logger';
import DomainsModel from '../../models/DomainModel';

export const addPendingUser = (pubsub) => {
  return async (_, args, context) => {
    logger.info('Function: addPendingUser');

    try {
      const domain = await DomainsModel.findById(args.domainId);
      const pendingUserIds = [...domain.pendingUserIds, args.userId];
      return await DomainsModel.findByIdAndUpdate(
        args.domainId,
        { pendingUserIds },
        { new: true },
      );
    } catch (err) {
      throw new Error(err);
    }
  };
};
