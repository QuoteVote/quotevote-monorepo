import mongoose from 'mongoose';

const schema = mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Conversation',
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true,
  },
  lastSeenMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'ConversationMessage',
  },
  lastSeenAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Add compound index for efficient queries (conversationId + userId)
schema.index({ conversationId: 1, userId: 1 }, { unique: true });

export default mongoose.model('Receipt', schema);