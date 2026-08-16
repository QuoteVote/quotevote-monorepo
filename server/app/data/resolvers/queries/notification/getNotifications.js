import NotificationsModel from '../../models/NotificationModel';

/** Applied when the caller does not ask for a specific page size. */
export const DEFAULT_NOTIFICATION_LIMIT = 50;

/** Upper bound, so a client cannot ask for an unbounded result set. */
export const MAX_NOTIFICATION_LIMIT = 100;

/**
 * Clamp a caller-supplied limit into [1, MAX_NOTIFICATION_LIMIT].
 * Anything missing or nonsensical falls back to the default.
 */
export const resolveLimit = (limit) => {
  if (limit === null || limit === undefined) {
    return DEFAULT_NOTIFICATION_LIMIT;
  }
  if (!Number.isFinite(limit) || limit < 1) {
    return DEFAULT_NOTIFICATION_LIMIT;
  }
  return Math.min(Math.trunc(limit), MAX_NOTIFICATION_LIMIT);
};

export const getNotifications = (pubsub) => {
  return async (_, args, context) => {
    const contextUserId = context.user._id;
    const { limit, offset, status } = args || {};

    const query = {
      userId: contextUserId,
      // 'new' preserves the previous behaviour; pass status: null for all.
      status: status === undefined ? 'new' : status,
    };
    if (query.status === null) {
      delete query.status;
    }

    return NotificationsModel.find(query)
      .sort({ created: 'desc' })
      .skip(Number.isFinite(offset) && offset > 0 ? Math.trunc(offset) : 0)
      .limit(resolveLimit(limit));
  };
};
