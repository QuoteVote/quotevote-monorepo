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
  reason: {
    type: String,
    enum: ['spam', 'harassment', 'inappropriate_content', 'fake_account', 'other'],
    required: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending',
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  adminNotes: {
    type: String,
    maxlength: 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
schema.index({ _reportedUserId: 1, status: 1 });
schema.index({ _reporterId: 1 });
schema.index({ createdAt: -1 });

export default mongoose.model('userReports', schema);
