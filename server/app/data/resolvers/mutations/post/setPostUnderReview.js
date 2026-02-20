import PostModel from '../../models/PostModel';
import { POST_STATUS, isPermanentlyDeleted } from '../../constants/postStatus';

export const setPostUnderReview = () => {
  return async (_, args, context) => {
    const { postId } = args;
    const { user } = context;

    if (!user || !user.admin) {
      throw new Error('Admin access required');
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    if (isPermanentlyDeleted(post.status)) {
      throw new Error('Cannot review a permanently deleted post');
    }

    const updated = await PostModel.findByIdAndUpdate(
      postId,
      {
        $set: {
          status: POST_STATUS.UNDER_REVIEW,
          deleted: true,
          moderationInfo: {
            moderatorId: user._id,
            moderatedAt: new Date(),
          },
        },
      },
      { new: true },
    );

    return updated;
  };
};
