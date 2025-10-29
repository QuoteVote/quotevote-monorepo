import mongoose from 'mongoose';
import { createClient } from 'redis';
import ConversationModel from '../models/ConversationModel';
import ConversationMessageModel from '../models/ConversationMessageModel';
import ReceiptModel from '../models/ReceiptModel';
import UserModel from '../models/UserModel';
import RosterModel from '../models/RosterModel';
import { pubsub } from '../subscriptions';
import { logger } from '../../utils/logger';
import rateLimiter from '../../utils/rateLimiter';

// Redis client for pub/sub
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error in chat mutations', err);
});

redisClient.connect().catch(logger.error);

/**
 * Ensure a direct conversation exists between current user and another user
 * Implements mutual roster acceptance before creating conversation
 */
export const convEnsureDirect = () => async (root, { otherUserId }, context) => {
  try {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const currentUserId = context.user['_id'];

    // Don't allow conversation with self
    if (currentUserId.toString() === otherUserId.toString()) {
      throw new Error('Cannot create conversation with yourself');
    }

    // Check if both users have accepted each other in their rosters
    const currentUserRoster = await RosterModel.findOne({ userId: currentUserId });
    const otherUserRoster = await RosterModel.findOne({ userId: otherUserId });

    // Check if both users have accepted each other
    const currentUserAccepted = currentUserRoster && currentUserRoster.contacts.some(
      contact => contact.userId.toString() === otherUserId.toString() && contact.status === 'accepted'
    );

    const otherUserAccepted = otherUserRoster && otherUserRoster.contacts.some(
      contact => contact.userId.toString() === currentUserId.toString() && contact.status === 'accepted'
    );

    // If not mutual acceptance, throw error
    if (!currentUserAccepted || !otherUserAccepted) {
      throw new Error('Both users must accept each other before starting a conversation');
    }

    // Check if conversation already exists
    const existingConversation = await ConversationModel.findOne({
      isRoom: false,
      participantIds: {
        $all: [currentUserId, otherUserId],
        $size: 2,
      },
    });

    if (existingConversation) {
      return {
        id: existingConversation._id.toString(),
        participantIds: existingConversation.participantIds.map((id) => id.toString()),
        isRoom: existingConversation.isRoom,
        postId: existingConversation.postId ? existingConversation.postId.toString() : null,
        createdAt: existingConversation.createdAt.toISOString(),
      };
    }

    // Create new conversation
    const newConversation = new ConversationModel({
      participantIds: [currentUserId, otherUserId],
      isRoom: false,
      createdAt: new Date(),
    });

    const savedConversation = await newConversation.save();

    return {
      id: savedConversation._id.toString(),
      participantIds: savedConversation.participantIds.map((id) => id.toString()),
      isRoom: savedConversation.isRoom,
      postId: savedConversation.postId ? savedConversation.postId.toString() : null,
      createdAt: savedConversation.createdAt.toISOString(),
    };
  } catch (error) {
    console.error('Error ensuring direct conversation:', error);
    throw error;
  }
};

/**
 * Send a message in a conversation
 */
