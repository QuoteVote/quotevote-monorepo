import ReactionModel from '../../models/ReactionModel';
import { logger } from '../../../utils/logger';

export const addMessageReaction = () => {
  return async (_, args, context) => {
    logger.debug('[MUTATION] addReaction', { messageId: args.reaction?.messageId, userId: context.user?._id });
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
