export const Vote = `
type Vote {
  _id: String
  created: Date
  postId: String
  userId: String
  type: String
  tags: String
  startWordIndex: Int
  endWordIndex: Int
  deleted: Boolean
  user: User
  content: String
}
`;
