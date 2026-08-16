export const User = `
type User {
  _id: String!
  userId: ID
  joined: String
  username: String
  name: String
  email: String
  bio: String
  tokens: Int
  _wallet: String
  avatar: JSON
  _followersId: [String]
  _followingId: [String]
  _votesId: Int
  favorited: Int
  admin: Boolean
  upvotes: Int
  downvotes: Int
  contributorBadge: Boolean
  reputation: UserReputation
  # Resolved on demand — only queried when selected, so user lists are unaffected.
  presence: Presence
  botReports: Int
  accountStatus: String
  lastBotReportDate: String
  themePreference: String
}`;
