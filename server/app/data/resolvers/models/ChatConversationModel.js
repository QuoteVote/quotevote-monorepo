import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['dm', 'room'],
    required: true,
    index: true,
  },
  memberIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  }],
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  lastMsgAt: {
    type: Date,
    index: true,
  },
});

schema.index({ type: 1, memberIds: 1 });
schema.index({ postId: 1 }, { sparse: true });

export default mongoose.model('ChatConversation', schema);
