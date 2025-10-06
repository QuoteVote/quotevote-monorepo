export const QuoteInput = `
input QuoteInput {
    postId: String!
    quoter: String!
    quoted: String!
    quote: String!
    startWordIndex: Int!
    endWordIndex: Int!
    isLocal: Boolean
    location: GeoInput
}
`;
