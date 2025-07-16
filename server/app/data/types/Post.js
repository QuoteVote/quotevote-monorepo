export const Post = `
type Post {
  _id: String
  userId: String
  created: Date
  groupId: String
  title: String
  text: String
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
  creator: User
  comments: [Comment]
  votes: [Vote]
  quotes: [Quote]
  messageRoom: MessageRoom
}`;

