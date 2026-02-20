export const POST_STATUS = {
  ACTIVE: 'ACTIVE',
  SOFT_DELETED_BY_AUTHOR: 'SOFT_DELETED_BY_AUTHOR',
  HARD_DELETED_BY_AUTHOR: 'HARD_DELETED_BY_AUTHOR',
  UNDER_REVIEW: 'UNDER_REVIEW',
  REMOVED_BY_MODERATOR: 'REMOVED_BY_MODERATOR',
};

export const REMOVAL_REASON_CODES = {
  SPAM: 'SPAM',
  HARASSMENT: 'HARASSMENT',
  HATE_SPEECH: 'HATE_SPEECH',
  MISINFORMATION: 'MISINFORMATION',
  COPYRIGHT: 'COPYRIGHT',
  INAPPROPRIATE_CONTENT: 'INAPPROPRIATE_CONTENT',
  OTHER: 'OTHER',
};

// Mongoose schema default sets status to 'ACTIVE' even for pre-migration
// documents that have deleted: true but no status stored in the DB.
// This helper returns the true status accounting for that.
export const getEffectiveStatus = (post) => {
  if (post.deleted === true && post.status === POST_STATUS.ACTIVE) {
    return POST_STATUS.SOFT_DELETED_BY_AUTHOR;
  }
  return post.status;
};

export const isRestorableByAuthor = (status) =>
  status === POST_STATUS.SOFT_DELETED_BY_AUTHOR;

export const isPermanentlyDeleted = (status) =>
  status === POST_STATUS.HARD_DELETED_BY_AUTHOR;

export const isModeratorActioned = (status) =>
  status === POST_STATUS.UNDER_REVIEW ||
  status === POST_STATUS.REMOVED_BY_MODERATOR;

// Post cannot be modified by the author (hard-deleted or moderator-actioned)
export const isImmutable = (status) =>
  status === POST_STATUS.HARD_DELETED_BY_AUTHOR ||
  status === POST_STATUS.REMOVED_BY_MODERATOR;
