import mongoose from 'mongoose';

const schema = mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  isTyping: {
    type: Boolean,
    default: false,
  },
  lastTypingAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for efficient queries
schema.index({ conversationId: 1, userId: 1 }, { unique: true });

// TTL index - automatically delete stale typing indicators after 10 seconds
schema.index({ lastTypingAt: 1 }, { expireAfterSeconds: 10 });

export default mongoose.model('TypingIndicator', schema);
