import VotesModal from '../../models/VoteModel';

export const getItemsWithScore = async (items, typeId) => {
  const itemsWithScore = await Promise.all(
    items.map(async (item) => {
      const upvotes = await VotesModal.find({
        [typeId]: item._id,
        type: 'upvote',
      });
      const downvotes = await VotesModal.find({
        [typeId]: item._id,
        type: 'downvote',
      });
      return {
        ...item,
        scoreDetails: { upvotes: upvotes.length, downvotes: downvotes.length },
      };
    }),
  );
  return itemsWithScore.map((item) => ({
    ...item._doc,
    scoreDetails: item.scoreDetails,
  }));
};
