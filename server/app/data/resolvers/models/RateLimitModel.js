import mongoose from 'mongoose';

const schema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['message', 'presence_update', 'typing'],
  },
  count: {
    type: Number,
    default: 1,
  },
  windowStart: {
    type: Date,
    default: Date.now,
    index: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
});

// Compound index for efficient rate limit checks
schema.index({ userId: 1, action: 1, windowStart: 1 });

// TTL index - automatically delete expired rate limit records
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('RateLimit', schema);
