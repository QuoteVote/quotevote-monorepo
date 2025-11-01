const mongoose = require('mongoose');

const schema = mongoose.Schema({
  // User who owns this roster
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
    index: true,
  },
  // Users in this user's roster
  contacts: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    // Status of the relationship
    status: {
      type: String,
      enum: ['pending', 'accepted', 'blocked', 'rejected'],
      default: 'pending',
    },
    // When the relationship was created
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // When the relationship was last updated
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    // Custom name/nickname for this contact
    nickname: {
      type: String,
      trim: true,
    },
  }],
  // When the roster was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // When the roster was last updated
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient querying
schema.index({ userId: 1, 'contacts.userId': 1 }, { unique: true });

// Update the updatedAt timestamp before saving
schema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Update the updatedAt timestamp for contacts
schema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

export default mongoose.model('rosters', schema);