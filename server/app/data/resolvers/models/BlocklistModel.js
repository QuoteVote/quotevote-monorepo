import mongoose from 'mongoose';

const schema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  blockedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  reason: {
    type: String,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure unique block entries
schema.index({ userId: 1, blockedUserId: 1 }, { unique: true });

export default mongoose.model('Blocklist', schema);
