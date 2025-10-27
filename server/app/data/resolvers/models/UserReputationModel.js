const mongoose = require('mongoose');

const schema = mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
    unique: true,
  },
  overallScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 1000,
  },
  inviteNetworkScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 500,
  },
  conductScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 500,
  },
  activityScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 200,
  },
  // Detailed metrics
  metrics: {
    totalInvitesSent: {
      type: Number,
      default: 0,
    },
    totalInvitesAccepted: {
      type: Number,
      default: 0,
    },
    totalInvitesDeclined: {
      type: Number,
      default: 0,
    },
    averageInviteeReputation: {
      type: Number,
      default: 0,
    },
    totalReportsReceived: {
      type: Number,
      default: 0,
    },
    totalReportsResolved: {
      type: Number,
      default: 0,
    },
    totalUpvotes: {
      type: Number,
      default: 0,
    },
    totalDownvotes: {
      type: Number,
      default: 0,
    },
    totalPosts: {
      type: Number,
      default: 0,
    },
    totalComments: {
      type: Number,
      default: 0,
    },
  },
  // Reputation history for tracking changes
  history: [{
    date: {
      type: Date,
      default: Date.now,
    },
    overallScore: Number,
    inviteNetworkScore: Number,
    conductScore: Number,
    activityScore: Number,
    reason: String, // What caused the change
  }],
  lastCalculated: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
schema.index({ _userId: 1 });
schema.index({ overallScore: -1 });
schema.index({ lastCalculated: -1 });

export default mongoose.model('userReputations', schema);
