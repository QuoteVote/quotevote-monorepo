export const AnonymousVote = `
type AnonymousVote {
  _id: String
  created: Date
  postId: String
  commentId: String
  type: String
  tags: String
  startWordIndex: Int
  endWordIndex: Int
  deleted: Boolean
  content: String
  anonymous: Boolean
}`;
