import GroupModel from '../../models/GroupModel';

export const getGroupById = (pubsub) => {
  return async (_, args, context) => {
    return await GroupModel.findById(args.groupId);
  };
};
