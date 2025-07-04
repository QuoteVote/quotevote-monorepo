import prisma from '~/utils/prisma';
import { USER_REACTION } from '../../../utils/constants';

export const deleteUserReaction = pubsub => {
  return async (_, args, context) => {
    console.log('[MUTATION] deleteUserReaction');
    try {
      const { reactionId } = args;
      const userReaction = await prisma.reaction.findUnique({
        where: { id: reactionId },
      });
      await prisma.reaction.delete({
        where: { id: reactionId },
      });
      pubsub.publish(USER_REACTION, { userReaction });
      return userReaction;
    } catch (err) {
      throw new Error(err);
    }
  };
};
