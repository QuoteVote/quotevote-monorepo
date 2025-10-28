import mongoose from 'mongoose';
import { createClient } from 'redis';
import ConversationModel from '../models/ConversationModel';
import ConversationMessageModel from '../models/ConversationMessageModel';
import { pubsub } from '../subscriptions';
import { logger } from '../../utils/logger';

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
 * If it doesn't exist, create it
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

export { redisClient };
