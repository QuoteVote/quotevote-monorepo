import { UserInputError } from 'apollo-server-express';
import { ObjectId } from 'mongodb';
import TypingIndicatorModel from '../../models/TypingIndicatorModel';
import { pubsub } from '../../subscriptions';
import { checkRateLimit } from '../../utils/rateLimiter';

export const updateTypingIndicator = () => {
  return async (_, args, context) => {
    console.log('[MUTATION] updateTypingIndicator');

    const { user } = context;
    if (!user) {
      throw new UserInputError('Authentication required');
    }

    const { conversationId, isTyping } = args.typing;

    // Check rate limit
    const rateLimitExceeded = await checkRateLimit(user._id.toString(), 'typing');
    if (rateLimitExceeded) {
      throw new UserInputError('Rate limit exceeded. Please try again later.');
    }

    const now = new Date();

    // Find or create typing indicator
    let typingIndicator = await TypingIndicatorModel.findOne({
      conversationId: new ObjectId(conversationId),
      userId: user._id,
    });

    if (!typingIndicator) {
      typingIndicator = new TypingIndicatorModel({
        conversationId: new ObjectId(conversationId),
        userId: user._id,
        isTyping,
        lastTypingAt: now,
      });
    } else {
      typingIndicator.isTyping = isTyping;
      typingIndicator.lastTypingAt = now;
    }

    await typingIndicator.save();

    // Publish typing update
    await pubsub.publish('typingUpdate', {
      typingUpdate: {
        _id: typingIndicator._id,
        conversationId: typingIndicator.conversationId.toString(),
        userId: typingIndicator.userId.toString(),
        isTyping: typingIndicator.isTyping,
        lastTypingAt: typingIndicator.lastTypingAt,
      },
    });

    return {
      _id: typingIndicator._id,
      conversationId: typingIndicator.conversationId.toString(),
      userId: typingIndicator.userId.toString(),
      isTyping: typingIndicator.isTyping,
      lastTypingAt: typingIndicator.lastTypingAt,
    };
  };
};
