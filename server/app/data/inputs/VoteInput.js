export const VoteInput = `
input VoteInput {
    postId: String!
    userId: String
    type: String!
    tags: String!
    startWordIndex: Int!
    endWordIndex: Int!
    content: String
}
`;
