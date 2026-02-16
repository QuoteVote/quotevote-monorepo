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

    if (!isRestorableByAuthor(post.status)) {
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
