import { nanoid } from 'nanoid';
import { logger } from '../../../utils/logger';
import { logActivity } from '../../utils/activities_utils';
import GroupModel from '../../models/GroupModel';
import PostModel from '../../models/PostModel';
import MessageRoomModel from '../../models/MessageRoomModel';
import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis'

const POST_LIMIT_COUNT = Number(process.env.POST_CREATION_LIMIT_COUNT_5MIN || 2);
const POST_LIMIT_WINDOW = Number(process.env.POST_CREATION_LIMIT_WINDOW_5MIN || 10);
const MAX_RETRIES_PER_REQUEST = Number(process.env.MAX_RETRIES_PER_REQUEST || 1)

let addPostLimiter;
if (process.env.REDIS_URL) {
  const redisClient = new Redis(process.env.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: MAX_RETRIES_PER_REQUEST
  })

  addPostLimiter = new RateLimiterRedis({
    store: redisClient,
    keyPrefix: 'rl:addPost',
    points: POST_LIMIT_COUNT,
    duration: POST_LIMIT_WINDOW * 60,
    blockDuration: POST_LIMIT_WINDOW * 60,
  })

  logger.info("Rate Limiting using Redis Store")
} else {
  addPostLimiter = new RateLimiterMemory({
    points: POST_LIMIT_COUNT,
    duration: POST_LIMIT_WINDOW * 60,
    blockDuration: POST_LIMIT_WINDOW * 60,
  })

  logger.info("Rate Limiting using Memory Store")
}

export const addPost = (pubsub) => {
  return async (_, args, context) => {
    console.log('ARGS:   ', args);
    logger.info('Function: add post');

    const { user } = context || {};
    if (!user) {
      throw new Error("Authentication required")
    }

    const isAdmin = !!user.admin;
    if (!isAdmin) {
      try {
        await addPostLimiter.consume(String(user._id));
      } catch (limitError) {
        const message = `You have reached the limit of ${POST_LIMIT_COUNT} posts per ${POST_LIMIT_WINDOW} minutes. Please try again after ${POST_LIMIT_WINDOW} minutes.`;
        logger.warn('[RATE_LIMIT_EXCEEDED] addPost:5min', {
          userId: user._id,
          retryAfter: Math.round(limitError.msBeforeNext / 1000),
        });

        const error = new Error(message);
        error.extensions = { code: 'RATE_LIMIT_EXCEEDED' };
        throw error;
      }
    }

    let newPost = {};
    const group = await GroupModel.findById(args.post.groupId);
    const title = args.post.title.replace(/ /g, '-').toLowerCase();
    
    // Create the post first to get the ID
    const postObj = {
      ...args.post,
      url: '', // Temporary URL, will be updated after creation
    };

    try {
      newPost = await new PostModel(postObj).save();

      // Now create the URL using the actual post ID
      const url = `/post${group.url}/${title}/${newPost._id}`;
      
      // Update the post with the correct URL
      await PostModel.findByIdAndUpdate(newPost._id, { url });
      newPost.url = url;

      const messageRoom = await MessageRoomModel.create({ users: newPost.userId, postId: newPost._id, messageType: 'POST' });

      const ids = {
        postId: newPost._id,
        userId: newPost.userId,
        messageRoomId: messageRoom._id,
      };
      newPost.messageRoomId = messageRoom._id;

      await logActivity('POSTED', ids, newPost.title);
    } catch (err) {
      throw new Error(err);
    }
    return newPost;
  };
};
