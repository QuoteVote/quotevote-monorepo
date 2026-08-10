import UserReputationModel from '../models/UserReputationModel';
import PresenceModel from '../models/PresenceModel';
import ReputationCalculator from '../utils/reputationCalculator';
import { logger } from '../../utils/logger';

export const user_relationship = {
  User: {
    // Only runs when a query selects `presence`, so user lists that omit the
    // field are unaffected. Null when the user has no presence record yet.
    presence: async (parent) => {
      try {
        return await PresenceModel.findOne({ userId: parent._id });
      } catch (error) {
        logger.error('Error getting user presence in relationship', {
          error: error.message,
          userId: parent._id,
        });
        return null;
      }
    },
    reputation: async (parent) => {
      try {
        // Get existing reputation or calculate new one
        let reputation = await UserReputationModel.findOne({ _userId: parent._id });
        
        // If no reputation exists or it's been more than 24 hours since last calculation, recalculate
        const shouldRecalculate = !reputation || 
          (Date.now() - new Date(reputation.lastCalculated).getTime()) > (24 * 60 * 60 * 1000);
        
        if (shouldRecalculate) {
          reputation = await ReputationCalculator.calculateUserReputation(parent._id);
        }
        
        return reputation;
      } catch (error) {
        logger.error('Error getting user reputation in relationship', {
          error: error.message,
          stack: error.stack,
          userId: parent._id,
        });
        return null;
      }
    },
  },
};
