import { logger } from '../../../utils/logger';
import CommentsModel from '../../models/CommentModel';

export const editComment = (pubsub) => {
  return async (_, args) => {
    logger.info('Function: editComment');

    try {
      const comment = await CommentsModel.findByIdAndUpdate(
        args.comment_id,
        args.comment,
        { new: true, upsert: true },
      );
      return comment;
    } catch (err) {
      throw new Error(err);
    }
  };
};

export const deleteComment = (pubsub) => {
  return async (_, args, context) => {
    logger.info('Function: deleteComment');

    const { commentId } = args;
    const { user } = context;
    
    if (!user) {
      throw new Error('Authentication required');
    }

    try {
      const comment = await CommentsModel.findById(commentId);
      if (!comment) {
        return { _id: commentId };
      }

      // Check if user is the comment creator or an admin
      if (comment.userId.toString() !== user._id.toString() && !user.admin) {
        throw new Error('Not authorized to delete this comment');
      }

      // Soft delete by setting deleted flag to true
      await CommentsModel.updateOne({ _id: commentId }, { $set: { deleted: true } });
      return { _id: commentId };
    } catch (err) {
      throw new Error(err);
    }
  };
};
