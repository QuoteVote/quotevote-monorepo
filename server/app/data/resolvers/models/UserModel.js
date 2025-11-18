const mongoose = require('mongoose');

const schema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  name: {
    type: String,
  },
  companyName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  plan: {
    type: String,
    trim: true,
    default: 'personal',
  },
  stripeCustomerId: {
    type: String,
    trim: true,
  },
  hash_password: {
    type: String,
  },
  tokens: {
    type: Number,
    default: 0,
  },
  _wallet: {
    type: String,
  },
  avatar: {
    type: JSON,
    required: false,
  },
  _followersId: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  _followingId: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  _votesId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  favorited: {
    type: [],
  },
  joined: {
    type: Date,
    default: Date.now,
  },
  admin: {
    type: Boolean,
    required: true,
    default: false,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  contributorBadge: {
    type: Boolean,
    default: false,
  },
  themePreference: {
    type: String,
    default: 'light',
    enum: ['light', 'dark'],
  },
});

schema.index({ content: 'text' });

export default schema;
