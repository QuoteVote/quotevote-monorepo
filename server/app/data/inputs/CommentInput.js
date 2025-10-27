export const CommentInput = `
  input CommentInput {
    postId: String!
    userId: String!
    content: String!
    startWordIndex: Int!
    endWordIndex: Int!
    quote: String
    url: String
    reaction: String
  }
`;
