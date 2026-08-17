jest.mock('../../data/resolvers/utils/reputationCalculator', () => ({
  __esModule: true,
  default: {
    recalculateAllReputations: jest.fn(),
  },
}));

jest.mock('../../data/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

import ReputationCalculator from '../../data/resolvers/utils/reputationCalculator';
import { logger } from '../../data/utils/logger';
import {
  REPUTATION_REFRESH_INTERVAL,
  refreshReputations,
} from '../../data/utils/reputation/refreshReputations';

describe('reputation refresh job', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('recalculates all reputations outside a request', async () => {
    ReputationCalculator.recalculateAllReputations.mockResolvedValue([
      { success: true },
      { success: false },
    ]);

    await refreshReputations();

    expect(ReputationCalculator.recalculateAllReputations).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith('[Reputation Refresh] Completed', {
      total: 2,
      successful: 1,
      failed: 1,
    });
  });

  it('logs an error instead of throwing when refresh fails', async () => {
    ReputationCalculator.recalculateAllReputations.mockRejectedValue(
      new Error('database unavailable'),
    );

    await expect(refreshReputations()).resolves.toBeUndefined();
    expect(logger.error).toHaveBeenCalled();
  });

  it('uses a 24-hour refresh interval', () => {
    expect(REPUTATION_REFRESH_INTERVAL).toBe(24 * 60 * 60 * 1000);
  });
});