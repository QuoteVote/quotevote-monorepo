import CommentsModel from '../../models/CommentModel';
import ContentsModel from '../../models/ContentModel';

export const getComments = (pubsub) => {
  return async (_, args, context) => {
    const comments = await CommentsModel.find({ ...args });
    const commentWithContentDetails = await Promise.all(
      comments.map(async (comment) => {
        const {
          _id,
          contentId,
          creatorId,
          userId,
          text,
          startWordIndex,
          endWordIndex,
          created,
          __v,
          hashtags,
        } = comment;
        const content = await ContentsModel.findById(contentId);
        if (content && content.title) {
          return {
            _id,
            contentId,
            creatorId,
            userId,
            text,
            startWordIndex,
            endWordIndex,
            created,
            __v,
            hashtags,
            content: {
              title: content.title,
            },
          };
        }
      }),
    );
    return commentWithContentDetails;
  };
};
