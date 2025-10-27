export const ReportUserInput = `
input ReportUserInput {
  _reportedUserId: String!
  reason: String!
  description: String
  severity: String
}

input SendUserInviteInput {
  email: String!
}
`;
