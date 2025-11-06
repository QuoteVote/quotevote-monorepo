export const MessageRoom = `
type MessageRoom {
  _id: ID!
  users: JSON
  messageType: String
  created: Date
  lastActivity: Date
  lastMessageTime: Date
  title: String
  avatar: JSON
  unreadMessages: Int
  postId: String
  messages: [Message]
  postDetails: PostDetails
}

type PostDetails {
  _id: ID
  title: String
  text: String
  userId: ID
  url: String
}
`;
