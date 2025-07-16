import prisma from '~/utils/prisma';

export const getUserMessageReactions = pubsub => {
  return async (_, args, context) => { 
    const { messageId } = args;
    if (!messageId) {
      throw new Error('Message Id is empty or invalid.');
    }
    const messageReactions = await prisma.reaction.findMany({ where: args });
    return messageReactions;
  };
};
