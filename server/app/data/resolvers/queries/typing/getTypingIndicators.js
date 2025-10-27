import { ObjectId } from 'mongodb';
import TypingIndicatorModel from '../../models/TypingIndicatorModel';

export const getTypingIndicators = () => {
  return async (_, args) => {
    console.log('[QUERY] getTypingIndicators');

    const { conversationId } = args;

    const indicators = await TypingIndicatorModel.find({
      conversationId: new ObjectId(conversationId),
      isTyping: true,
    });

    return indicators.map(i => ({
      _id: i._id,
      conversationId: i.conversationId.toString(),
      userId: i.userId.toString(),
      isTyping: i.isTyping,
      lastTypingAt: i.lastTypingAt,
    }));
  };
};
