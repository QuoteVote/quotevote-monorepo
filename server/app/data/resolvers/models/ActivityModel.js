import mongoose from 'mongoose';

const schema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  activityType: {
    type: String,
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  voteId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  quoteId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  content: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: true,
  },
});
schema.index({ content: 'text' });

export default mongoose.model('activities', schema);
