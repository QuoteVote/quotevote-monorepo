import CreatorModel from '../../models/CreatorModel';

export const getCreator = (pubsub) => {
  return async (_, args, context) => {
    switch (context.domain) {
      case 'hiphop':
        let creator = {};
        if (!args.creatorId) creator = await CreatorModel.findOne({ ...args });
        else creator = await CreatorModel.findById(args.creatorId);
        return creator;
      default:
        return await CreatorModel.findById(args.creatorId);
    }
  };
};
