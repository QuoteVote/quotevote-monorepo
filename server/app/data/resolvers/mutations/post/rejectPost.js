import { logger } from '../../../utils/logger';
import PostModel from '../../models/PostModel';

export const rejectPost = (pubsub) => {
  return async (_, args) => {
    logger.info('Function: reject post');
    const post = await PostModel.findOne({ _id: args.postId });

    try {
      let newRejectedBy;
      if (args.remove) {
        newRejectedBy = post.rejectedBy.filter(
          (userId) => userId.toString() !== args.userId.toString(),
        );
      } else {
        // Only add if not already present
        newRejectedBy = post.rejectedBy.includes(args.userId)
          ? post.rejectedBy
          : post.rejectedBy.concat([args.userId]);
      }
      await PostModel.update(
        { _id: args.postId },
        {
          $set: {
            rejectedBy: newRejectedBy,
            approvedBy: post.approvedBy.filter(
              (userId) => userId.toString() !== args.userId.toString(),
            ),
          },
        },
      );
    } catch (err) {
      throw new Error(`Rejecting Post: ${err}`);
    }
    const updatedPost = await PostModel.findOne({ _id: args.postId });

    return updatedPost;
  };
};
