import { logger } from '../../../utils/logger';
import CommentsModel from '../../models/CommentModel';

/**
 * Edit the text of an existing comment.
 *
 * Deliberately narrower than editComment (which is unexposed): only `content`
 * changes, the caller must own the comment or be an admin, and there is no
 * upsert — editing a comment must never create one.
 */
export const updateComment = () => {
  return async (_, args, context) => {
    logger.info('Function: updateComment');

    const { commentId, content } = args;
    const { user } = context;

    if (!user) {
      throw new Error('Authentication required');
    }

    const trimmed = typeof content === 'string' ? content.trim() : '';
    if (!trimmed) {
      throw new Error('Comment content is required');
    }

    const comment = await CommentsModel.findById(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.deleted) {
      throw new Error('Cannot edit a deleted comment');
    }

    if (comment.userId.toString() !== user._id.toString() && !user.admin) {
      throw new Error('Not authorized to edit this comment');
    }

    // Only `content` is touched — CommentModel has no edited/updated fields,
    // and setting unknown keys would be silently dropped by Mongoose.
    return CommentsModel.findByIdAndUpdate(
      commentId,
      { $set: { content: trimmed } },
      { new: true },
    );
  };
};
