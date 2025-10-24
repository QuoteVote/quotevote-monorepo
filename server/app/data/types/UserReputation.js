export const UserReputation = `
type UserReputation {
  _id: String!
  _userId: String!
  overallScore: Int!
  inviteNetworkScore: Int!
  conductScore: Int!
  activityScore: Int!
  metrics: ReputationMetrics!
  history: [ReputationHistory!]!
  lastCalculated: String!
  createdAt: String!
  updatedAt: String!
}

type ReputationMetrics {
  totalInvitesSent: Int!
  totalInvitesAccepted: Int!
  totalInvitesDeclined: Int!
  averageInviteeReputation: Int!
  totalReportsReceived: Int!
  totalReportsResolved: Int!
  totalUpvotes: Int!
  totalDownvotes: Int!
  totalPosts: Int!
  totalComments: Int!
}

type ReputationHistory {
  date: String!
  overallScore: Int!
  inviteNetworkScore: Int!
  conductScore: Int!
  activityScore: Int!
  reason: String!
}

type UserInvite {
  _id: String!
  email: String!
  status: String!
  _inviterId: String!
  _invitedUserId: String
  joined: String
  createdAt: String!
  updatedAt: String!
}

type UserReport {
  _id: String!
  _reporterId: String!
  _reportedUserId: String!
  reason: String!
  description: String
  status: String!
  severity: String!
  adminNotes: String
  createdAt: String!
  updatedAt: String!
}
`;
