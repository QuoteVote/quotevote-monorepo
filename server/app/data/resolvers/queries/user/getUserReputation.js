import UserReputationModel from '../../models/UserReputationModel';
import ReputationCalculator from '../../utils/reputationCalculator';

export const getUserReputation = () => {
  return async (_, args) => {
    const { userId } = args;
    
    try {
      // Get existing reputation or calculate new one
      let reputation = await UserReputationModel.findOne({ _userId: userId });
      
      // If no reputation exists or it's been more than 24 hours since last calculation, recalculate
      const shouldRecalculate = !reputation || 
        (Date.now() - new Date(reputation.lastCalculated).getTime()) > (24 * 60 * 60 * 1000);
      
      if (shouldRecalculate) {
        reputation = await ReputationCalculator.calculateUserReputation(userId);
      }
      
      return reputation;
    } catch (error) {
      console.error('Error getting user reputation:', error);
      throw new Error('Failed to get user reputation');
    }
  };
};
