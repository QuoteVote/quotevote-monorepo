export const MessageRoom = `
type MessageRoom {
  _id: ID!
  users: JSON
  messageType: String
  created: Date
  title: String
  avatar: JSON
  unreadMessages: Int
  postId: String
  messages: [Message]
}
`;
