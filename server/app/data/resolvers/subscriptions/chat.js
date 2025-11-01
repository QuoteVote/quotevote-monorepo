import { createClient } from 'redis';
import { logger } from '../../utils/logger';

// Redis client for pub/sub
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error in chat subscriptions', err);
});

redisClient.connect().catch(logger.error);

// Store subscription callbacks
const subscriptionCallbacks = new Map();

/**
 * Handle typing update subscription
 */
export const msgTypingUpdate = {
  subscribe: async function* (root, { conversationId }, context) {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const userId = context.user['_id'];

    // Verify conversation exists
    // Note: In a real implementation, we would import the ConversationModel
    // and verify the conversation exists and the user is a participant.
    // For now, we'll assume the conversation exists.

    // Create a unique channel name
    const channelName = `typing:${conversationId}`;

    // Create a promise that will resolve when we receive a message
    let resolvePromise;
    const messagePromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    // Subscribe to the Redis channel
    await redisClient.subscribe(channelName, (message) => {
      try {
        const payload = JSON.parse(message);
        // Only deliver to subscribers of the same conversation
        if (payload.conversationId === conversationId) {
          resolvePromise(payload);
        }
      } catch (error) {
        logger.error('Error parsing typing update message:', error);
      }
    });

    try {
      // Yield messages as they arrive
      while (true) {
        const message = await messagePromise;
        yield { msgTypingUpdate: message };
        
        // Create a new promise for the next message
        const nextPromise = new Promise((resolve) => {
          resolvePromise = resolve;
        });
        messagePromise = nextPromise;
      }
    } finally {
      // Unsubscribe when the client disconnects
      await redisClient.unsubscribe(channelName);
    }
  }
};

/**
 * Handle receipt update subscription
 */
export const receiptUpdate = {
  subscribe: async function* (root, { conversationId }, context) {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const userId = context.user['_id'];

    // Verify conversation exists
    // Note: In a real implementation, we would import the ConversationModel
    // and verify the conversation exists and the user is a participant.
    // For now, we'll assume the conversation exists.

    // Create a unique channel name
    const channelName = `receipt:${conversationId}`;

    // Create a promise that will resolve when we receive a message
    let resolvePromise;
    let messagePromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    // Subscribe to the Redis channel
    await redisClient.subscribe(channelName, (message) => {
      try {
        const payload = JSON.parse(message);
        // Only deliver to subscribers of the same conversation
        if (payload.conversationId === conversationId) {
          resolvePromise(payload);
        }
      } catch (error) {
        logger.error('Error parsing receipt update message:', error);
      }
    });

    try {
      // Yield messages as they arrive
      while (true) {
        const message = await messagePromise;
        yield { receiptUpdate: message };
        
        // Create a new promise for the next message
        const nextPromise = new Promise((resolve) => {
          resolvePromise = resolve;
        });
        messagePromise = nextPromise;
      }
    } finally {
      // Unsubscribe when the client disconnects
      await redisClient.unsubscribe(channelName);
    }
  }
};

export { redisClient };