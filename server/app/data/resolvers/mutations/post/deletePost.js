import PostModel from '../../models/PostModel';
import {
  POST_STATUS,
  getEffectiveStatus,
  isImmutable,
  isModeratorActioned,
} from '../../constants/postStatus';

export const deletePost = () => {
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

    if (post.userId.toString() !== user._id.toString() && !user.admin) {
      throw new Error('Not authorized to delete this post');
    }

    const effectiveStatus = getEffectiveStatus(post);

    if (isImmutable(effectiveStatus)) {
      throw new Error('This post has been permanently deleted and cannot be modified');
    }

    if (isModeratorActioned(effectiveStatus)) {
      throw new Error('This post is under moderator action and cannot be modified by the author');
    }

    // Idempotent: already soft-deleted
    if (effectiveStatus === POST_STATUS.SOFT_DELETED_BY_AUTHOR) {
      return { _id: postId };
    }

    await PostModel.updateOne(
      { _id: postId },
      {
        $set: {
          deleted: true,
          status: POST_STATUS.SOFT_DELETED_BY_AUTHOR,
          deletedAt: new Date(),
        },
      },
    );
    return { _id: postId };
  };
};
