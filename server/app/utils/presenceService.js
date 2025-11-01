import { PubSub } from 'graphql-subscriptions';
import { createClient } from 'redis';
import UserModel from '../data/resolvers/models/UserModel';
import { logger } from '../data/utils/logger';

// Create pubsub instance directly to avoid circular dependency
const pubsub = new PubSub();

// Redis client initialization
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error', err);
});

// Connect to Redis
redisClient.connect().catch(logger.error);

// Create a subscriber client for Redis pub/sub
const subscriberClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

subscriberClient.on('error', (err) => {
  logger.error('Redis Subscriber Client Error', err);
});

subscriberClient.connect().catch(logger.error);

// Channel for presence updates
const PRESENCE_CHANNEL = 'presence:updates';
const PRESENCE_TTL = 120; // 2 minutes in seconds

// Subscribe to presence updates channel
subscriberClient.subscribe(PRESENCE_CHANNEL, (message) => {
  try {
    const presenceData = JSON.parse(message);
    logger.info('Received presence update:', presenceData);
    // Publish to GraphQL subscription
    pubsub.publish('presenceUpdatesEvent', {
      presenceUpdates: presenceData,
    });
    // Also publish to presenceStream
    pubsub.publish('presenceStreamEvent', {
      presenceStream: presenceData,
    });
  } catch (error) {
    logger.error('Error processing presence update:', error);
  }
}).catch(logger.error);

/**
 * Set user presence status
 * @param {string} userId - The user ID
 * @param {string} status - The presence status (e.g., 'online', 'away', 'offline')
 * @param {string} text - Additional presence text (e.g., 'Working on something')
 * @returns {Promise<Object>} Presence object
 */
export async function setPresence(userId, status, text) {
  try {
    const presenceKey = `presence:${userId}`;
    const timestamp = Date.now();

    // Set the presence data as a hash
    await redisClient.hSet(presenceKey, {
      status,
      text,
      lastSeen: new Date(timestamp).toISOString(),
    });

    // Set expiration time (TTL)
    await redisClient.expire(presenceKey, PRESENCE_TTL);

    // Publish update to GraphQL subscription
    const presenceData = {
      userId,
      status,
      text,
      lastSeen: new Date(timestamp).toISOString(),
    };

    // Publish to Redis channel for distributed systems
    await redisClient.publish(PRESENCE_CHANNEL, JSON.stringify(presenceData));

    // Also publish directly to GraphQL pubsub
    pubsub.publish('presenceUpdatesEvent', {
      presenceUpdates: presenceData,
    });
    pubsub.publish('presenceStreamEvent', {
      presenceStream: presenceData,
    });

    return presenceData;
  } catch (error) {
    logger.error('Error setting presence', error);
    throw error;
  }
}

/**
 * Get user presence status
 * @param {string} userId - The user ID
 * @returns {Promise<Object|null>} Presence object or null if not found
 */
export async function getPresence(userId) {
  try {
    const presenceKey = `presence:${userId}`;
    const presenceData = await redisClient.hGetAll(presenceKey);

    // If no presence data found, return null
    if (!presenceData || Object.keys(presenceData).length === 0) {
      return null;
    }

    // Add userId to the returned object
    presenceData.userId = userId;

    return presenceData;
  } catch (error) {
    logger.error('Error getting presence', error);
    throw error;
  }
}

/**
 * Set current user presence status
 * @param {string} userId - The user ID
 * @param {string} status - The presence status (e.g., 'online', 'away', 'offline')
 * @param {string} text - Additional presence text (e.g., 'Working on something')
 * @returns {Promise<Object>} Presence object
 */
export async function presenceSet(userId, status, text) {
  try {
    // Check if user is blocked by anyone who might be observing their presence
    // Note: This is a simplified check. In a real implementation, you might want
    // to check against a specific list of users who are observing this user's presence.
    
    const presenceKey = `presence:${userId}`;
    const timestamp = Date.now();

    // Set the presence data as a hash
    await redisClient.hSet(presenceKey, {
      userId,
      status,
      text,
      lastSeen: new Date(timestamp).toISOString(),
    });

    // Set expiration time (TTL)
    await redisClient.expire(presenceKey, PRESENCE_TTL);

    // Publish update to GraphQL subscription
    const presenceData = {
      userId,
      status,
      text,
      lastSeen: new Date(timestamp).toISOString(),
    };

    // Publish to Redis channel for distributed systems
    await redisClient.publish(PRESENCE_CHANNEL, JSON.stringify(presenceData));

    // Also publish directly to GraphQL pubsub
    pubsub.publish('presenceUpdatesEvent', {
      presenceUpdates: presenceData,
    });
    pubsub.publish('presenceStreamEvent', {
      presenceStream: presenceData,
    });

    return presenceData;
  } catch (error) {
    logger.error('Error setting presence', error);
    throw error;
  }
}

export { redisClient, PRESENCE_CHANNEL };

/**
 * Get all online users presence status
 * @returns {Promise<Array>} Array of presence objects
 */
export async function presenceOnlineUsers() {
  try {
    const pattern = 'presence:*';
    const keys = await redisClient.keys(pattern);

    // Get all presence data for each key
    const promises = keys.map(async (key) => {
      const presenceData = await redisClient.hGetAll(key);
      if (presenceData && Object.keys(presenceData).length > 0) {
        // Extract userId from key
        const userId = key.replace('presence:', '');
        presenceData.userId = userId;
        return presenceData;
      }
      return null;
    });

    const results = await Promise.all(promises);
    return results.filter((item) => item !== null);
  } catch (error) {
    logger.error('Error getting online users presence', error);
    throw error;
  }
}