import PostModel from '../../models/PostModel';

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
    await PostModel.updateOne({ _id: postId }, { $set: { deleted: true } });
    return { _id: postId };
  };
};
