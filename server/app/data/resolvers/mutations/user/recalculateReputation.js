import { UserInputError } from 'apollo-server-express';
import { ReputationCalculator } from '../../utils/reputationCalculator';
import { logger } from '../../../utils/logger';

export default (pubsub) => {
  return async (_, args, context) => {
    const { userId } = args;
    const { user } = context;

    if (!user) {
      throw new UserInputError('Authentication required');
    }

    // Only allow admins or the user themselves to recalculate reputation
    if (!user.admin && user._id.toString() !== userId) {
      throw new UserInputError('Insufficient permissions');
    }

    try {
      const reputation = await ReputationCalculator.calculateUserReputation(userId);

      return {
        code: 'SUCCESS',
        message: 'Reputation recalculated successfully',
        reputation,
      };
    } catch (error) {
      logger.error('Error recalculating reputation', {
        error: error.message,
        stack: error.stack,
        userId,
      });
      throw new Error('Failed to recalculate reputation');
    }
  };
};
