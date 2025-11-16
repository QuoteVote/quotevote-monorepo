import ReactionModel from '../../models/ReactionModel';
import { logger } from '../../../utils/logger';

export const addActionReactions = () => {
  return async (_, args, context) => {
    logger.debug('[MUTATION] addReaction', { actionId: args.reaction?.actionId, userId: context.user?._id });
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
