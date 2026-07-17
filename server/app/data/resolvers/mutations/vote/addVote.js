import { logger } from '../../../utils/logger';
import VoteModel from '../../models/VoteModel';
import AnonymousVoteModel from '../../models/AnonymousVoteModel';
import PostModel from '../../models/PostModel';
import CommentModel from '../../models/CommentModel';
import { updateScore } from './updateScore';
import { logActivity } from '../../utils/activities_utils';
import { addNotification } from '~/resolvers/utils/notifications/addNotification';
import crypto from 'crypto';

const ANONYMOUS_VOTE_WINDOW_MS = 30 * 1000;

const getClientIp = (req) => {
  const forwardedFor = req?.headers?.['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0].trim();
  }

  return req?.ip || req?.socket?.remoteAddress || 'unknown';
};

const buildAnonymousFingerprint = ({ sessionId, req }) => {
  const userAgent = req?.headers?.['user-agent'] || 'unknown';
  const ip = getClientIp(req);

  return crypto
    .createHash('sha256')
    .update(`${sessionId}:${ip}:${userAgent}`)
    .digest('hex');
};

const buildVoteData = async (voteInput, userId) => {
  const voteData = {
    ...voteInput,
    userId,
    created: new Date(),
  };

  if (voteInput.commentId) {
    const comment = await CommentModel.findById(voteInput.commentId);
    if (!comment || comment.deleted) {
      throw new Error('Comment not found');
    }

    voteData.postId = comment.postId;
    voteData.content = voteInput.content || comment.content;
    voteData.startWordIndex = 0;
    voteData.endWordIndex = 0;
  }

  return voteData;
};

const createAnonymousVote = async (voteInput, context) => {
  const sessionId = context.req?.headers?.['x-anonymous-session-id'];
  if (!sessionId || typeof sessionId !== 'string') {
    throw new Error('Anonymous voting session not found');
  }

  const voteData = await buildVoteData(voteInput);
  const scopeQuery = voteData.commentId
    ? { commentId: voteData.commentId }
    : { postId: voteData.postId };

  const existingVote = await AnonymousVoteModel.findOne({
    ...scopeQuery,
    sessionId,
    deleted: { $ne: true },
  });

  if (existingVote) {
    throw new Error(
      voteData.commentId
        ? 'You have already voted on this comment'
        : 'You have already voted on this post',
    );
  }

  const recentVote = await AnonymousVoteModel.findOne({
    sessionId,
    created: { $gte: new Date(Date.now() - ANONYMOUS_VOTE_WINDOW_MS) },
    deleted: { $ne: true },
  });

  if (recentVote) {
    throw new Error('Please wait a few seconds before voting again');
  }

  const anonymousVote = await new AnonymousVoteModel({
    ...voteData,
    sessionId,
    fingerprintHash: buildAnonymousFingerprint({ sessionId, req: context.req }),
  }).save();

  return {
    ...anonymousVote.toObject(),
    anonymous: true,
  };
};

export const addVote = (pubsub) => {
  return async (_, args, context) => {
    logger.info('Function: add vote');

    try {
      if (!context.user || !context.user._id) {
        throw new Error('Authentication required');
      }

      const voteData = await buildVoteData(args.vote, context.user._id);
      const scopeQuery = voteData.commentId
        ? { commentId: voteData.commentId }
        : { postId: voteData.postId };

      // Check if user has already voted on this post (ignore deleted votes)
      const existingVote = await VoteModel.findOne({
        ...scopeQuery,
        userId: voteData.userId,
        deleted: { $ne: true },
      });

      if (existingVote) {
        throw new Error(
          voteData.commentId
            ? 'You have already voted on this comment'
            : 'You have already voted on this post',
        );
      }

      const vote = await new VoteModel(voteData).save();
      if (!vote.commentId) {
        await updateScore(vote);
      }

      const post = await PostModel.findById(vote.postId);
      const voteTarget = vote.commentId ? 'comment' : 'post';
      await logActivity(
        'VOTED',
        {
          postId: vote.postId,
          userId: vote.userId,
          voteId: vote._id,
        },
        `${vote.type === 'up' ? 'Upvoted' : 'Downvoted'} '${post.title}' ${voteTarget}.`,
      );

      if (!vote.commentId) {
        await addNotification({
          userId: post.userId,
          userIdBy: vote.userId,
          label: post.text.substring(vote.startWordIndex, vote.endWordIndex),
          notificationType: `${vote.type.toUpperCase()}VOTED`,
          postId: vote.postId,
        });
      }

      return vote;
    } catch (err) {
      throw new Error(err);
    }
  };
};

export const addAnonymousVote = (pubsub) => {
  return async (_, args, context) => {
    logger.info('Function: add anonymous vote');

    try {
      return await createAnonymousVote(args.vote, context);
    } catch (err) {
      throw new Error(err);
    }
  };
};
