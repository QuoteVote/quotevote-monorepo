import UserInviteModel from '../models/UserInviteModel';
import UserReportModel from '../models/UserReportModel';
import UserReputationModel from '../models/UserReputationModel';
import UserModel from '../models/UserModel';
import PostModel from '../models/PostModel';
import CommentModel from '../models/CommentModel';
import VoteModel from '../models/VoteModel';

/**
 * Reputation Calculator Service
 * Calculates user reputation based on invite network quality and user conduct
 */
export class ReputationCalculator {
  /**
   * Calculate reputation for a specific user
   * @param {string} userId - User ID to calculate reputation for
   * @returns {Object} Reputation data
   */
  static async calculateUserReputation(userId) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Calculate different components of reputation
      const inviteNetworkScore = await this.calculateInviteNetworkScore(userId);
      const conductScore = await this.calculateConductScore(userId);
      const activityScore = await this.calculateActivityScore(userId);

      // Calculate overall score (weighted average)
      const overallScore = Math.round(
        (inviteNetworkScore * 0.4)
        + (conductScore * 0.4)
        + (activityScore * 0.2),
      );

      // Get detailed metrics
      const metrics = await this.getDetailedMetrics(userId);

      // Create reputation record
      const reputationData = {
        _userId: userId,
        overallScore,
        inviteNetworkScore,
        conductScore,
        activityScore,
        metrics,
        lastCalculated: new Date(),
      };

      // Save or update reputation
      await this.saveReputation(userId, reputationData);

