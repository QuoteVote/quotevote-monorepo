import ReactionModel from '../../models/ReactionModel';
import { USER_REACTION } from '../../../utils/constants';

export const deleteUserReaction = (pubsub) => {
  return async (_, args, context) => {
    console.log('[MUTATION] deleteUserReaction');
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
