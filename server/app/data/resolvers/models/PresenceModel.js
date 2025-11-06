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
  statusMessage: {
    type: String,
    maxlength: 200,
    default: '',
  },
  lastHeartbeat: {
    type: Date,
    required: true,
    index: true,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  // TTL index - auto-delete stale presence after 5 minutes
  expiresAt: {
    type: Date,
    index: true,
  },
});

// Create TTL index
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Update expiresAt on every heartbeat
schema.pre('save', function (next) {
  this.expiresAt = new Date(Date.now() + 300000); // 5 minutes from now
  next();
});

export default mongoose.model('Presence', schema);

