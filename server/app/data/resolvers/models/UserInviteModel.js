const mongoose = require('mongoose');

const schema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined', 'joined'],
    default: 'pending',
  },
  _inviterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  _invitedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: false,
  },
  joined: {
    type: Date,
    required: false,
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
schema.index({ _inviterId: 1, status: 1 });
schema.index({ email: 1 });
schema.index({ _invitedUserId: 1 });

export default mongoose.model('userInvites', schema);
