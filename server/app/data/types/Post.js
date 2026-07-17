export const Post = `
type Post {
  _id: String
  userId: String
  created: Date
  groupId: String
  title: String
  text: String
  citationUrl: String
  url: String
  deleted: Boolean
  upvotes: Int
  downvotes: Int
  reportedBy: [String]
  approvedBy: [String]
  rejectedBy: [String]
  votedBy: [String],
  bookmarkedBy: [String],
  dayPoints: Int,
  pointTimestamp: String
  featuredSlot: Int
  enable_voting: Boolean
  attribution: String
  attributionType: String
  creator: User
  comments: [Comment]
  votes: [Vote]
  anonymousVotes: [AnonymousVote]
  quotes: [Quote]
  messageRoom: MessageRoom
}`;
