export const ChatReceipt = `
type ChatReceipt {
  _id: ID!
  conversationId: ObjectId!
  userId: ObjectId!
  lastSeenMessageId: ObjectId
  lastSeenAt: Date
}
`;
