export const Roster = `
type Roster {
  _id: ID!
  userId: String!
  contactUserId: String!
  status: String!
  initiatedBy: String!
  createdAt: Date
  updatedAt: Date
  user: User
  contact: User
}
`;
