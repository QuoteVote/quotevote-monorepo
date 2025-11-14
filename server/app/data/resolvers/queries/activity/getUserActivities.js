import ActivityModel from '../../models/ActivityModel';
import UserModel from '~/resolvers/models/UserModel';
import { logger } from '../../../utils/logger';

export const getUserActivities = (pubsub) => {
  return async (_, args, context) => {
    logger.debug('Function: activities', { args, userId: context.user?._id });
    let {
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
      try {
        const parsedActivityEvent = typeof activityEvent === 'string' ? JSON.parse(activityEvent) : activityEvent;
        searchArgs.activityType = { $in: parsedActivityEvent };
      } catch (error) {
        logger.error('Error parsing activityEvent', { error: error.message, stack: error.stack, activityEvent });
      }
    }

    if (user_id) {
      searchArgs.userId = user_id;
    } else {
      const userDetails = await UserModel.findById(context.user._id);
      const followingIds = userDetails._followingId;
      logger.debug('getUserActivities followingIds', { followingIds, userId: context.user._id });
      searchArgs.userId = {
        $in: followingIds,
      };
    }

    if (startDateRange && endDateRange) {
      searchArgs.created = {
        $gte: new Date(startDateRange),
        $lte: new Date(endDateRange),
      };
    }

    offset = offset || 0;
    limit = limit || 10;
    const total = await ActivityModel.find(searchArgs)
      .count();
    const activitiesResult = await ActivityModel.find(searchArgs)
      .sort({ created: 'desc' })
      .skip(offset)
      .limit(limit);
    return {
      entities: activitiesResult,
      pagination: {
        total_count: total,
        limit,
        offset,
      },
    };
  };
};
