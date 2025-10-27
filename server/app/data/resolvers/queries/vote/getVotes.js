import VotesModel from '../../models/VoteModel';

export const getVotes = () => {
  return async (_, args, context) => {
    return await VotesModel.find({ ...args });
  };
};
