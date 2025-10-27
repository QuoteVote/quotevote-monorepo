import GroupModel from '../../models/GroupModel';

export const getGroups = (pubsub) => {
  return async (_, args, context) => {
    const props = { ...args };
    delete props.limit;
    return await GroupModel.find({ ...props });
  };
};
