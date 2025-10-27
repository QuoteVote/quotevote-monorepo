import VoteModel from '../../models/VoteModel';

export const deleteVote = () => {
  return async (_, args, context) => {
    const { voteId } = args;
    const { user } = context;
    
    if (!user) {
      throw new Error('Authentication required');
    }

    const vote = await VoteModel.findById(voteId);
    if (!vote) {
      return { _id: voteId };
    }

    // Check if user is the vote creator or an admin
    if (vote.userId.toString() !== user._id.toString() && !user.admin) {
      throw new Error('Not authorized to delete this vote');
    }

    // Soft delete by setting deleted flag to true
    await VoteModel.updateOne({ _id: voteId }, { $set: { deleted: true } });
    return { _id: voteId };
  };
}; 