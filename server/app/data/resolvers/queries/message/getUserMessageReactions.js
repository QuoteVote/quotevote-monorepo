import ReactionModel from '../../models/ReactionModel';

export const getUserMessageReactions = (pubsub) => {
  return async (_, args, context) => {
    const { messageId } = args;
    if (!messageId) {
      throw new Error('Message Id is empty or invalid.');
    }
    const messageReactions = await ReactionModel.find(args);
    return messageReactions;
  };
};
