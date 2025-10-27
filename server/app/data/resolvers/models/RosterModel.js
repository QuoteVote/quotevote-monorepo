import mongoose from 'mongoose';

const schema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  contactUserId: {
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure unique roster entries
schema.index({ userId: 1, contactUserId: 1 }, { unique: true });

// Update the updatedAt timestamp before saving
schema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Roster', schema);
