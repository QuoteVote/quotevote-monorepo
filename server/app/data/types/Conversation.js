export default `
  type Conversation {
    id: ID!
    participantIds: [ID!]!
    isRoom: Boolean!
    postId: ID
    createdAt: String!
    participants: [User!]
    messages: [Message!]
  }

  type Message {
    id: ID!
    conversationId: ID!
    authorId: ID!
    body: String!
    createdAt: String!
    editedAt: String
    author: User
  }
`;
