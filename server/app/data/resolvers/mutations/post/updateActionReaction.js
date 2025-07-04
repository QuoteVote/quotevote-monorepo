import prisma from '~/utils/prisma';

export const updateActionReaction = () => {
  return async (_, args, context) => {
    console.log('[MUTATION] updateReaction');
    try {
      const { _id } = args;
      const userReaction = await prisma.reaction.update({
        where: { id: _id },
        data: { emoji: args.emoji },
      });
      return userReaction;
    } catch (err) {
      throw new Error(err);
    }
  };
};