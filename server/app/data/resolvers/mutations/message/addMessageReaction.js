import ReactionModel from '../../models/ReactionModel';

export const addMessageReaction = () => {
  return async (_, args, context) => {
    console.log('[MUTATION] addReaction');
    try {
      const { user } = context;
      const addReaction = await new ReactionModel({
        emoji: args.reaction.emoji,
        messageId: args.reaction.messageId,
        userId: user._id,
        created: new Date(),
      }).save();
      return addReaction;
    } catch (err) {
      throw new Error(err);
    }
  };
};
