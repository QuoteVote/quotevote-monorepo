export const TypingIndicator = `
type TypingIndicator {
  _id: ID!
  conversationId: String!
  userId: String!
  isTyping: Boolean!
  lastTypingAt: Date
  user: User
}
`;
