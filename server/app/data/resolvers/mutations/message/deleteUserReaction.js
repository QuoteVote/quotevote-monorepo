import ReactionModel from '../../models/ReactionModel';
import { USER_REACTION } from '../../../utils/constants';
import { logger } from '../../../utils/logger';

export const deleteUserReaction = (pubsub) => {
  return async (_, args, context) => {
    logger.debug('[MUTATION] deleteUserReaction', { reactionId: args.reactionId, userId: context.user?._id });
    try {
      const { reactionId } = args;
      const userReaction = await ReactionModel.findById(reactionId);
      await ReactionModel.findByIdAndRemove(reactionId);
      pubsub.publish(USER_REACTION, { userReaction });
      return userReaction;
    } catch (err) {
      throw new Error(err);
    }
  };
};
