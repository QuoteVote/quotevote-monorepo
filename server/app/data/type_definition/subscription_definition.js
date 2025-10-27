export default `
# Subscription
type Subscription {    
    # Create message subscription
    message(messageRoomId: String!): Message   
    
    # Create notification subscription
    notification(userId: String!): Notification

    # Presence update subscription
    presenceUpdate(userId: String!): Presence

    # Typing indicator subscription
    typingUpdate(conversationId: String!): TypingIndicator

    # Roster update subscription
    rosterUpdate(userId: String!): Roster
}
`;
