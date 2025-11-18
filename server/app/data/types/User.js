<<<<<<< Updated upstream
export const User = `
type User {
  _id: String!
  userId: ID
  joined: String
  username: String
  name: String
  email: String
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
  themePreference: String
}`;
=======
export const User = `
type User {
  _id: String!
  userId: ID
  joined: String
  username: String
  name: String
  email: String
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
  themePreference: String
  reputation: UserReputation
}`;
>>>>>>> Stashed changes
