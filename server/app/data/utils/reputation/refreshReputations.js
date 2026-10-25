import reputationCalculator from '../../resolvers/utils/reputationCalculator';
import { logger } from '../logger';

export const REPUTATION_REFRESH_INTERVAL = 24 * 60 * 60 * 1000;

let refreshInProgress = false;

export const refreshReputations = async () => {
  if (refreshInProgress) {
    logger.warn('[Reputation Refresh] Skipping overlapping refresh');
    return;
  }

  refreshInProgress = true;

  try {
    const results = await reputationCalculator.recalculateAllReputations();
    const successful = results.filter((result) => result.success).length;
    const failed = results.length - successful;

    logger.info('[Reputation Refresh] Completed', {
      total: results.length,
      successful,
      failed,
    });
  } catch (error) {
    logger.error('[Reputation Refresh] Failed', {
      error: error.message,
      stack: error.stack,
    });
  } finally {
    refreshInProgress = false;
  }
};

export const startReputationRefresh = () => {
  const interval = setInterval(refreshReputations, REPUTATION_REFRESH_INTERVAL);

  refreshReputations();
  logger.info('[Reputation Refresh] Started background refresh job');

  return interval;
};

export default {
  refreshReputations,
  startReputationRefresh,
};
