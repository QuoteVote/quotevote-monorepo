import DomainsModel from '../../models/DomainModel';

export const getDomain = (pubsub) => {
  return async (_, args, context) => {
    if (!args.domainId) return await DomainsModel.findOne({ key: args.key });
    return await DomainsModel.findById(args.domainId);
  };
};
