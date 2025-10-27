import PostModel from '../../models/PostModel';

export const getPost = (pubsub) => {
  return async (_, args, context) => {
    const post = await PostModel.findById(args.postId);
    if (!post || post.deleted) {
      if (context && context.res) {
        context.res.status(404);
      }
      return null;
    }
    return post;
  };
};
