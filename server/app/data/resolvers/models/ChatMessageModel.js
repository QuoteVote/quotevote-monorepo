import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatConversation',
    required: true,
    index: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  body: {
    type: String,
    required: true,
    maxlength: 5000,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
    index: true,
  },
  editedAt: {
    type: Date,
  },
  deletedAt: {
    type: Date,
  },
});

schema.index({ conversationId: 1, createdAt: 1 });
schema.index({ body: 'text' });

export default mongoose.model('ChatMessage', schema);
