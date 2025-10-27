export const Activity = `
type Activity {
  _id: String
  created: Date
  activityType: String
  postId: String
  post: Post
  voteId: String
  vote: Vote
  quoteId: String
  quote: Quote
  commentId: String
  comment: Comment
  content: String
  userId: String
  user: User
}`;
