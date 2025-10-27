import ContentsModel from '../../models/ContentModel';

export const getContents = (pubsub) => {
  return async (_, args, context) => {
    switch (context.domain) {
      case 'hiphop':
        return await ContentsModel.find({ ...args });
      default:
        return await ContentsModel.find({ ...args });
    }
  };
};
