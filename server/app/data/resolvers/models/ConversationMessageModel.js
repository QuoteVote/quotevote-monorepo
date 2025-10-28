import mongoose from 'mongoose';

const schema = mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Conversation',
    index: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  editedAt: {
    type: Date,
    required: false,
  },
});

// Add compound index for efficient queries (conversationId + createdAt)
schema.index({ conversationId: 1, createdAt: -1 });

export default mongoose.model('ConversationMessage', schema);
