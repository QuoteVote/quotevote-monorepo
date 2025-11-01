import ConversationModel from '../models/ConversationModel';
import ConversationMessageModel from '../models/ConversationMessageModel';

/**
 * Get all conversations for the current user
 */
export const getConversations = () => async (root, args, context) => {
  try {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const userId = context.user['_id'];

    // Find all conversations where user is a participant
    const conversations = await ConversationModel.find({
      participantIds: userId,
    }).sort({ createdAt: -1 });

    // Transform to match GraphQL schema
    return conversations.map((conv) => ({
      id: conv._id.toString(),
      participantIds: conv.participantIds.map((id) => id.toString()),
      isRoom: conv.isRoom,
      postId: conv.postId ? conv.postId.toString() : null,
      createdAt: conv.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

/**
 * Get a specific conversation by ID
 */
export const getConversation = () => async (root, { id }, context) => {
  try {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const userId = context.user['_id'];

    // Find conversation
    const conversation = await ConversationModel.findById(id);

    if (!conversation) {
      return null;
    }

    // Check if user is a participant
    const isParticipant = conversation.participantIds.some(
      (participantId) => participantId.toString() === userId.toString()
    );

    if (!isParticipant) {
      throw new Error('Not authorized to view this conversation');
    }

    // Transform to match GraphQL schema
    return {
      id: conversation._id.toString(),
      participantIds: conversation.participantIds.map((pid) => pid.toString()),
      isRoom: conversation.isRoom,
      postId: conversation.postId ? conversation.postId.toString() : null,
      createdAt: conversation.createdAt.toISOString(),
    };
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
};
