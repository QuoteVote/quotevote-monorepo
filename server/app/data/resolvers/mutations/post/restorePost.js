import PostModel from '../../models/PostModel';
import { POST_STATUS, isRestorableByAuthor } from '../../constants/postStatus';

export const restorePost = () => {
  return async (_, args, context) => {
    const { postId } = args;
    const { user } = context;

    if (!user) {
      throw new Error('Authentication required');
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    if (post.userId.toString() !== user._id.toString()) {
      throw new Error('Only the author can restore this post');
    }

    // Allow restore if status is SOFT_DELETED_BY_AUTHOR, or if pre-migration
    // post has deleted: true but no status field yet
    const restorable = isRestorableByAuthor(post.status) ||
      (!post.status && post.deleted === true);
    if (!restorable) {
      throw new Error('This post cannot be restored');
    }

    const updated = await PostModel.findByIdAndUpdate(
      postId,
      {
        $set: {
          status: POST_STATUS.ACTIVE,
          deleted: false,
          deletedAt: null,
        },
      },
      { new: true },
    );

    return updated;
  };
};
