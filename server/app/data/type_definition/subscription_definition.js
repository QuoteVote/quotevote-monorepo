export default `
# Subscription
type Subscription {    
    # Create message subscription
    message(messageRoomId: String!): Message   
    
    # Create notification subscription
    notification(userId: String!): Notification
    
    # ===== Presence Subscriptions =====
    # Subscribe to presence updates
    presence(userId: String): PresenceUpdate
    
    # ===== Roster Subscriptions =====
    # Subscribe to roster changes (buddy requests, etc.)
    roster(userId: String!): Roster
    
    # ===== Typing Subscriptions =====
    # Subscribe to typing indicators in a room
    typing(messageRoomId: String!): TypingIndicator
}
`;
