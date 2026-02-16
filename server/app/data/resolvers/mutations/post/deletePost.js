import PostModel from '../../models/PostModel';
import { POST_STATUS } from '../../constants/postStatus';

export const deletePost = () => {
  return async (_, args, context) => {
    const { postId } = args;
    const { user } = context;
    const post = await PostModel.findById(postId);
    if (!post) {
      return { _id: postId };
    }
    if (!user || (post.userId.toString() !== user._id.toString() && !user.admin)) {
      throw new Error('Not authorized to delete this post');
    }
    if (post.status === POST_STATUS.HARD_DELETED_BY_AUTHOR) {
      throw new Error('Cannot delete a permanently deleted post');
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
