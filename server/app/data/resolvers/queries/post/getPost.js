import mongoose from 'mongoose';
import PostModel from '../../models/PostModel';

export const getPost = (pubsub) => {
  return async (_, args, context) => {
    let post;
    
    // Check if the provided postId is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(args.postId)) {
      post = await PostModel.findById(args.postId);
    } else {
      // If it's not a valid ObjectId, assume it's a short URL ID (urlId)
      post = await PostModel.findOne({ urlId: args.postId });
    }

    if (!post || post.deleted) {
      if (context && context.res) {
        context.res.status(404);
      }
      return null;
    }
    return post;
  };
};
