export const ChatRoom = `
type ChatRoom {
  _id: ID!
  users: JSON
  messageType: String
  created: Date
  unreadMessages: Int
  user: User
}
`;
