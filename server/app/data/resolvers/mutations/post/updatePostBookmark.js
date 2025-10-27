import { logger } from '../../../utils/logger';
import { updateTrending } from '../../utils/post_utils';
import PostModel from '../../models/PostModel';

export const updatePostBookmark = (pubsub) => {
  return async (_, args) => {
    logger.info('Function: updatePostBookmark');
    const post = await PostModel.findOne({ _id: args.postId });

    // remove bookmark
    if (post.bookmarkedBy.includes(args.userId)) {
      await PostModel.update(
        { _id: args.postId },
        {
          $set: {
            dayPoints: post.dayPoints !== 0 ? post.dayPoints - 1 : 0,
            bookmarkedBy: post.bookmarkedBy.filter(
              (userId) => userId.toString() !== args.userId.toString(),
            ),
          },
        },
      );
    } else {
      // add bookmark
      await PostModel.update(
        { _id: args.postId },
        {
          $set: {
            bookmarkedBy: post.bookmarkedBy.concat([args.userId]),
          },
        },
      );

      await updateTrending(args.postId);
    }

    const updatedPost = await PostModel.findOne({ _id: args.postId });

    return updatedPost;
  };
};
