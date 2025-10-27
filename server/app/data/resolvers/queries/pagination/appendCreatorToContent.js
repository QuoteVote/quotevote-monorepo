import CreatorsModel from '../../models/CreatorModel';

export const appendCreatorToContent = async (contents) => {
  const contentsWithCreator = await Promise.all(
    contents.map(async (content) => {
      const creator = await CreatorsModel.findById(content.creatorId);
      return { ...content, creator };
    }),
  );
  return contentsWithCreator;
};
