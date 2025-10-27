import ReactionModel from '../../models/ReactionModel';

export const addActionReactions = () => {
  return async (_, args, context) => {
    console.log('[MUTATION] addReaction', args);
    try {
      const { user } = context;
      const addReaction = await new ReactionModel({
        emoji: args.reaction.emoji,
        actionId: args.reaction.actionId,
        userId: user._id,
        created: new Date(),
      }).save();
      return addReaction;
    } catch (err) {
      throw new Error(err);
    }
  };
};
