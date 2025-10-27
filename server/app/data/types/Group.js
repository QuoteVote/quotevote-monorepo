export const Group = `
type Group {
  _id: String!
  creatorId: String!
  created: String!
  title: String!
  description: String!
  url: String!
  privacy: String!
  allowedUserIds: [String!]
  adminIds: [String!]
  pendingUsers: [User]
}`;
