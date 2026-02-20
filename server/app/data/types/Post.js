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
  status: PostStatus
  deletedAt: String
  hardDeletedAt: String
  moderationInfo: ModerationInfo
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
