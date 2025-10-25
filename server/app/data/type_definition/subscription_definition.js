export default `
# Subscription
type Subscription {
    # Create message subscription
    message(messageRoomId: String!): Message

    # Create notification subscription
    notification(userId: String!): Notification

    # Presence subscription
    presenceUpdated(userId: ObjectId!): Presence

    # Chat message stream subscription
    messageAdded(conversationId: ObjectId!): ChatMessage

    # Typing indicator subscription
    typingUpdated(conversationId: ObjectId!): TypingEvent

    # Read receipt subscription
    receiptUpdated(conversationId: ObjectId!): ChatReceipt
}
`;
