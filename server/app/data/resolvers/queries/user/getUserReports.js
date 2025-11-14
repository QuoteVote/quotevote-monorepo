import UserReportModel from '../../models/UserReportModel';
import { logger } from '../../../utils/logger';

export const getUserReports = () => {
  return async (_, args) => {
    const { userId, status } = args;
    
    try {
      const query = { _reportedUserId: userId };
      if (status) {
        query.status = status;
      }
      
      const reports = await UserReportModel.find(query)
        .populate('_reporterId', 'username name')
        .populate('_reportedUserId', 'username name')
        .sort({ createdAt: -1 });
      
      return reports;
    } catch (error) {
      logger.error('Error getting user reports', { error: error.message, stack: error.stack, userId, status });
      throw new Error('Failed to get user reports');
    }
  };
};
