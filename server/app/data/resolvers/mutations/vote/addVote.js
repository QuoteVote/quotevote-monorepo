import { logger } from '../../../utils/logger';
import VoteModel from '../../models/VoteModel';
import PostModel from '../../models/PostModel';
import { updateScore } from './updateScore';
import { logActivity } from '../../utils/activities_utils';
import { addNotification } from '~/resolvers/utils/notifications/addNotification';

export const addVote = pubsub => {
  return async (_, args) => {
    logger.info('Function: add vote');
    const voteData = {
      ...args.vote,
      created: new Date()
    };

    try {
      // Check if user has already voted on this post
      const existingVote = await VoteModel.findOne({
        postId: voteData.postId,
        userId: voteData.userId
      });

      if (existingVote) {
        throw new Error('You have already voted on this post');
      }

      const vote = await new VoteModel(voteData).save();
      await updateScore(vote);
      const post = await PostModel.findById(vote.postId);
      await logActivity(
        'VOTED',
        {
          postId: vote.postId,
          userId: vote.userId,
          voteId: vote._id
        },
        `${vote.type === 'up' ? 'Upvoted' : 'Downvoted'} '${post.title}' post.`
      );

      await addNotification({
        userId: post.userId,
        userIdBy: vote.userId,
        label: post.text.substring(vote.startWordIndex, vote.endWordIndex),
        notificationType: `${vote.type.toUpperCase()}VOTED`,
        postId: vote.postId,
      });

      return vote;
    } catch (err) {
      throw new Error(err);
    }
  };
};
