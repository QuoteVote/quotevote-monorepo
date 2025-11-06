import { logger } from '../../../utils/logger';
import CommentModel from '../../models/CommentModel';
import PostModel from '../../models/PostModel';
import { updateTrending } from '../../utils/post_utils';
import { logActivity } from '../../utils/activities_utils';
import { addNotification } from '~/resolvers/utils/notifications/addNotification';
import { addUserToPostRoom } from '../../utils/message/addUserToPostRoom';

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

      // Add commenting user to the post's message room (if it exists or create it)
      try {
        await addUserToPostRoom(comment.postId, comment.userId);
        logger.info(`Added user ${comment.userId} to post ${comment.postId} message room`);
      } catch (roomError) {
        // Log error but don't fail the comment creation
        logger.error(`Error adding user to post message room: ${roomError.message}`);
      }

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
