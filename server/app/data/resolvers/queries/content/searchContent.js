import ContentsModel from '../../models/ContentModel';

export const searchContent = (pubsub) => {
  return async (_, args, context) => {
    return await ContentsModel.find({
      title: new RegExp(args.text, 'i'),
    });
  };
};
