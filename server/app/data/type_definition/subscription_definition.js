export default `
# Subscription
type Subscription {    
    # Create message subscription
    message(messageRoomId: String!): Message   
    
    # Create notification subscription
    notification(userId: String!): Notification
    
    # Presence updates subscription
    presenceUpdates: Presence
    
    # Presence stream for specific users
    presenceStream(userIds: [ID!]): Presence
    
    # New message in conversation subscription
    msgNew(conversationId: ID!): Message!
}
`;
