import { logger } from '../../../utils/logger';
import PostModel from '../../models/PostModel';

export const toggleVoting = () => {
  return async (_, args, context) => {
    logger.info('Function: toggle voting');
    const { postId } = args;
    const { user } = context;
    console.log('toggleVoting user context:', user);

    if (!user) {
      throw new Error('Authentication required');
    }

    const post = await PostModel.findOne({ _id: postId });
    if (!post) {
      throw new Error('Post not found');
    }

    // Only the post creator can toggle voting
    if (post.userId.toString() !== user._id.toString() && !user.admin) {
      throw new Error('Not authorized to toggle voting on this post');
    }

    try {
      const newVotingState = !post.enable_voting;
      await PostModel.updateOne(
        { _id: postId },
        { $set: { enable_voting: newVotingState } },
      );
    } catch (err) {
      throw new Error(`Toggling voting: ${err}`);
    }

    const updatedPost = await PostModel.findOne({ _id: postId });
    return updatedPost;
  };
};
