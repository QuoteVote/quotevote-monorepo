import ContentsModel from '../../models/ContentModel';

export const getContent = () => {
  return async (_, args, context) => {
    switch (context.domain) {
      case 'hiphop':
        let content = {};
        if (!args.contentId) content = await ContentsModel.findOne({ ...args });
        else content = await ContentsModel.findById(args.contentId);
        return content;
      default:
        return await ContentsModel.findById(args.contentId);
    }
  };
};
