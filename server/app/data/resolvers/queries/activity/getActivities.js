import ActivityModel from '../../models/ActivityModel';
import ContentsModel from '../../models/ContentModel';
import VotesModel from '../../models/VoteModel';
import CommentsModel from '../../models/CommentModel';
import QuotesModel from '../../models/QuoteModel';
import PostModel from '../../models/PostModel';
import UserModel from '../../models/UserModel';

export const getActivities = (pubsub) => {
  return async (_, args) => {
    console.log('Function: activities', args);
    const {
      limit, offset, searchKey, startDateRange, endDateRange, activityEvent, user_id,
    } = args;

    //  Will need to provide date arguments as well
    const searchArgs = searchKey ? {
      $text: {
        $search: searchKey,
        $caseSensitive: false,
      },
    } : {};

    if (activityEvent) {
      searchArgs.activityType = { $in: activityEvent };
    }
    if (user_id) {
      searchArgs.userId = user_id;
    }
    if (startDateRange || endDateRange) {
      // Deal with Date Range Here
    }

    console.log('searchArgs', {
      searchArgs, limit, offset, activityEvent,
    });
    const total = await ActivityModel.find(searchArgs).count();
    const activitiesResult = await ActivityModel.find(searchArgs).sort({ created: 'desc' }).skip(offset).limit(limit);
    if (activitiesResult.length > 0) {
      const
        activities = await Promise.all(
          activitiesResult.map(async (activity) => {
            let data;
            let response;
            let content;
            const user = await UserModel.findById(activity.userId);
            const { name, avatar } = user._doc;
            const creator = { name, profileImageUrl: avatar };
            switch (activity.activityType) {
              case 'POSTED':
                const post = await PostModel.findById(activity.postId);
                data = { ...post._doc, creator };
                content = data.title;
                response = { event: activity.activityType, data, _id: activity._id };
                break;
              case 'VOTED':
                const vote = await VotesModel.findById(activity.voteId);
                const points = vote ? vote.endWordIndex - vote.startWordIndex : 0;
                const { postId, userId } = vote._doc;
                const voterContent = await PostModel.findById(postId);
                data = {
                  ...vote._doc,
                  points,
                  content: { ...voterContent._doc } || { title: '' },
                  creator,
                };
                response = { event: activity.activityType, data, _id: activity._id };
                break;
              case 'COMMENTED':
                const comment = await CommentsModel.findById(activity.commentId);
                data = {
                  ...comment._doc,
                  creator,
                };
                response = { event: activity.activityType, data, _id: activity._id };
                content = data.text;
                break;
              case 'QUOTED':
                const quote = await QuotesModel.findById(activity.quoteId);
                const quoterContent = await ContentsModel.findById(quote.contentId);
                data = {
                  ...quote._doc,
                  content: quoterContent,
                  creator,
                };
                response = { event: activity.activityType, data, _id: activity._id };
                content = data.quote;
                break;
              default:
                break;
            }
            return response;
          }),
        );
      return { activities, total };
    }
    return [];
  };
};
