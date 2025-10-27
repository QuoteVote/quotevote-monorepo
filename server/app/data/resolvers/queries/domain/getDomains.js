import DomainsModel from '../../models/DomainModel';

export const getDomains = (pubsub) => {
  return async (_, args, context) => {
    const props = { ...args };
    delete props.limit;
    return await DomainsModel.find({ ...props });
  };
};
