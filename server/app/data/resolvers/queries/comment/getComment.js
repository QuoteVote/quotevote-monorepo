import CommentsModel from '../../models/CommentModel';

export const getComment = (pubsub) => {
  return async (_, args, context) => {
    return await CommentsModel.findById(args.commentId);
  };
};
