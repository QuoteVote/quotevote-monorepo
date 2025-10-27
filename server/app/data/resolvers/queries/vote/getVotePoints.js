import VotesModel from '../../models/VoteModel';

export const getVotePoints = (pubsub) => {
  return async (_, args, context) => {
    return {
      total: (await VotesModel.find({ ...args })).length,
      upvotes: (await VotesModel.find({ ...args, type: 'upvote' })).length,
      downvotes: (await VotesModel.find({ ...args, type: 'downvote' })).length,
    };
  };
};
