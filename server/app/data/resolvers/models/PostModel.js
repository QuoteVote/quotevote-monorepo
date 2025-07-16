import mongoose from 'mongoose';

const schema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: false,
  },
  bookmarkedBy: {
    type: Array,
    required: false
  },
  rejectedBy: {
    type: Array,
    required: false,
  },
  approvedBy: {
    type: Array,
    required: false,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  reported: {
    type: Number,
    default: 0,
  },
  reportedBy: {
    type: Array,
    required: false,
  },
  approved: {
    type: Number,
    required: false,
  },
  votedBy: {
    type: Array,
    required: false,
  },
  dayPoints: {
    type: Number,
    default: 0
  },
  pointTimestamp: {
    type: Date,
    default: Date.now
  },
  featuredSlot: {
    type: Number,
    min: 1,
    max: 12,
    unique: true,
    sparse: true,
    required: false,
  },
  messageRoomId: {
    type: String,
    required: false,
  },
  urlId: {
    type: String,
    required: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  enable_voting: {
    type: Boolean,
    default: false,
  }
});

schema.index({ title: 'text', text: 'text' });
schema.index({ featuredSlot: 1 }, { unique: true, sparse: true });
// Add indexes for filtering performance
schema.index({ featuredSlot: 1, created: -1 });
schema.index({ featuredSlot: 1, pointTimestamp: -1 });
schema.index({ featuredSlot: 1, userId: 1 });
schema.index({ featuredSlot: 1, groupId: 1 });
schema.index({ featuredSlot: 1, deleted: 1 });
schema.index({ featuredSlot: 1, approved: 1 });
schema.index({ userId: 1, featuredSlot: 1 });
schema.index({ groupId: 1, featuredSlot: 1 });

export default mongoose.model('posts', schema);
