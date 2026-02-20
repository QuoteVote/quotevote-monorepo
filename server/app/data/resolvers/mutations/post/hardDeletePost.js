import PostModel from '../../models/PostModel';
import {
  POST_STATUS,
  getEffectiveStatus,
  isImmutable,
  isModeratorActioned,
} from '../../constants/postStatus';

export const hardDeletePost = () => {
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
      throw new Error('Only the author can permanently delete this post');
    }

    const effectiveStatus = getEffectiveStatus(post);

    if (isImmutable(effectiveStatus)) {
      throw new Error('This post is already permanently deleted');
    }

    if (isModeratorActioned(effectiveStatus)) {
      throw new Error('This post is under moderator action and cannot be deleted by the author');
    }

    const updated = await PostModel.findByIdAndUpdate(
      postId,
      {
        $set: {
          status: POST_STATUS.HARD_DELETED_BY_AUTHOR,
          deleted: true,
          deletedAt: post.deletedAt || new Date(),
          hardDeletedAt: new Date(),
          title: '[Deleted]',
          text: '',
          url: '',
          citationUrl: '',
        },
      },
      { new: true },
    );

    return { _id: updated._id, status: updated.status };
  };
};
