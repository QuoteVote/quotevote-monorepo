import UserReputationModel from '../models/UserReputationModel';
import ReputationCalculator from '../utils/reputationCalculator';

export const user_relationship = {
  User: {
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
        console.error('Error getting user reputation in relationship:', error);
        return null;
      }
    },
  },
};
