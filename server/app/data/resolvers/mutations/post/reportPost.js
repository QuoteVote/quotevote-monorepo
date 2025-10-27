import { logger } from '../../../utils/logger';
import PostModel from '../../models/PostModel';

export const reportPost = () => {
  return async (_, args) => {
    logger.info('Function: report post');
    const post = await PostModel.findOne({ _id: args.postId });

    // check if user has already reported the post
    if (post.reportedBy.includes(args.userId)) {
      throw new Error('You have already reported this post');
    }

    try {
      await PostModel.update(
        { _id: args.postId },
        {
          $set: {
            reported: (post.reported || 0) + 1,
            reportedBy: post.reportedBy.concat([args.userId]),
          },
        },
      );
    } catch (err) {
      throw new Error(`Reporting Post: ${err}`);
    }
    const updatedPost = await PostModel.findOne({ _id: args.postId });

    return updatedPost;
  };
};
