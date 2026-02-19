import PostModel from '../../models/PostModel';
import { POST_STATUS, isRestorableByAuthor, isPermanentlyDeleted } from '../../constants/postStatus';

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

    // Allow restore if soft-deleted by author, or if pre-migration post has
    // deleted: true (Mongoose default sets status to 'ACTIVE' even for deleted posts)
    const restorable = isRestorableByAuthor(post.status) ||
      (post.deleted === true && !isPermanentlyDeleted(post.status));
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