      return reputationData;
    } catch (error) {
      console.error('Error calculating user reputation:', error);
      throw error;
    }
  }

  /**
   * Calculate invite network score (0-500)
   * Based on quality of invited users and their acceptance rate
   */
  static async calculateInviteNetworkScore(userId) {
    const invites = await UserInviteModel.find({ _inviterId: userId });

    if (invites.length === 0) {
      return 0;
    }

    let score = 0;
    let totalInviteeReputation = 0;
    let acceptedInvites = 0;
    let joinedInvites = 0;

    for (const invite of invites) {
      if (invite.status === 'joined') {
        joinedInvites += 1;
        // Get invitee's reputation if they joined
        if (invite._invitedUserId) {
          const inviteeReputation = await UserReputationModel.findOne({
            _userId: invite._invitedUserId,
          });
          if (inviteeReputation) {
            totalInviteeReputation += inviteeReputation.overallScore;
          }
        }
      } else if (invite.status === 'approved') {
        acceptedInvites += 1;
      }
    }

    // Base score from acceptance rate (0-200 points)
    const acceptanceRate = invites.length > 0 ? (acceptedInvites + joinedInvites) / invites.length : 0;
    score += Math.round(acceptanceRate * 200);

    // Bonus for quality of invitees (0-200 points)
    if (joinedInvites > 0) {
      const averageInviteeReputation = totalInviteeReputation / joinedInvites;
      score += Math.round((averageInviteeReputation / 1000) * 200);
    }

    // Bonus for network size (0-100 points)
    const networkSizeBonus = Math.min(joinedInvites * 10, 100);
    score += networkSizeBonus;

    return Math.min(score, 500);
  }

  /**
   * Calculate conduct score (0-500)
   * Based on reports received, voting behavior, and content quality
   */
  static async calculateConductScore(userId) {
    let score = 300; // Start with neutral score

    // Check reports received
    const reports = await UserReportModel.find({ _reportedUserId: userId });
    const resolvedReports = reports.filter((r) => r.status === 'resolved');
    const pendingReports = reports.filter((r) => r.status === 'pending');

    // Deduct points for reports
    score -= resolvedReports.length * 20;
    score -= pendingReports.length * 10;

    // Check voting behavior
    const userVotes = await VoteModel.find({ _userId: userId });
    const upvotes = userVotes.filter((v) => v.voteType === 'upvote').length;
    const downvotes = userVotes.filter((v) => v.voteType === 'downvotes').length;

    // Bonus for positive voting behavior
    if (upvotes > downvotes) {
      score += Math.min((upvotes - downvotes) * 2, 100);
    }

    // Check content quality (posts and comments)
    const userPosts = await PostModel.find({ _userId: userId });
    const userComments = await CommentModel.find({ _userId: userId });

    // Bonus for content creation
    score += Math.min(userPosts.length * 5, 50);
    score += Math.min(userComments.length * 2, 50);

    return Math.max(0, Math.min(score, 500));
  }

  /**
   * Calculate activity score (0-200)
   * Based on user engagement and platform activity
   */
  static async calculateActivityScore(userId) {
    let score = 0;

    // Get user activity metrics
    const user = await UserModel.findById(userId);
    const userPosts = await PostModel.find({ _userId: userId });
    const userComments = await CommentModel.find({ _userId: userId });
    const userVotes = await VoteModel.find({ _userId: userId });

    // Activity based on content creation
    score += Math.min(userPosts.length * 10, 100);
    score += Math.min(userComments.length * 5, 50);
    score += Math.min(userVotes.length * 2, 50);

    // Bonus for account age (longer accounts get slight bonus)
    const accountAge = Date.now() - new Date(user.joined).getTime();
    const daysSinceJoined = accountAge / (1000 * 60 * 60 * 24);
    score += Math.min(daysSinceJoined * 0.5, 20);

    return Math.min(score, 200);
  }

  /**
   * Get detailed metrics for a user
   */
  static async getDetailedMetrics(userId) {
    const invites = await UserInviteModel.find({ _inviterId: userId });
    const reports = await UserReportModel.find({ _reportedUserId: userId });
    const user = await UserModel.findById(userId);
    const userPosts = await PostModel.find({ _userId: userId });
    const userComments = await CommentModel.find({ _userId: userId });
    const userVotes = await VoteModel.find({ _userId: userId });

    const acceptedInvites = invites.filter((i) => i.status === 'approved' || i.status === 'joined').length;
    const joinedInvites = invites.filter((i) => i.status === 'joined').length;
    const resolvedReports = reports.filter((r) => r.status === 'resolved').length;
    const upvotes = userVotes.filter((v) => v.voteType === 'upvote').length;
    const downvotes = userVotes.filter((v) => v.voteType === 'downvotes').length;

    // Calculate average invitee reputation
    let totalInviteeReputation = 0;
    for (const invite of invites.filter((i) => i.status === 'joined' && i._invitedUserId)) {
      const inviteeReputation = await UserReputationModel.findOne({
        _userId: invite._invitedUserId,
      });
      if (inviteeReputation) {
        totalInviteeReputation += inviteeReputation.overallScore;
      }
    }
    const averageInviteeReputation = joinedInvites > 0 ? totalInviteeReputation / joinedInvites : 0;

    return {
      totalInvitesSent: invites.length,
      totalInvitesAccepted: acceptedInvites,
      totalInvitesDeclined: invites.filter((i) => i.status === 'declined').length,
      averageInviteeReputation: Math.round(averageInviteeReputation),
      totalReportsReceived: reports.length,
      totalReportsResolved: resolvedReports,
      totalUpvotes: upvotes,
      totalDownvotes: downvotes,
      totalPosts: userPosts.length,
      totalComments: userComments.length,
    };
  }

  /**
   * Save or update reputation record
   */
  static async saveReputation(userId, reputationData) {
    const existingReputation = await UserReputationModel.findOne({ _userId: userId });
    
    if (existingReputation) {
      // Add to history
      existingReputation.history.push({
        date: new Date(),
        overallScore: existingReputation.overallScore,
        inviteNetworkScore: existingReputation.inviteNetworkScore,
        conductScore: existingReputation.conductScore,
        activityScore: existingReputation.activityScore,
        reason: 'Periodic recalculation',
      });

      // Update current values
      Object.assign(existingReputation, reputationData);
      existingReputation.updatedAt = new Date();

      await existingReputation.save();
    } else {
      // Create new reputation record
      const newReputation = new UserReputationModel(reputationData);
      await newReputation.save();
    }
  }

  /**
   * Recalculate reputation for all users (admin function)
   */
  static async recalculateAllReputations() {
    const users = await UserModel.find({});
    const results = [];

    for (const user of users) {
      try {
        const reputation = await this.calculateUserReputation(user._id);
        results.push({ userId: user._id, success: true, reputation });
      } catch (error) {
        results.push({ userId: user._id, success: false, error: error.message });
      }
    }

    return results;
  }
}

export default ReputationCalculator;
