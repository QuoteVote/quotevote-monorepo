export const Presence = `
type Presence {
  _id: ID!
  userId: String!
  status: String!
  awayMessage: String
  lastHeartbeat: Date
  lastSeen: Date
  updatedAt: Date
  user: User
}
`;
