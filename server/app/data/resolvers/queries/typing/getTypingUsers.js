import TypingIndicator from '../../models/TypingModel';

export const getTypingUsers = async (root, { messageRoomId }) => {
  // Get all active typing indicators for this room
  const typingIndicators = await TypingIndicator.find({
    messageRoomId,
    isTyping: true,
  });

  return typingIndicators;
};

