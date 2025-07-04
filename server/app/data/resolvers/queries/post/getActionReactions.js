import prisma from '~/utils/prisma';

export const getActionReactions = pubsub => {
  return async (_, args, context) => { 
    const { actionId } = args;
    if (!actionId) {
      throw new Error('Action Id is empty or invalid.');
    }
    const actionReactions = await prisma.reaction.findMany({ where: args });
    return actionReactions;
  };
};