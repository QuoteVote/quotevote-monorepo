export const ChatMessage = `
type ChatMessage {
  _id: ID!
  conversationId: ObjectId!
  senderId: ObjectId!
  body: String!
  createdAt: Date!
  editedAt: Date
  deletedAt: Date
}
`;
