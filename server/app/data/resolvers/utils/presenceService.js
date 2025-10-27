import PresenceModel from '../models/PresenceModel';
import { pubsub } from '../subscriptions';

/**
 * Update user presence status
 * @param {String} userId - The user ID
 * @param {String} status - The presence status (online, away, dnd, invisible, offline)
 * @param {String} awayMessage - Optional away message
 * @returns {Promise<Object>} - Updated presence object
 */
export async function updateUserPresence(userId, status, awayMessage = '') {
  const now = new Date();
  
  let presence = await PresenceModel.findOne({ userId });
  
  if (!presence) {
    presence = new PresenceModel({
      userId,
      status,
      awayMessage,
      lastHeartbeat: now,
      lastSeen: now,
    });
  } else {
    presence.status = status;
    presence.awayMessage = awayMessage || '';
    presence.lastHeartbeat = now;
    if (status === 'online') {
      presence.lastSeen = now;
    }
  }
  
  await presence.save();
  
  // Publish presence update
  await pubsub.publish('presenceUpdate', {
    presenceUpdate: {
      _id: presence._id,
      userId: presence.userId.toString(),
      status: presence.status,
      awayMessage: presence.awayMessage,
      lastHeartbeat: presence.lastHeartbeat,
      lastSeen: presence.lastSeen,
      updatedAt: presence.updatedAt,
    },
  });
  
  return presence;
}

/**
 * Send heartbeat to keep presence alive
 * @param {String} userId - The user ID
 * @returns {Promise<Object>} - Updated presence object
 */
export async function sendHeartbeat(userId) {
  const now = new Date();
  
  let presence = await PresenceModel.findOne({ userId });
  
  if (!presence) {
    // Create new presence with online status
    presence = new PresenceModel({
      userId,
      status: 'online',
      lastHeartbeat: now,
      lastSeen: now,
    });
  } else {
    presence.lastHeartbeat = now;
    if (presence.status === 'online') {
      presence.lastSeen = now;
    }
  }
  
  await presence.save();
  return presence;
}

/**
 * Get user presence
 * @param {String} userId - The user ID
 * @returns {Promise<Object>} - Presence object
 */
export async function getUserPresence(userId) {
  let presence = await PresenceModel.findOne({ userId });
  
  if (!presence) {
    // Return default offline presence
    return {
      userId,
      status: 'offline',
      awayMessage: '',
      lastHeartbeat: null,
      lastSeen: null,
    };
  }
  
  // Check if presence is stale (no heartbeat in last 2 minutes)
  const now = new Date();
  const twoMinutesAgo = new Date(now.getTime() - 120000);
  
  if (presence.lastHeartbeat < twoMinutesAgo) {
    presence.status = 'offline';
  }
  
  return presence;
}

/**
 * Get presence for multiple users
 * @param {Array<String>} userIds - Array of user IDs
 * @returns {Promise<Array>} - Array of presence objects
 */
export async function getBuddyListPresence(userIds) {
  const presences = await PresenceModel.find({ userId: { $in: userIds } });
  
  const now = new Date();
  const twoMinutesAgo = new Date(now.getTime() - 120000);
  
  // Map all user IDs to presence objects
  const presenceMap = {};
  presences.forEach(p => {
    // Check if stale
    if (p.lastHeartbeat < twoMinutesAgo) {
      p.status = 'offline';
    }
    presenceMap[p.userId.toString()] = p;
  });
  
  // Fill in missing users with offline status
  return userIds.map(userId => {
    if (presenceMap[userId]) {
      return presenceMap[userId];
    }
    return {
      userId,
      status: 'offline',
      awayMessage: '',
      lastHeartbeat: null,
      lastSeen: null,
    };
  });
}
