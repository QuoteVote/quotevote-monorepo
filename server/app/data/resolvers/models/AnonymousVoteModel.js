const mongoose = require('mongoose');

const schema = mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  sessionId: {
    type: String,
    required: true,
  },
  fingerprintHash: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  startWordIndex: {
    type: Number,
    required: true,
  },
  endWordIndex: {
    type: Number,
    required: true,
  },
  created: {
    type: Date,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

schema.index({
  postId: 1,
  commentId: 1,
  sessionId: 1,
  deleted: 1,
}, {
  unique: true,
  partialFilterExpression: {
    deleted: { $ne: true },
  },
});

schema.index({ content: 'text' });
schema.index({ sessionId: 1, created: -1 });

export default mongoose.model('AnonymousVotes', schema);
