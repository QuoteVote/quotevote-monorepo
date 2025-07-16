import prisma from '~/utils/prisma';

export const getUserMessageReactionToolTip = pubsub => {
  return async (_, args, context) => {
    const { reactionId, messageId } = args;
    if (!reactionId || !messageId) {
      throw new Error('Message Id or Reaction Id is empty or invalid.');
    }
    const userReaction = await prisma.reaction.findUnique({
      where: { id: reactionId },
    });
    if (!userReaction) {
      return [];
    }

    const { emoji } = userReaction;
    const userReactions = await prisma.reaction.findMany({
      where: { messageId, emoji },
    });
    return userReactions;
  };
};