export const msgSend = () => async (root, { conversationId, body }, context) => {
  try {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const authorId = context.user['_id'];

    // Rate limiting: 30 messages per minute per user
    const isAllowed = await rateLimiter.check(authorId.toString(), 'msgSend', 30, 60);
    if (!isAllowed) {
      throw new Error('Rate limit exceeded: You can only send 30 messages per minute');
    }

    // Verify conversation exists
    const conversation = await ConversationModel.findById(conversationId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Check if user is a participant
    const isParticipant = conversation.participantIds.some(
      (participantId) => participantId.toString() === authorId.toString()
    );

    if (!isParticipant) {
      throw new Error('Not authorized to send messages in this conversation');
    }

    // Check if sender is blocked by any recipient
    // Get all other participants in the conversation
    const otherParticipantIds = conversation.participantIds.filter(
      (participantId) => participantId.toString() !== authorId.toString()
    );

    // Check if sender is blocked by any of the recipients
    if (otherParticipantIds.length > 0) {
      const otherParticipants = await UserModel.find({
        _id: { $in: otherParticipantIds }
      });

      for (const participant of otherParticipants) {
        if (participant.blockedUserIds && 
            participant.blockedUserIds.some(
              (blockedId) => blockedId.toString() === authorId.toString()
            )) {
          throw new Error('You are blocked by one or more recipients and cannot send messages');
        }
      }
    }

    // Create new message
    const newMessage = new ConversationMessageModel({
      conversationId,
      authorId,
      body,
      createdAt: new Date(),
    });

    const savedMessage = await newMessage.save();

    // Prepare message object for response and subscription
    const messageObject = {
      id: savedMessage._id.toString(),
      conversationId: savedMessage.conversationId.toString(),
      authorId: savedMessage.authorId.toString(),
      body: savedMessage.body,
      createdAt: savedMessage.createdAt.toISOString(),
      editedAt: savedMessage.editedAt ? savedMessage.editedAt.toISOString() : null,
    };

    // Publish to Redis channel for this conversation
    const channelName = `msgNew:${conversationId}`;
    try {
      await redisClient.publish(channelName, JSON.stringify(messageObject));
    } catch (redisError) {
      logger.error('Error publishing to Redis:', redisError);
      // Don't fail the mutation if Redis publish fails
    }

    // Publish to GraphQL subscription
    try {
      pubsub.publish('msgNewEvent', {
        msgNew: messageObject,
        conversationId: conversationId.toString(),
      });
    } catch (pubsubError) {
      logger.error('Error publishing to pubsub:', pubsubError);
      // Don't fail the mutation if pubsub fails
    }

    return messageObject;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Handle typing indicator for a conversation
 */
export const msgTyping = () => async (root, { conversationId, isTyping }, context) => {
  try {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const userId = context.user['_id'];

    // Verify conversation exists
    const conversation = await ConversationModel.findById(conversationId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Check if user is a participant
    const isParticipant = conversation.participantIds.some(
      (participantId) => participantId.toString() === userId.toString()
    );

    if (!isParticipant) {
      throw new Error('Not authorized to send typing indicator in this conversation');
    }

    // Prepare typing payload
    const typingPayload = {
      conversationId: conversationId.toString(),
      userId: userId.toString(),
      isTyping,
      lastUpdated: new Date().toISOString(),
    };

    // Publish to Redis channel for this conversation (as requested)
    const channelName = `typing:${conversationId}`;
    try {
      await redisClient.publish(channelName, JSON.stringify(typingPayload));
    } catch (redisError) {
      logger.error('Error publishing typing indicator to Redis:', redisError);
      // Don't fail the mutation if Redis publish fails
    }

    return true;
  } catch (error) {
    console.error('Error sending typing indicator:', error);
    throw error;
  }
};

/**
 * Mark a message as read
 */
export const msgRead = () => async (root, { conversationId, messageId }, context) => {
  try {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const userId = context.user['_id'];

    // Verify conversation exists
    const conversation = await ConversationModel.findById(conversationId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Check if user is a participant
    const isParticipant = conversation.participantIds.some(
      (participantId) => participantId.toString() === userId.toString()
    );

    if (!isParticipant) {
      throw new Error('Not authorized to mark messages as read in this conversation');
    }

    // Verify message exists and belongs to this conversation
    const message = await ConversationMessageModel.findOne({
      _id: messageId,
      conversationId: conversationId,
    });

    if (!message) {
      throw new Error('Message not found in this conversation');
    }

    // Prepare receipt payload
    const receiptPayload = {
      conversationId: conversationId.toString(),
      userId: userId.toString(),
      lastSeenMessageId: messageId.toString(),
      lastSeenAt: new Date().toISOString(),
    };

    // Publish to Redis channel for this conversation (as requested)
    const channelName = `receipt:${conversationId}`;
    try {
      await redisClient.publish(channelName, JSON.stringify(receiptPayload));
    } catch (redisError) {
      logger.error('Error publishing receipt to Redis:', redisError);
      // Don't fail the mutation if Redis publish fails
    }

    return true;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

export { redisClient };