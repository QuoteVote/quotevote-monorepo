import GroupModel from '../../models/GroupModel';

export const getGroup = (pubsub) => {
  return async (_, args, context) => {
    if (!args.domainId) return await GroupModel.findOne({ key: args.key });
    return await GroupModel.findById(args.domainId);
  };
};
