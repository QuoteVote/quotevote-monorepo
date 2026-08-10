import ReactionModel from '../../models/ReactionModel';
import { logger } from '../../../utils/logger';

/**
 * Remove a reaction the caller previously added.
 *
 * Reactions could be added and changed but never removed. Only the author of
 * a reaction (or an admin) may delete it.
 */
export const deleteActionReaction = () => {
  return async (_, args, context) => {
    const { _id } = args;
    const { user } = context;

    logger.debug('[MUTATION] deleteActionReaction', { reactionId: _id, userId: user?._id });

    if (!user) {
      throw new Error('Authentication required');
    }

    const reaction = await ReactionModel.findById(_id);
    if (!reaction) {
      // Already gone — deleting twice is not an error.
      return true;
    }

    if (reaction.userId.toString() !== user._id.toString() && !user.admin) {
      throw new Error('Not authorized to delete this reaction');
    }

    await ReactionModel.deleteOne({ _id });
    return true;
  };
};
