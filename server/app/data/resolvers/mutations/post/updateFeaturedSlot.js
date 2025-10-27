import PostModel from '../../models/PostModel';

export const updateFeaturedSlot = () => {
  return async (_, args) => {
    const { postId, featuredSlot } = args;

    if (featuredSlot !== null && featuredSlot !== undefined) {
      if (featuredSlot < 1 || featuredSlot > 12) {
        throw new Error('featuredSlot must be between 1 and 12');
      }
      // remove any post currently using this slot
      await PostModel.updateMany({ featuredSlot }, { $unset: { featuredSlot: '' } });
    }

    await PostModel.updateOne({ _id: postId }, { $set: { featuredSlot } });
    return PostModel.findById(postId);
  };
};
