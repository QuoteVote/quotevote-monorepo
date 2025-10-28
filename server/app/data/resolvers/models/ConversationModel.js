import mongoose from 'mongoose';

const schema = mongoose.Schema({
  participantIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    index: true,
  },
  isRoom: {
    type: Boolean,
    required: true,
    default: false,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Add compound index for efficient queries
schema.index({ participantIds: 1, createdAt: -1 });

export default mongoose.model('Conversation', schema);
