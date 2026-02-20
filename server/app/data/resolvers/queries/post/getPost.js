import PostModel from '../../models/PostModel';
import { getEffectiveStatus, POST_STATUS } from '../../constants/postStatus';

export const getPost = (pubsub) => {
  return async (_, args, context) => {
    const post = await PostModel.findById(args.postId);
    if (!post) {
      if (context && context.res) {
        context.res.status(404);
      }
      return null;
    }

    const effectiveStatus = getEffectiveStatus(post);

    // For hard-deleted or moderator-removed posts, return a scrubbed version
    // so the frontend can render a tombstone without leaking content
    if (
      effectiveStatus === POST_STATUS.HARD_DELETED_BY_AUTHOR ||
      effectiveStatus === POST_STATUS.REMOVED_BY_MODERATOR
    ) {
      return {
        _id: post._id,
        userId: post.userId,
        status: post.status,
        deleted: post.deleted,
        deletedAt: post.deletedAt,
        hardDeletedAt: post.hardDeletedAt,
        moderationInfo: post.moderationInfo,
        created: post.created,
        title: '',
        text: '',
        url: '',
        citationUrl: '',
        comments: [],
        votes: [],
        quotes: [],
        messageRoom: post.messageRoom,
      };
    }

    return post;
  };
};
