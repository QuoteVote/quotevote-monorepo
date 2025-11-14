import { UserInputError } from 'apollo-server-express';
import UserReportModel from '../../models/UserReportModel';
import UserModel from '../../models/UserModel';
import ReputationCalculator from '../../utils/reputationCalculator';
import { logger } from '../../../utils/logger';

export default (pubsub) => {
  return async (_, args, context) => {
    const { reportUserInput } = args;
    const {
      _reportedUserId,
      reason,
      description,
      severity,
    } = reportUserInput;
    const { user } = context;

    if (!user) {
      throw new UserInputError('Authentication required');
    }

    if (user._id.toString() === _reportedUserId) {
      throw new UserInputError('Cannot report yourself');
    }

    try {
      // Check if reported user exists
      const reportedUser = await UserModel.findById(_reportedUserId);
      if (!reportedUser) {
        throw new UserInputError('User not found');
      }

      // Check if user already reported this user
      const existingReport = await UserReportModel.findOne({
        _reporterId: user._id,
        _reportedUserId,
        status: { $in: ['pending', 'reviewed'] },
      });
      
      if (existingReport) {
        throw new UserInputError('You have already reported this user');
      }

      // Create new report
      const report = new UserReportModel({
        _reporterId: user._id,
        _reportedUserId,
        reason,
        description,
        severity: severity || 'medium',
        status: 'pending',
      });

      await report.save();

      // Trigger reputation recalculation for reported user
      // This will happen asynchronously to avoid blocking the response
      setTimeout(async () => {
        try {
          await ReputationCalculator.calculateUserReputation(_reportedUserId);
        } catch (error) {
          logger.error('Error recalculating reputation after report', {
            error: error.message,
            stack: error.stack,
            reportedUserId: _reportedUserId,
            reporterId: user._id,
          });
        }
      }, 1000);

      return {
        code: 'SUCCESS',
        message: 'User report submitted successfully',
        report,
      };
    } catch (error) {
      logger.error('Error reporting user', {
        error: error.message,
        stack: error.stack,
        reportedUserId: _reportedUserId,
        reporterId: user?._id,
      });
      throw error;
    }
  };
};
