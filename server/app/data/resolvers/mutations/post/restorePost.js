import PostModel from '../../models/PostModel';
import {
  POST_STATUS,
  getEffectiveStatus,
  isModeratorActioned,
  isImmutable,
} from '../../constants/postStatus';

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

    const effectiveStatus = getEffectiveStatus(post);

    if (isImmutable(effectiveStatus)) {
      throw new Error('This post cannot be restored');
    }

    if (isModeratorActioned(effectiveStatus)) {
      throw new Error('This post is under moderator action and cannot be restored by the author');
    }

    if (effectiveStatus !== POST_STATUS.SOFT_DELETED_BY_AUTHOR) {
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
