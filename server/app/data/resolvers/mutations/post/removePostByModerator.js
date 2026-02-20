import PostModel from '../../models/PostModel';
import { POST_STATUS, REMOVAL_REASON_CODES } from '../../constants/postStatus';

export const removePostByModerator = () => {
  return async (_, args, context) => {
    const { postId, reasonCode, reasonText } = args;
    const { user } = context;

    if (!user || !user.admin) {
      throw new Error('Admin access required');
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const validCodes = Object.values(REMOVAL_REASON_CODES);
    if (!validCodes.includes(reasonCode)) {
      throw new Error(`Invalid reason code. Must be one of: ${validCodes.join(', ')}`);
    }

    const updated = await PostModel.findByIdAndUpdate(
      postId,
      {
        $set: {
          status: POST_STATUS.REMOVED_BY_MODERATOR,
          deleted: true,
          moderationInfo: {
            moderatorId: user._id,
            reasonCode,
            reasonText: reasonText || null,
            moderatedAt: new Date(),
          },
        },
      },
      { new: true },
    );

    return updated;
  };
};
