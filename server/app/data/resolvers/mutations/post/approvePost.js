import { logger } from '../../../utils/logger';
import PostModel from '../../models/PostModel';

export const approvePost = (pubsub) => {
  return async (_, args) => {
    logger.info('Function: approve post');
    const post = await PostModel.findOne({ _id: args.postId });

    try {
      let newApprovedBy;
      if (args.remove) {
        newApprovedBy = post.approvedBy.filter(
          (userId) => userId.toString() !== args.userId.toString(),
        );
      } else {
        // Only add if not already present
        newApprovedBy = post.approvedBy.includes(args.userId)
          ? post.approvedBy
          : post.approvedBy.concat([args.userId]);
      }
      await PostModel.update(
        { _id: args.postId },
        {
          $set: {
            approvedBy: newApprovedBy,
            rejectedBy: post.rejectedBy.filter(
              (userId) => userId.toString() !== args.userId.toString(),
            ),
          },
        },
      );
    } catch (err) {
      throw new Error(`Approving Post: ${err}`);
    }
    const updatedPost = await PostModel.findOne({ _id: args.postId });

    return updatedPost;
  };
};
