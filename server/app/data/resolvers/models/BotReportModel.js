const mongoose = require('mongoose');

const schema = mongoose.Schema({
  _reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  _reportedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries and to prevent duplicate reports
schema.index({ _reporterId: 1, _reportedUserId: 1 }, { unique: true });
schema.index({ _reportedUserId: 1 });
schema.index({ createdAt: -1 });

export default mongoose.model('botReports', schema);

