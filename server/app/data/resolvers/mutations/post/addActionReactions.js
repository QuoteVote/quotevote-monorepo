import prisma from '~/utils/prisma';

export const addActionReactions = () => {
  return async (_, args, context) => {
    console.log('[MUTATION] addReaction', args);
    try {
      const user = context.user;
      const addReaction = await prisma.reaction.create({
        data: {
          emoji: args.reaction.emoji,
          actionId: args.reaction.actionId,
          userId: user._id,
          created: new Date(),
        },
      });
      return addReaction;
    } catch (err) {
      throw new Error(err);
    }
  };
};