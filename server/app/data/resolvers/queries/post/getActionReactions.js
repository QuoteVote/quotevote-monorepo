import ReactionModel from '../../models/ReactionModel';

export const getActionReactions = (pubsub) => {
  return async (_, args, context) => {
    const { actionId } = args;
    if (!actionId) {
      throw new Error('Action Id is empty or invalid.');
    }
    const actionReactions = await ReactionModel.find(args);
    return actionReactions;
  };
};
