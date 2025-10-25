export const TypingEvent = `
type TypingEvent {
  conversationId: ObjectId!
  userId: ObjectId!
  isTyping: Boolean!
  until: Date
}
`;
