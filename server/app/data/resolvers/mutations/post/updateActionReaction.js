import ReactionModel from '../../models/ReactionModel';
import { logger } from '../../../utils/logger';

export const updateActionReaction = () => {
  return async (_, args, context) => {
    logger.debug('[MUTATION] updateReaction', { reactionId: args._id, userId: context.user?._id });
    try {
      const { _id } = args;
      const userReaction = await ReactionModel.findByIdAndUpdate(_id, { emoji: args.emoji });
      return userReaction;
    } catch (err) {
      throw new Error(err);
    }
  };
};
