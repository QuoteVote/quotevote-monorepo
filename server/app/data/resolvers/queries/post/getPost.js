import PostModel from '../../models/PostModel';

export const getPost = (pubsub) => {
  return async (_, args, context) => {
    const post = await PostModel.findById(args.postId);
    if (!post) {
      if (context && context.res) {
        context.res.status(404);
      }
      return null;
    }
    // Always return the post — frontend renders based on status
    return post;
  };
};
