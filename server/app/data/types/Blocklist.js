export const Blocklist = `
type Blocklist {
  _id: ID!
  userId: String!
  blockedUserId: String!
  reason: String
  createdAt: Date
  blockedUser: User
}
`;
