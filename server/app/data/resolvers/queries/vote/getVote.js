import VotesModel from '../../models/VoteModel';

export const getVote = (pubsub) => {
  return async (_, args, context) => {
    return await VotesModel.findById(args.voteId);
  };
};
