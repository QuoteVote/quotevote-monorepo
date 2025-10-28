export const Presence = `
  type Presence {
    userId: ID!
    status: String!
    text: String
    lastSeen: String!
  }
`;

export const PresenceInput = `
  input PresenceInput {
    userId: ID!
    status: String!
    text: String
    lastSeen: String!
  }
`;
