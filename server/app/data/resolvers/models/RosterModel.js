import mongoose from 'mongoose';

const schema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  buddyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'blocked'],
    default: 'pending',
    required: true,
  },
  initiatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for efficient buddy lookups
schema.index({ userId: 1, buddyId: 1 }, { unique: true });
schema.index({ userId: 1, status: 1 });

// Update timestamp on save
schema.pre('save', function (next) {
  this.updated = Date.now();
  next();
});

export default mongoose.model('Roster', schema);

