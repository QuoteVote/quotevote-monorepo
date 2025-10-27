import { logger } from '../../../utils/logger';
import DomainsModel from '../../models/DomainModel';

export const createDomain = (pubsub) => {
  return async (_, args, context) => {
    logger.info('Function: createDomain');
    try {
      const isExist = await DomainsModel.findOne({ key: args.domain.key });
      if (isExist) throw new Error('Document already exist!');
      return await new DomainsModel({
        ...args.domain,
        allowedUserIds: [args.domain.userId],
        adminIds: [args.domain.userId],
        created: new Date(),
      }).save();
    } catch (err) {
      throw new Error(err);
    }
  };
};
