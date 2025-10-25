export const ChatConversation = `
type ChatConversation {
  _id: ID!
  type: String!
  memberIds: [ObjectId!]!
  postId: ObjectId
  createdBy: ObjectId!
  createdAt: Date!
  lastMsgAt: Date
}
`;
