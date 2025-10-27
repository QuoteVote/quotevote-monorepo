import mongoose from 'mongoose';

const schema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['online', 'away', 'dnd', 'invisible', 'offline'],
    default: 'offline',
    required: true,
  },
  awayMessage: {
    type: String,
    default: '',
    maxlength: 200,
  },
  lastHeartbeat: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// TTL index - automatically delete stale presence records after 2 minutes of inactivity
schema.index({ lastHeartbeat: 1 }, { expireAfterSeconds: 120 });

// Update the updatedAt timestamp before saving
schema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Presence', schema);
