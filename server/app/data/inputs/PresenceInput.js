// eslint-disable-next-line import/prefer-default-export
export const PresenceInput = `
  # Input for updating presence
  input PresenceInput {
    status: String!
    statusMessage: String
  }
`;

export const RosterInput = `
  # Input for roster operations
  input RosterInput {
    buddyId: String!
  }
`;

export const TypingInput = `
  # Input for typing indicators
  input TypingInput {
    messageRoomId: String!
    isTyping: Boolean!
  }
`;

