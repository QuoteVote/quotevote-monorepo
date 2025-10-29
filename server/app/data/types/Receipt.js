export default `
  type Receipt {
    conversationId: ID!
    userId: ID!
    lastSeenMessageId: ID
    lastSeenAt: String!
  }
`;