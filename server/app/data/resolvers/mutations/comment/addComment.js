import { logger } from '../../../utils/logger';
import CommentModel from '../../models/CommentModel';
import PostModel from '../../models/PostModel';
import { updateTrending } from '../../utils/post_utils';
import { logActivity } from '../../utils/activities_utils';
import { addNotification } from '~/resolvers/utils/notifications/addNotification';

export const addComment = (pubsub) => {
  return async (_, args) => {
    logger.info('Function: addComment');

    try {
      const comment = await new CommentModel({
        ...args.comment,
        created: new Date(),
      }).save();

      await updateTrending(comment.postId);

      const post = await PostModel.findById(comment.postId);

      await logActivity(
        'COMMENTED',
        {
          userId: comment.userId,
          postId: comment.postId,
          commentId: comment._id,
        },
        `Commented on '${post.title}' post.`,
      );

      await addNotification({
        userId: post.userId,
        userIdBy: comment.userId,
        label: comment.content,
        notificationType: 'COMMENTED',
        postId: comment.postId,
      });

      return comment;
    } catch (err) {
      throw new Error(err);
    }
  };
};
