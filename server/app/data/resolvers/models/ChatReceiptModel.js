import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatConversation',
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  lastSeenMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatMessage',
  },
  lastSeenAt: {
    type: Date,
    index: true,
  },
});

schema.index({ conversationId: 1, userId: 1 }, { unique: true });

export default mongoose.model('ChatReceipt', schema);
