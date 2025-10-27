export const Comment = `
type Comment {
  _id: String
  created: Date
  content: String
  userId: String
  startWordIndex: Int
  endWordIndex: Int
  postId: String
  url: String
  reaction: String
  deleted: Boolean
  user: User
}`;
