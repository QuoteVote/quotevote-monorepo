import { logger } from '../../../utils/logger';
import GroupModel from '../../models/GroupModel';

export const createGroup = (pubsub) => {
  return async (_, args, context) => {
    logger.info('Function: createGroup');
    try {
      const isExist = await GroupModel.findOne({ title: args.group.title });

      if (isExist) throw new Error('Group name already exist!');

      const newGroup = await new GroupModel({
        ...args.group,
        allowedUserIds: [args.group.creatorId],
        adminIds: [args.group.creatorId],
        created: new Date(),
      }).save();

      const url = `/${newGroup.title.replace(/ /g, '-').toLowerCase()}`;

      await GroupModel.update(
        { _id: newGroup._id },
        {
          $set: {
            url,
          },
        },
      );

      return {
        _id: newGroup._id,
        creatorId: newGroup.creatorId,
        created: newGroup.creatorId,
        title: newGroup.title,
        description: newGroup.description,
        url,
        privacy: newGroup.privacy,
        allowedUserIds: newGroup.allowedUserIds,
        adminIds: newGroup.adminIds,
        pendingUsers: newGroup.pendingUsers,
      };
    } catch (err) {
      throw new Error(err);
    }
  };
};
