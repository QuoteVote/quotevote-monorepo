import mongoose from 'mongoose';

const schema = mongoose.Schema({
  messageRoomId: {
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
    default: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  // Auto-expire typing indicators after 10 seconds
  expiresAt: {
    type: Date,
    index: true,
  },
});

schema.index({ messageRoomId: 1, userId: 1 }, { unique: true });

// Create TTL index
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

schema.pre('save', function (next) {
  this.expiresAt = new Date(Date.now() + 10000); // 10 seconds
  next();
});

export default mongoose.model('TypingIndicator', schema);

