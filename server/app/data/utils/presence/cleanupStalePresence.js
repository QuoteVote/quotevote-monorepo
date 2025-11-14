import Presence from '../../resolvers/models/PresenceModel';
import { pubsub } from '../../resolvers/subscriptions';
import { logger } from '../../utils/logger';

/**
 * Cleanup stale presence records
 * This is a backup to the TTL index - marks users as offline if heartbeat is old
 */
export const cleanupStalePresence = async () => {
  const twoMinutesAgo = new Date(Date.now() - 120000);

  try {
    // Find presence records with stale heartbeats
    const stalePresences = await Presence.find({
      lastHeartbeat: { $lt: twoMinutesAgo },
      status: { $ne: 'offline' },
    });

    for (const presence of stalePresences) {
      // Update to offline
      presence.status = 'offline';
      presence.lastSeen = new Date();
      await presence.save();

      // Publish offline event
      await pubsub.publish('presenceEvent', {
        presence: {
          userId: presence.userId.toString(),
          status: 'offline',
          statusMessage: '',
          lastSeen: presence.lastSeen,
        },
      });
    }

    if (stalePresences.length > 0) {
      logger.info(`[Presence Cleanup] Marked ${stalePresences.length} users as offline`, {
        count: stalePresences.length,
      });
    }
  } catch (error) {
    logger.error('[Presence Cleanup] Error:', { error: error.message, stack: error.stack });
  }
};

/**
 * Start the presence cleanup job
 * Runs every 60 seconds
 */
export const startPresenceCleanup = () => {
  // Run cleanup every minute
  setInterval(cleanupStalePresence, 60000);
  
  // Run initial cleanup
  cleanupStalePresence();
  
  logger.info('[Presence Cleanup] Started presence cleanup job');
};

export default { cleanupStalePresence, startPresenceCleanup };

