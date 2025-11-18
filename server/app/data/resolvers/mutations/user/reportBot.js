import { UserInputError, AuthenticationError } from 'apollo-server-express';
import UserModel from '../../models/UserModel';
import BotReportModel from '../../models/BotReportModel';

export default (pubsub) => {
  return async (_, args, context) => {
    const { userId, reporterId } = args;
    const { user } = context;

    if (!user) {
      throw new AuthenticationError('Authentication required');
    }

    // Verify reporter is the authenticated user
    if (user._id.toString() !== reporterId) {
      throw new AuthenticationError('Unauthorized');
    }

    if (userId === reporterId) {
      throw new UserInputError('Cannot report yourself');
    }

    try {
      // Check if reported user exists
      const reportedUser = await UserModel.findById(userId);
      if (!reportedUser) {
        throw new UserInputError('User not found');
      }

      // Check if user already reported this user for bot behavior
      const existingReport = await BotReportModel.findOne({
        _reporterId: reporterId,
        _reportedUserId: userId,
      });
      
      if (existingReport) {
        throw new UserInputError('You have already reported this user as a bot');
      }

      // Create new bot report
      const report = new BotReportModel({
        _reporterId: reporterId,
        _reportedUserId: userId,
      });

      await report.save();

      // Increment bot report count and update last report date
      reportedUser.botReports = (reportedUser.botReports || 0) + 1;
      reportedUser.lastBotReportDate = new Date();
      await reportedUser.save();

      return {
        code: 'SUCCESS',
        message: 'Bot report submitted successfully',
      };
    } catch (error) {
      console.error('Error reporting bot:', error);
      throw error;
    }
  };
};

