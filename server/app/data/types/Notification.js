export const Notification = `
type Notification {
  _id: String
  userId: String
  userIdBy: String
  userBy: User
  post: Post
  notificationType: String
  label: String
  status: String
  created: Date
}
`;
