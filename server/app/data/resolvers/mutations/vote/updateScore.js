import { findIndex } from 'lodash';
import PostModel from '../../models/PostModel';

import { updateTrending } from '../../utils/post_utils';

export const updateScore = async (vote) => {
  const post = await PostModel.findById(vote.postId);

  const index = findIndex(
    post.votedBy,
    (voteObj) => voteObj.userId.toString() === vote.userId.toString(),
  );

  // user changes vote
  if (index !== -1) {
    post.votedBy[index].type = vote.type;
    await PostModel.update(
      { _id: vote.postId },
      {
        $set: {
          votedBy: post.votedBy,
          upvotes: vote.type === 'up' ? post.upvotes + 1 : post.upvotes,
          downvotes: vote.type === 'down' ? post.downvotes + 1 : post.downvotes,
        },
      },
    );
  } else {
    // new user adds vote
    await PostModel.update(
      { _id: vote.postId },
      {
        $set: {
          votedBy: post.votedBy.concat([{ type: vote.type, userId: vote.userId }]),
          upvotes: vote.type === 'up' ? post.upvotes + 1 : post.upvotes,
          downvotes: vote.type === 'down' ? post.upvotes + 1 : post.downvotes,
        },
      },
    );
    await updateTrending(vote.postId);
  }
};
