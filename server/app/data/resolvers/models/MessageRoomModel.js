import mongoose from 'mongoose';

const schema = mongoose.Schema({
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  messageType: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  // Track if this is a direct message (DM) vs group/post chat
  isDirect: {
    type: Boolean,
    default: false,
  },
  // Track last activity for sorting
  lastActivity: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
schema.index({ users: 1, lastActivity: -1 });

export default mongoose.model('MessageRoom', schema);
