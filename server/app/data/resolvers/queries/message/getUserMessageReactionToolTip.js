import ReactionModel from '../../models/ReactionModel';

export const getUserMessageReactionToolTip = (pubsub) => {
  return async (_, args, context) => {
    const { reactionId, messageId } = args;
    if (!reactionId || !messageId) {
      throw new Error('Message Id or Reaction Id is empty or invalid.');
    }
    const userReaction = await ReactionModel.findById(reactionId);
    if (!userReaction) {
      return [];
    }

    const { reaction } = userReaction;
    const userReactions = await ReactionModel.find({ messageId, reaction });
    return userReactions;
  };
};
