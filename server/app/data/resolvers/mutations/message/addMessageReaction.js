import prisma from '~/utils/prisma';

export const addMessageReaction = () => {
  return async (_, args, context) => {
    console.log('[MUTATION] addReaction');
    try {
      const user = context.user;
      const addReaction = await prisma.reaction.create({
        data: {
          emoji: args.reaction.emoji,
          messageId: args.reaction.messageId,
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
