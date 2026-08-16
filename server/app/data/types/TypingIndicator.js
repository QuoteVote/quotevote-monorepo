export const TypingIndicator = `
  # Typing indicator type
  type TypingIndicator {
    messageRoomId: String!
    userId: String!
    user: User
    isTyping: Boolean!
    timestamp: Date!
  }

  # Typing mutation response
  #
  # Echoes the room and state back so a client with several open rooms can
  # correlate a response to the request that produced it.
  type TypingResponse {
    success: Boolean!
    messageRoomId: String
    isTyping: Boolean
  }
`;

