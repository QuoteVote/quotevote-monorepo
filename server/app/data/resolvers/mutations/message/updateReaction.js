import ReactionModel from '../../models/ReactionModel';

export const updateReaction = () => {
  return async (_, args, context) => {
    console.log('[MUTATION] updateReaction');
    try {
      const { _id } = args;
      const userReaction = await ReactionModel.findByIdAndUpdate(_id, { emoji: args.emoji });
      return userReaction;
    } catch (err) {
      throw new Error(err);
    }
  };
};
