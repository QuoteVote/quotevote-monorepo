import { AuthenticationError } from 'apollo-server-express';
import UserModel from '../../models/UserModel';

export default (pubsub) => {
  return async (_, args, context) => {
    const { user } = context;

    if (!user) {
      throw new AuthenticationError('Authentication required');
    }

    // Only admins can view bot reported users
    if (!user.admin) {
      throw new AuthenticationError('Admin access required');
    }

    try {
      const { sortBy = 'botReports', limit = 100 } = args;

      let sortOptions = {};
      if (sortBy === 'botReports') {
        sortOptions = { botReports: -1, lastBotReportDate: -1 };
      } else if (sortBy === 'lastReportDate') {
        sortOptions = { lastBotReportDate: -1, botReports: -1 };
      }

      // Get users with at least one bot report
      const reportedUsers = await UserModel.find({
        botReports: { $gt: 0 }
      })
      .sort(sortOptions)
      .limit(limit)
      .select('_id username name email botReports accountStatus lastBotReportDate joined avatar');

      return reportedUsers;
    } catch (error) {
      console.error('Error fetching bot reported users:', error);
      throw error;
    }
  };
};

