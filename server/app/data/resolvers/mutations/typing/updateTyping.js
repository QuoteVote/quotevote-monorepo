import TypingIndicator from '../../models/TypingModel';
import { pubsub } from '../../subscriptions';

export const updateTyping = async (root, { typing }, context) => {
  const { user } = context;
  if (!user) throw new Error('Authentication required');

  const { messageRoomId, isTyping } = typing;

  if (isTyping) {
    // Create or update typing indicator
    await TypingIndicator.findOneAndUpdate(
      { messageRoomId, userId: user._id },
      {
        messageRoomId,
        userId: user._id,
        isTyping: true,
        timestamp: new Date(),
      },
      { upsert: true, new: true },
    );
  } else {
    // Remove typing indicator
    await TypingIndicator.deleteOne({ messageRoomId, userId: user._id });
  }

  // Publish typing event
  await pubsub.publish('typingEvent', {
    typing: {
      messageRoomId,
      userId: user._id.toString(),
      isTyping,
      timestamp: new Date(),
    },
  });

  return { success: true };
};

